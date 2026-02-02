import { NextResponse } from 'next/server';
import { getDatabase } from '../../../../utils/database.js';

const db = getDatabase();

// GET /api/admin/stats - Get dashboard statistics
export async function GET(request) {
  try {
    await db.init();

    // Get event statistics
    const eventStats = await db.getEventStats();
    
    // Get city event counts
    const cityEventCounts = await db.getCityEventCounts();
    
    // Get all cities for total count
    const allCities = await db.getAllCities();

    // Calculate additional metrics
    const activeCitiesWithEvents = cityEventCounts.filter(city => city.active_events > 0).length;
    const avgEventsPerCity = cityEventCounts.length > 0 
      ? (eventStats.total_events / cityEventCounts.length).toFixed(2) 
      : 0;

    // Top cities by event count
    const topCities = cityEventCounts
      .sort((a, b) => b.active_events - a.active_events)
      .slice(0, 5)
      .map(cityCount => {
        const cityInfo = allCities.find(city => city.slug === cityCount.city_slug);
        return {
          ...cityCount,
          city_name_ar: cityInfo?.name_ar || cityCount.city_slug,
          city_name_en: cityInfo?.name_en || cityCount.city_slug
        };
      });

    // Recent activity (simplified for now - could be enhanced with actual activity tracking)
    const recentEvents = await db.getAllEvents();
    const recentActivity = recentEvents
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10)
      .map(event => ({
        id: event.id,
        type: 'event_created',
        title: event.title,
        city_slug: event.city_slug,
        created_at: event.created_at,
        is_active: event.is_active,
        is_featured: event.is_featured
      }));

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          total_events: eventStats.total_events,
          active_events: eventStats.active_events,
          featured_events: eventStats.featured_events,
          total_cities: allCities.length,
          cities_with_events: eventStats.cities_with_events,
          active_cities_with_events: activeCitiesWithEvents,
          avg_events_per_city: parseFloat(avgEventsPerCity)
        },
        top_cities: topCities,
        recent_activity: recentActivity,
        city_breakdown: cityEventCounts.map(cityCount => {
          const cityInfo = allCities.find(city => city.slug === cityCount.city_slug);
          return {
            ...cityCount,
            city_name_ar: cityInfo?.name_ar || cityCount.city_slug,
            city_name_en: cityInfo?.name_en || cityCount.city_slug
          };
        })
      }
    });

  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 