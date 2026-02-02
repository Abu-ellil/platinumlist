import { NextResponse } from 'next/server';
import { getDatabase } from '../../../../utils/database.js';

const db = getDatabase();

// GET /api/admin/events - Get all events or events by city
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const citySlug = searchParams.get('city');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const search = searchParams.get('search');
    const status = searchParams.get('status'); // active, inactive, all

    await db.init();

    let events;
    if (citySlug) {
      events = await db.getEventsByCity(citySlug);
    } else {
      events = await db.getAllEvents();
    }

    // Apply search filter
    if (search) {
      const searchTerm = search.toLowerCase();
      events = events.filter(event => 
        event.title.toLowerCase().includes(searchTerm) ||
        (event.description && event.description.toLowerCase().includes(searchTerm)) ||
        (event.venue && event.venue.toLowerCase().includes(searchTerm)) ||
        (event.category && event.category.toLowerCase().includes(searchTerm))
      );
    }

    // Apply status filter
    if (status && status !== 'all') {
      const isActive = status === 'active' ? 1 : 0;
      events = events.filter(event => event.is_active === isActive);
    }

    // Pagination
    const totalEvents = events.length;
    const totalPages = Math.ceil(totalEvents / limit);
    const startIndex = (page - 1) * limit;
    const paginatedEvents = events.slice(startIndex, startIndex + limit);

    // Parse JSON fields
    const processedEvents = paginatedEvents.map(event => ({
      ...event,
      tags: event.tags ? JSON.parse(event.tags) : [],
      metadata: event.metadata ? JSON.parse(event.metadata) : {}
    }));

    return NextResponse.json({
      success: true,
      data: {
        events: processedEvents,
        pagination: {
          page,
          limit,
          totalEvents,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// POST /api/admin/events - Create new event
export async function POST(request) {
  try {
    const eventData = await request.json();
    console.log('Creating event with data:', { 
      city_slug: eventData.city_slug, 
      title: eventData.title,
      keys: Object.keys(eventData) 
    });

    // Validate required fields
    if (!eventData.city_slug || !eventData.title) {
      console.log('Validation failed: missing city_slug or title');
      return NextResponse.json({
        success: false,
        error: 'City slug and title are required'
      }, { status: 400 });
    }

    // Validate that at least one pricing tier is set
    const hasPricing = eventData.global_price || 
                      eventData.gold_price || 
                      eventData.platinum_price || 
                      eventData.vip_price || 
                      eventData.silver_price ||
                      eventData.diamond_price ||
                      eventData.price; // Include legacy price for backward compatibility
    
    if (!hasPricing) {
      console.log('Validation failed: no pricing tier specified');
      return NextResponse.json({
        success: false,
        error: 'At least one pricing tier must be specified'
      }, { status: 400 });
    }

    await db.init();



    const result = await db.createEvent(eventData);

    if (result.success) {
      // Get the created event
      const newEvent = await db.getEventById(result.id);
      const processedEvent = {
        ...newEvent,
        tags: newEvent.tags ? JSON.parse(newEvent.tags) : [],
        metadata: newEvent.metadata ? JSON.parse(newEvent.metadata) : {}
      };

      console.log('Event created successfully with ID:', result.id);
      return NextResponse.json({
        success: true,
        data: processedEvent,
        message: 'Event created successfully'
      }, { status: 201 });
    } else {
      console.log('Event creation failed:', result.error);
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 