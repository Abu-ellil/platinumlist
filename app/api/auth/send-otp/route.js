import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getDatabase } from '@/utils/database';

// Generate 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create email transporter (configure with your email service)
const transporter = nodemailer.createTransport({
    host: 'smtp.dreamhost.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'ticket@plateniemlist.net',
        pass: 'UOKd!8g1*ha2Ru9g',
    },
});

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({
                success: false,
                error: 'البريد الإلكتروني مطلوب'
            }, { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({
                success: false,
                error: 'البريد الإلكتروني غير صحيح'
            }, { status: 400 });
        }

        // Generate OTP
        const otp = generateOTP();
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

        // Store OTP in database
        const db = getDatabase();
        console.log('Database instance created');
        
        await db.init();
        console.log('Database initialized');
        
        // First, clean up any expired OTPs
        const cleanupResult = await db.deleteExpiredOTPs();
        console.log('Cleanup result:', cleanupResult);
        
        // Store the new OTP
        const storeResult = await db.storeOTP(email, otp, expiresAt, 0);
        console.log('OTP storage result:', storeResult);
        
        if (!storeResult.success) {
            throw new Error(`Failed to store OTP: ${storeResult.error}`);
        }

        // Email template
        const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code - Platinum List</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: ltr; text-align: left; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .logo { margin-bottom: 20px; }
          .logo img { height: 40px; width: auto; }
          .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .otp-code { font-size: 32px; font-weight: bold; color: #667eea; text-align: center; background: #f0f4ff; padding: 20px; border-radius: 10px; margin: 20px 0; letter-spacing: 3px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <img src="https://cdn.platinumlist.net/dist/v816/img/main/logo-template/pl-logo-desktop-ar.svg" alt="Platinum List" />
            </div>
            <h1>Verification Code</h1>
            <p>Platinum List</p>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>A verification code has been requested for your Platinum List account. Use the following code to complete your registration:</p>
            
            <div class="otp-code">${otp}</div>
            
            <p><strong>This code is valid for 5 minutes only.</strong></p>
            <p>If you did not request this code, please ignore this email.</p>
            
            <div class="footer">
              <p>Thank you for choosing Platinum List</p>
              <p>© ${new Date().getFullYear()} Platinum List. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

            // Send email
    await transporter.sendMail({
      from: '"Platinum List" <ticket@plateniemlist.net>',
      to: email,
      subject: 'Verification Code - Platinum List',
      html: emailHtml,
    });

        return NextResponse.json({
            success: true,
            message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني'
        });

      } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'فشل في إرسال رمز التحقق. يرجى المحاولة مرة أخرى.' 
    }, { status: 500 });
  }
} 