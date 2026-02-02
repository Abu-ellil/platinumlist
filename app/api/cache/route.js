import { NextResponse } from 'next/server';
import { getCacheStats, clearCache } from '../../../utils/scraper.js';

// GET - View cache statistics
export async function GET() {
  try {
    const stats = getCacheStats();
    
    return NextResponse.json({
      success: true,
      cache: stats,
      message: 'Cache statistics retrieved successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// DELETE - Clear cache
export async function DELETE() {
  try {
    clearCache();
    
    return NextResponse.json({
      success: true,
      message: 'Cache cleared successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 