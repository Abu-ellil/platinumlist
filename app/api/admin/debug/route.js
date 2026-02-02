import { NextResponse } from 'next/server';
import { getDatabase } from '../../../../utils/database.js';

const db = getDatabase();

// GET /api/admin/debug - Debug database state
export async function GET(request) {
  try {
    await db.init();
    
    // Get all cities
    const cities = await db.getAllCities();
    
    // Get all events
    const events = await db.getAllEvents();
    
    // Get database stats
    const stats = await db.getEventStats();
    
    // Check a specific city slug if provided
    const { searchParams } = new URL(request.url);
    const testSlug = searchParams.get('testSlug');
    let cityCheck = null;
    
    if (testSlug) {
      cityCheck = await db.getCityBySlug(testSlug);
    }
    
    return NextResponse.json({
      success: true,
      data: {
        cities: {
          count: cities.length,
          list: cities.map(city => ({ slug: city.slug, name_ar: city.name_ar, is_active: city.is_active }))
        },
        events: {
          count: events.length,
          list: events.slice(0, 5).map(event => ({ 
            id: event.id, 
            title: event.title, 
            city_slug: event.city_slug,
            created_at: event.created_at 
          }))
        },
        stats,
        cityCheck: testSlug ? { 
          searched: testSlug, 
          found: cityCheck ? true : false, 
          data: cityCheck 
        } : null,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 