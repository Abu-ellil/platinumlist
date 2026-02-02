import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create email transporter using the working plateniemlist.net email
const transporter = nodemailer.createTransport({
    host: 'smtp.dreamhost.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'ticket@plateniemlist.net',
        pass: 'UOKd!8g1*ha2Ru9g',
    },
});

// Simple API key for security (you should change this)
const API_KEY = process.env.EMAIL_API_KEY || 'platinum-email-api-key-2024';

export async function POST(request) {
    try {
        // Verify API key for security
        const apiKey = request.headers.get('x-api-key');
        if (apiKey !== API_KEY) {
            return NextResponse.json({
                success: false,
                error: 'Unauthorized'
            }, { status: 401 });
        }

        const { to, subject, html, from } = await request.json();

        // Validate required fields
        if (!to || !subject || !html) {
            return NextResponse.json({
                success: false,
                error: 'Missing required fields: to, subject, html'
            }, { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(to)) {
            return NextResponse.json({
                success: false,
                error: 'Invalid email address'
            }, { status: 400 });
        }

        // Send email using plateniemlist.net
        await transporter.sendMail({
            from: from || '"Platinum List" <ticket@plateniemlist.net>',
            to: to,
            subject: subject,
            html: html,
        });

        console.log(`Email sent successfully to ${to}`);

        return NextResponse.json({
            success: true,
            message: 'Email sent successfully'
        });

    } catch (error) {
        console.error('Send email error:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to send email: ' + error.message 
        }, { status: 500 });
    }
}

