'use client';
import { useState } from 'react';
import TicketFooter from './TicketFooter';

const LoginPage = ({ selectedSeats, onBack, onLogin }) => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState([]);

    const validateEmail = (email) => {
        const errors = [];
        
        if (!email.trim()) {
            errors.push('هذا الحقل فارغ. الرجاء تعبئة جميع الحقول');
            return errors;
        }
        
        if (email.length < 5) {
            errors.push(`طول '${email}' يجب أن يكون 5 حرف على الأقل`);
        }
        
        if (email.length > 255) {
            errors.push(`طول '${email}' يجب أن يكون 255 كحد أقصى`);
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('الرجاء إدخال عنوان بريد إلكتروني صالح');
        }
        
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateEmail(email);
        setErrors(validationErrors);
        
        if (validationErrors.length > 0) {
            return;
        }
        
        setIsSubmitting(true);
        
        // Simulate API call for login/registration
        setTimeout(() => {
            setIsSubmitting(false);
            if (onLogin) {
                onLogin(email);
            }
        }, 1000);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (errors.length > 0) {
            setErrors([]);
        }
    };

    return (
        <div className="login-page">
            <div className="modal-container container2">
                <div className="modal-container__container">
                    <div className="modal-container__content">
                        <form 
                            encType="application/x-www-form-urlencoded" 
                            className="quick-order-form-step-one quick-order-form-step-one--checkout" 
                            method="post"
                            onSubmit={handleSubmit}
                        >
                            <div className="quick-order-form-step-one__content">
                                <a 
                                    className="quick-order-form-step-one__back" 
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (onBack) onBack();
                                    }}
                                >
                                    <svg className="icon icon-24-kit-arrow-left">
                                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </a>
                                <div className="quick-order-form-step-one__title">الطلب السريع</div>
                                <div className="quick-order-form-step-one__sub-title">
                                    يرجى إدخال بريدك الإلكتروني لتسجيل الدخول، وإن كانت هذه زيارتك الأولى، سنساعدك في التسجيل.
                                </div>
                                <div className="quick-order-form-step-one__elements">
                                    <input type="hidden" name="csrf_token" value="8576816ef553b41f94f75557bca55196" />
                                    <div className={`pl-kit-form-text pl-kit-form-text--big ${errors.length > 0 ? 'pl-kit-form-text--invalid' : ''}`}>
                                        <div className="pl-kit-form-text__content">
                                            <div className="pl-kit-form-text__content-inner">
                                                <input 
                                                    type="text" 
                                                    name="email" 
                                                    value={email}
                                                    onChange={handleEmailChange}
                                                    className="pl-kit-form-text__input" 
                                                    placeholder=" "
                                                    autoFocus
                                                />
                                                <label className="pl-kit-form-text__label required">البريد الإلكتروني</label>
                                            </div>
                                        </div>
                                        {errors.length > 0 && (
                                            <ul className="pl-kit-form-text__errors">
                                                {errors.map((error, index) => (
                                                    <li key={index}>{error}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <input type="submit" className="hidden form-hiddenSubmit" tabIndex="-1" disabled />
                                </div>
                                <div className="quick-order-form-step-one__submit">
                                    <input 
                                        type="submit" 
                                        name="submit" 
                                        value={isSubmitting ? "جاري التحميل..." : "استمرار"}
                                        className="pl-kit-btn pl-kit-btn--action pl-kit-btn--big pl-kit-btn--wide" 
                                        disabled={isSubmitting || !email.trim()}
                                    />
                                </div>
                            </div>
                            <div className="quick-order-form-step-one__note">
                                <p className="auth-terms-note">
                                    من خلال التسجيل لإنشاء حساب أوافق على{' '}
                                    <a href="/ar/terms-and-conditions" className="auth-terms-note__link" target="_blank" rel="noopener noreferrer">
                                        شروط الاستخدام و سياسة الخصوصية
                                    </a>
                                    {' '}لشركة بلاتنيوم لِست.
                                </p>
                            </div>
                        </form>
                        <a 
                            className="modal-container__close" 
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (onBack) onBack();
                            }}
                        >
                            <svg className="icon icon-24-kit-cross">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            {/* Keep the smart footer */}
            <TicketFooter 
                selectedSeats={selectedSeats} 
                onCheckout={() => {
                    console.log('Proceeding to checkout from login page');
                }}
            />

            <style jsx>{`
                .login-page {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .modal-container {
                    position: relative;
                    max-width: 500px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                }

                .modal-container__container {
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                    position: relative;
                }

                .modal-container__content {
                    padding: 40px 30px;
                    position: relative;
                }

                .quick-order-form-step-one__content {
                    position: relative;
                }

                .quick-order-form-step-one__back {
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #f8f9fa;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
                    color: #374151;
                    transition: all 0.2s ease;
                    border: 1px solid #e5e7eb;
                }

                .quick-order-form-step-one__back:hover {
                    background: #e5e7eb;
                    transform: translateY(-1px);
                }

                .icon {
                    width: 24px;
                    height: 24px;
                }

                .quick-order-form-step-one__title {
                    font-size: 28px;
                    font-weight: 700;
                    color: #1f2937;
                    text-align: center;
                    margin-bottom: 12px;
                    font-family: 'Cairo', sans-serif;
                }

                .quick-order-form-step-one__sub-title {
                    font-size: 16px;
                    color: #6b7280;
                    text-align: center;
                    line-height: 1.6;
                    margin-bottom: 30px;
                    font-family: 'Cairo', sans-serif;
                }

                .quick-order-form-step-one__elements {
                    margin-bottom: 30px;
                }

                .pl-kit-form-text {
                    position: relative;
                    margin-bottom: 20px;
                }

                .pl-kit-form-text--big {
                    font-size: 16px;
                }

                .pl-kit-form-text__content {
                    position: relative;
                }

                .pl-kit-form-text__content-inner {
                    position: relative;
                }

                .pl-kit-form-text__input {
                    width: 100%;
                    padding: 20px 16px 8px 16px;
                    border: 2px solid #e5e7eb;
                    border-radius: 12px;
                    font-size: 16px;
                    background: white;
                    transition: all 0.2s ease;
                    outline: none;
                    font-family: 'Cairo', sans-serif;
                    direction: ltr;
                    text-align: left;
                }

                .pl-kit-form-text__input:focus {
                    border-color: #4f46e5;
                    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
                }

                .pl-kit-form-text__input:focus + .pl-kit-form-text__label,
                .pl-kit-form-text__input:not(:placeholder-shown) + .pl-kit-form-text__label {
                    transform: translateY(-12px) scale(0.85);
                    color: #4f46e5;
                }

                .pl-kit-form-text__label {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    font-size: 16px;
                    color: #9ca3af;
                    transition: all 0.2s ease;
                    pointer-events: none;
                    background: white;
                    padding: 0 4px;
                    font-family: 'Cairo', sans-serif;
                    transform-origin: top right;
                }

                .pl-kit-form-text__label.required::after {
                    content: '*';
                    color: #ef4444;
                    margin-left: 4px;
                }

                .pl-kit-form-text--invalid .pl-kit-form-text__input {
                    border-color: #ef4444;
                    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
                }

                .pl-kit-form-text--invalid .pl-kit-form-text__label {
                    color: #ef4444;
                }

                .pl-kit-form-text__errors {
                    list-style: none;
                    padding: 0;
                    margin: 8px 0 0 0;
                }

                .pl-kit-form-text__errors li {
                    color: #ef4444;
                    font-size: 14px;
                    font-family: 'Cairo', sans-serif;
                    margin-bottom: 4px;
                }

                .hidden {
                    display: none;
                }

                .pl-kit-btn {
                    border: none;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Cairo', sans-serif;
                }

                .pl-kit-btn--action {
                    background: #4f46e5;
                    color: white;
                }

                .pl-kit-btn--action:hover:not(:disabled) {
                    background: #4338ca;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
                }

                .pl-kit-btn--action:disabled {
                    background: #d1d5db;
                    color: #9ca3af;
                    cursor: not-allowed;
                }

                .pl-kit-btn--big {
                    padding: 16px 24px;
                    font-size: 16px;
                }

                .pl-kit-btn--wide {
                    width: 100%;
                }

                .quick-order-form-step-one__note {
                    text-align: center;
                    margin-top: 20px;
                }

                .auth-terms-note {
                    font-size: 14px;
                    color: #6b7280;
                    line-height: 1.5;
                    margin: 0;
                    font-family: 'Cairo', sans-serif;
                }

                .auth-terms-note__link {
                    color: #4f46e5;
                    text-decoration: none;
                }

                .auth-terms-note__link:hover {
                    text-decoration: underline;
                }

                .modal-container__close {
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #f8f9fa;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
                    color: #374151;
                    transition: all 0.2s ease;
                    border: 1px solid #e5e7eb;
                }

                .modal-container__close:hover {
                    background: #e5e7eb;
                    transform: translateY(-1px);
                }

                @media (max-width: 768px) {
                    .modal-container {
                        width: 95%;
                        margin: 20px auto;
                    }

                    .modal-container__content {
                        padding: 30px 20px;
                    }

                    .quick-order-form-step-one__title {
                        font-size: 24px;
                    }

                    .quick-order-form-step-one__sub-title {
                        font-size: 14px;
                    }
                }

                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
            `}</style>
        </div>
    );
};

export default LoginPage; 