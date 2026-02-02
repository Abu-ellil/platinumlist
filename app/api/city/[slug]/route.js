import { NextResponse } from 'next/server';
import { getCityData } from '../../../../utils/cityData.js';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const result = await getCityData(slug);
    
    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
