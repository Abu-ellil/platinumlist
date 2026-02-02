import { NextResponse } from 'next/server';
import { getDatabase } from '../../../../utils/database';

const db = getDatabase();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const key = searchParams.get('key');

    let settings;
    
    if (key) {
      // Get specific setting by key
      const setting = await db.getSettingByKey(key);
      if (!setting) {
        return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
      }
      settings = [setting];
    } else if (category) {
      // Get settings by category
      settings = await db.getSettingsByCategory(category);
    } else {
      // Get all settings
      settings = await db.getAllSettings();
    }

    return NextResponse.json({ 
      success: true, 
      settings: settings || [] 
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch settings' 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { key, value, description, category } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ 
        success: false, 
        error: 'Key and value are required' 
      }, { status: 400 });
    }

    const result = await db.createSetting({
      key,
      value,
      description,
      category: category || 'general'
    });

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Setting created successfully',
        id: result.id 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error creating setting:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create setting' 
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { key, value, description, category } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ 
        success: false, 
        error: 'Key and value are required' 
      }, { status: 400 });
    }

    // Use upsert to update or create
    const result = await db.upsertSetting({
      key,
      value,
      description,
      category: category || 'general'
    });

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Setting updated successfully' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating setting:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update setting' 
    }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ 
        success: false, 
        error: 'Key is required' 
      }, { status: 400 });
    }

    const result = await db.deleteSetting(key);

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Setting deleted successfully' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error deleting setting:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete setting' 
    }, { status: 500 });
  }
} 