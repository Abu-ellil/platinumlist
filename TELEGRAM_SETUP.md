# Telegram Bot Setup for Order Notifications

The checkout API now includes automatic Telegram notifications for all successful orders.

## Current Configuration

The API is currently configured with the following default values:
- **Bot Token**: `7898415400:AAF4I6oiuRmLl40r5U-NROl3oENddUlVv5U`
- **Chat ID**: `6032588551` (your user ID)

These values are hardcoded as fallbacks when environment variables are not set, so Telegram notifications should work immediately.

## How It Works

When a customer completes a successful checkout, the system will automatically send a formatted message to your Telegram chat containing:

- **Order Details**: Order ID, total amount, payment method, card last 4 digits
- **Customer Information**: Name, email, phone, country  
- **Event Details**: Event name, venue, date, time
- **Selected Seats**: Complete list with categories, rows, and seat numbers
- **Additional Services**: Refund guarantee, WhatsApp notifications
- **Order Timestamp**: In Cairo timezone

## Example Notification Message

```
🎫 NEW ORDER RECEIVED

📋 Order Details:
• Order ID: ORDER_1703123456_abc123def
• Total: 5310.84 EGP
• Status: completed
• Payment Method: credit_card
• Card Last 4: ****1234

👤 Customer Information:
• Name: أحمد محمد علي
• Email: ahmed@example.com
• Phone: +971501234567
• Country: United Arab Emirates

🎪 Event Details:
• Event: Concert at Dubai Opera
• Venue: Dubai Opera House
• Date: 2024-01-15
• Time: 21:00

🎟️ Selected Seats (2):
• VIP GOLD - Row A, Seat 15 (2500.00 EGP)
• VIP GOLD - Row A, Seat 16 (2500.00 EGP)

⚡ Additional Services:
✅ Refund Guarantee
✅ WhatsApp Notifications

⏰ Order Time: 12/21/2023, 3:30:45 PM (Cairo Time)
```

## Environment Variables (Optional)

If you want to override the default values, you can set these environment variables:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

## Testing

To test the integration:
1. Complete a checkout process through your website
2. Check your Telegram for the notification message
3. Monitor the server console for any errors

## Security Notes

- The bot token is currently hardcoded for convenience
- Consider moving to environment variables in production
- The API never stores sensitive card data - only the last 4 digits
- All customer data is included in notifications for order management

## Troubleshooting

- Check the Next.js console for any Telegram API errors
- Ensure your bot is still active and the token is valid
- Verify the chat ID is correct (should be your user ID: 6032588551) 