import { NextResponse } from 'next/server';
import { getDatabase } from '../../../../../utils/database.js';

const db = getDatabase();

// GET /api/admin/events/[id] - Get single event
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    await db.init();
    
    const event = await db.getEventById(parseInt(id));
    
    if (!event) {
      return NextResponse.json({
        success: false,
        error: 'Event not found'
      }, { status: 404 });
    }

    // Parse JSON fields
    const processedEvent = {
      ...event,
      tags: event.tags ? JSON.parse(event.tags) : [],
      metadata: event.metadata ? JSON.parse(event.metadata) : {}
    };

    return NextResponse.json({
      success: true,
      data: processedEvent
    });

  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// PUT /api/admin/events/[id] - Update event
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const eventData = await request.json();

    await db.init();

    // Check if event exists
    const existingEvent = await db.getEventById(parseInt(id));
    if (!existingEvent) {
      return NextResponse.json({
        success: false,
        error: 'Event not found'
      }, { status: 404 });
    }

    // Validate required fields
    if (!eventData.title) {
      return NextResponse.json({
        success: false,
        error: 'Title is required'
      }, { status: 400 });
    }

    const result = await db.updateEvent(parseInt(id), eventData);

    if (result.success) {
      // Get the updated event
      const updatedEvent = await db.getEventById(parseInt(id));
      const processedEvent = {
        ...updatedEvent,
        tags: updatedEvent.tags ? JSON.parse(updatedEvent.tags) : [],
        metadata: updatedEvent.metadata ? JSON.parse(updatedEvent.metadata) : {}
      };

      return NextResponse.json({
        success: true,
        data: processedEvent,
        message: 'Event updated successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// DELETE /api/admin/events/[id] - Delete event
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    await db.init();

    // Check if event exists
    const existingEvent = await db.getEventById(parseInt(id));
    if (!existingEvent) {
      return NextResponse.json({
        success: false,
        error: 'Event not found'
      }, { status: 404 });
    }

    const result = await db.deleteEvent(parseInt(id));

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Event deleted successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// PATCH /api/admin/events/[id] - Toggle event status
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { action, is_active } = await request.json();

    await db.init();

    // Check if event exists
    const existingEvent = await db.getEventById(parseInt(id));
    if (!existingEvent) {
      return NextResponse.json({
        success: false,
        error: 'Event not found'
      }, { status: 404 });
    }

    if (action === 'toggle_status') {
      const newStatus = is_active !== undefined ? is_active : !existingEvent.is_active;
      const result = await db.toggleEventStatus(parseInt(id), newStatus);

      if (result.success) {
        // Get the updated event
        const updatedEvent = await db.getEventById(parseInt(id));
        const processedEvent = {
          ...updatedEvent,
          tags: updatedEvent.tags ? JSON.parse(updatedEvent.tags) : [],
          metadata: updatedEvent.metadata ? JSON.parse(updatedEvent.metadata) : {}
        };

        return NextResponse.json({
          success: true,
          data: processedEvent,
          message: `Event ${newStatus ? 'activated' : 'deactivated'} successfully`
        });
      } else {
        return NextResponse.json({
          success: false,
          error: result.error
        }, { status: 500 });
      }
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid action'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error updating event status:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 