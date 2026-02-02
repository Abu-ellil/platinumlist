import { NextResponse } from 'next/server';
import { getEventData } from '../../../utils/eventData.js';

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const slug = decodeURIComponent(searchParams.get('slug'));
    const city = searchParams.get('city') || 'cairo';
    const skipCache = searchParams.get('skipCache') === 'true';
    
    if (!slug) {
      return NextResponse.json({
        success: false,
        error: 'Event slug is required'
      }, { status: 400 });
    }
    
    const result = await getEventData(slug, city, skipCache);

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Events API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}