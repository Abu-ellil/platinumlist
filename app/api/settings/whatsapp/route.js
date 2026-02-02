import { NextResponse } from 'next/server';
import { getDatabase } from '../../../../utils/database';

const db = getDatabase();

export async function GET() {
  try {
    const setting = await db.getSettingByKey('whatsapp_number');
    
    if (!setting) {
      // Return default if not found
      return NextResponse.json({ 
        success: true, 
        whatsapp_number: '971501408768' // Default fallback
      });
    }

    return NextResponse.json({ 
      success: true, 
      whatsapp_number: setting.value 
    });
  } catch (error) {
    console.error('Error fetching WhatsApp number:', error);
    // Return default on error
    return NextResponse.json({ 
      success: true, 
      whatsapp_number: '971501408768' // Default fallback
    });
  }
} 