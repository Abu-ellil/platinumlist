'use client';
import { useState } from 'react';

const PaymentMethods = ({ onPaymentDataChange }) => {
    const [formData, setFormData] = useState({
        cc_number: '',
        cc_exp_month: '',
        cc_exp_year: '',
        cc_cvc: ''
    });

    const [errors, setErrors] = useState({});

    // Luhn algorithm for credit card validation
    const validateLuhn = (number) => {
        const cleanNumber = number.replace(/\s/g, '');
        let sum = 0;
        let alternate = false;
        
        // Loop through values starting from the rightmost digit
        for (let i = cleanNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cleanNumber[i]);
            
            if (alternate) {
                digit *= 2;
                if (digit > 9) {
                    digit = Math.floor(digit / 10) + (digit % 10);
                }
            }
            
            sum += digit;
            alternate = !alternate;
        }
        
        return sum % 10 === 0;
    };

    const validateField = (fieldName, value) => {
        let error = '';

        switch (fieldName) {
            case 'cc_number':
                const cleanNumber = value.replace(/\s/g, '');
                if (!cleanNumber) {
                    error = 'رقم البطاقة مطلوب';
                } else if (cleanNumber.length < 13 || cleanNumber.length > 19) {
                    error = 'رقم البطاقة يجب أن يكون بين 13-19 رقم';
                } else if (!/^\d+$/.test(cleanNumber)) {
                    error = 'رقم البطاقة يجب أن يحتوي على أرقام فقط';
                } else if (!validateLuhn(cleanNumber)) {
                    error = 'رقم البطاقة غير صحيح';
                }
                break;
            case 'cc_exp_month':
                const month = parseInt(value);
                if (!value) {
                    error = 'شهر الانتهاء مطلوب';
                } else if (month < 1 || month > 12) {
                    error = 'شهر غير صحيح';
                }
                break;
            case 'cc_exp_year':
                const year = parseInt('20' + value);
                const currentYear = new Date().getFullYear();
                if (!value) {
                    error = 'سنة الانتهاء مطلوبة';
                } else if (year < currentYear) {
                    error = 'البطاقة منتهية الصلاحية';
                } else if (year > currentYear + 20) {
                    error = 'سنة غير صحيحة';
                }
                break;
            case 'cc_cvc':
                if (!value) {
                    error = 'رمز التحقق مطلوب';
                } else if (value.length !== 3) {
                    error = 'رمز التحقق يجب أن يكون 3 أرقام';
                } else if (!/^\d+$/.test(value)) {
                    error = 'رمز التحقق يجب أن يحتوي على أرقام فقط';
                }
                break;
        }

        return error;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const fieldName = name.replace('d_238[', '').replace(']', '');
        
        let formattedValue = value;

        // Format credit card number
        if (fieldName === 'cc_number') {
            // Remove all non-digits and limit to 19 characters
            const digits = value.replace(/\D/g, '').slice(0, 19);
            // Add spaces every 4 digits
            formattedValue = digits.replace(/(.{4})/g, '$1 ').trim();
        }

        // Format month input (ensure it's 2 digits max)
        if (fieldName === 'cc_exp_month') {
            formattedValue = value.replace(/\D/g, '').slice(0, 2);
        }

        // Format year input (ensure it's 2 digits max)
        if (fieldName === 'cc_exp_year') {
            formattedValue = value.replace(/\D/g, '').slice(0, 2);
        }

        // Format CVC (ensure it's 3 digits max)
        if (fieldName === 'cc_cvc') {
            formattedValue = value.replace(/\D/g, '').slice(0, 3);
        }

        // Validate the field
        const error = validateField(fieldName, formattedValue);
        setErrors(prev => ({
            ...prev,
            [fieldName]: error
        }));

        const newFormData = {
            ...formData,
            [fieldName]: formattedValue
        };

        setFormData(newFormData);

        // Calculate if form is valid
        const allErrors = { ...errors, [fieldName]: error };
        const isValid = Object.values(allErrors).every(err => !err) && 
                       newFormData.cc_number && 
                       newFormData.cc_exp_month && 
                       newFormData.cc_exp_year && 
                       newFormData.cc_cvc;

        onPaymentDataChange && onPaymentDataChange({
            ...newFormData,
            isValid
        });
    };

    return (
        <div className="payment-methods-block">
            <div className="payment-methods-block-header">اختر طريقة الدفع</div>
            <ul className="errors">
                <li></li>
            </ul>
            <div className="payment-method active" data-order-checkout-payment-method-container="">
                <div className="payment-method-header">
                <label className="payment-method-label clearfix payfort payfort-visamastercard-egp">
                        <input
                            type="radio"
                            name="method"
                            id="method-d_238"
                            value="d_238"
                            defaultChecked
                            data-order-checkout-payment-method="d_238"
                            data-order-checkout-payment-method-fees="[]"
                            data-order-checkout-payment-method-type="payfort"
                        />
                        <span></span>
                        <span></span>
                        <span className="logo">
                            <svg className="visa credit-card icon icon-visa-logo" style={{ width: '33px' }}>
                                <use xlinkHref="#svg-icon-visa-logo"></use>
                            </svg>
                            <svg className="mastercard credit-card icon icon-mastercard-logo" style={{ width: '20px' }}>
                                <use xlinkHref="#svg-icon-mastercard-logo"></use>
                            </svg>
                        </span>
                        <span className="brackets-ltr payment-method-label-name">البطاقة الإتمانية</span>
                    </label>
                </div>
                <div data-order-checkout-payment-method-form="">
                    <div className="payment-method-form clearfix">
                        <div data-credit-card-form="">
                            <div className={`form_element form_element-cc-number ${formData.cc_number ? 'filled' : 'empty'} ${errors.cc_number ? 'invalid' : 'valid'}`} data-validate-container="">
                                <label htmlFor="d_238-cc_number" className="form_element-label form-element-label-no-sign required">
                                    رقم البطاقة
                                </label>
                                <div className="form_element-content">
                                    <input
                                        type="tel"
                                        name="d_238[cc_number]"
                                        id="d_238-cc_number"
                                        value={formData.cc_number}
                                        onChange={handleInputChange}
                                        className={`form_element-text ${formData.cc_number ? 'filled' : 'empty'}`}
                                        placeholder="XXXX XXXX XXXX XXXX"
                                        data-credit-card-number=""
                                        autoComplete="cc-number"
                                        maxLength={19}
                                    />
                                </div>
                                <ul data-validate-messages="" className="errors">
                                    <li>{errors.cc_number || ''}</li>
                                </ul>
                            </div>
                            
                            <div className={`form_element form_element-cc-exp-month no-status-icon ${formData.cc_exp_month ? 'filled' : 'empty'} ${errors.cc_exp_month ? 'invalid' : 'valid'}`} data-validate-container="">
                                <label htmlFor="d_238-cc_exp_month" className="form_element-label form-element-label-no-sign required">
                                    شهر الانتهاء
                                </label>
                                <div className="form_element-content">
                                    <input
                                        type="tel"
                                        name="d_238[cc_exp_month]"
                                        id="d_238-cc_exp_month"
                                        value={formData.cc_exp_month}
                                        onChange={handleInputChange}
                                        className={`form_element-text ${formData.cc_exp_month ? 'filled' : 'empty'}`}
                                        placeholder="MM"
                                        data-credit-card-month=""
                                        maxLength="2"
                                    />
                                </div>
                                <ul data-validate-messages="" className="errors">
                                    <li>{errors.cc_exp_month || ''}</li>
                                </ul>
                            </div>
                            
                            <div className={`form_element form_element-cc-exp-year no-status-icon ${formData.cc_exp_year ? 'filled' : 'empty'} ${errors.cc_exp_year ? 'invalid' : 'valid'}`} data-validate-container="">
                                <label htmlFor="d_238-cc_exp_year" className="form_element-label form-element-label-no-sign required">
                                    سنة الانتهاء
                                </label>
                                <div className="form_element-content">
                                    <input
                                        type="tel"
                                        name="d_238[cc_exp_year]"
                                        id="d_238-cc_exp_year"
                                        value={formData.cc_exp_year}
                                        onChange={handleInputChange}
                                        className={`form_element-text ${formData.cc_exp_year ? 'filled' : 'empty'}`}
                                        placeholder="YY"
                                        data-credit-card-year=""
                                        maxLength="2"
                                    />
                                </div>
                                <ul data-validate-messages="" className="errors">
                                    <li>{errors.cc_exp_year || ''}</li>
                                </ul>
                            </div>
                            
                            <div className={`form_element form_element-cc-cvc ${formData.cc_cvc ? 'filled' : 'empty'} ${errors.cc_cvc ? 'invalid' : 'valid'}`} data-validate-container="">
                                <label htmlFor="d_238-cc_cvc" className="form_element-label form-element-label-no-sign required">
                                    رمز التحقق
                                </label>
                                <div className="form_element-content">
                                    <input
                                        type="tel"
                                        name="d_238[cc_cvc]"
                                        id="d_238-cc_cvc"
                                        value={formData.cc_cvc}
                                        onChange={handleInputChange}
                                        className={`form_element-text ${formData.cc_cvc ? 'filled' : 'empty'}`}
                                        placeholder="XXX"
                                        data-credit-card-cvc=""
                                        maxLength="3"
                                        autoComplete="off"
                                    />
                                </div>
                                <ul data-validate-messages="" className="errors">
                                    <li>{errors.cc_cvc || ''}</li>
                                </ul>
                            </div>
                            
                            <input type="submit" className="hidden form-hiddenSubmit" name="" tabIndex="-1" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethods; 