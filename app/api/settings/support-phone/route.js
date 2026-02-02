import { NextResponse } from 'next/server';
import { getDatabase } from '../../../../utils/database';

const db = getDatabase();

export async function GET() {
  try {
    const setting = await db.getSettingByKey('support_phone');
    
    if (!setting) {
      // Return default if not found
      return NextResponse.json({ 
        success: true, 
        support_phone: '920008640' // Default fallback
      });
    }

    return NextResponse.json({ 
      success: true, 
      support_phone: setting.value 
    });
  } catch (error) {
    console.error('Error fetching support phone number:', error);
    // Return default on error
    return NextResponse.json({ 
      success: true, 
      support_phone: '920008640' // Default fallback
    });
  }
} 