import { NextResponse } from 'next/server';

const ADMIN_PASSWORD = '1122331344'; // Hardcoded password

export async function POST(request) {
    try {
        const { password } = await request.json();
        
        if (!password) {
            return NextResponse.json({
                success: false,
                error: 'كلمة المرور مطلوبة'
            }, { status: 400 });
        }
        
        if (password === ADMIN_PASSWORD) {
            return NextResponse.json({
                success: true,
                message: 'تم تسجيل الدخول بنجاح'
            });
        } else {
            return NextResponse.json({
                success: false,
                error: 'كلمة مرور خاطئة'
            }, { status: 401 });
        }
        
    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json({
            success: false,
            error: 'خطأ في الخادم'
        }, { status: 500 });
    }
} 