import { useState } from 'react';
import EmailField from './EmailField';
import NameField from './NameField';
import PhoneField from './PhoneField';
import CountryField from './CountryField';

const LoginForm = ({ onSubmit, initialData = {} }) => {
    const [formData, setFormData] = useState({
        email: initialData.email || '',
        name_full: initialData.name_full || '',
        phone: initialData.phone || '',
        countryCode: initialData.countryCode || '+971',
        id_country: initialData.id_country || '',
        selectedCountry: initialData.selectedCountry || ''
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'هذا الحقل فارغ. الرجاء تعبئة جميع الحقول';
        } else if (formData.email.length < 5) {
            newErrors.email = `طول '${formData.email}' يجب أن يكون 5 حرف على الأقل`;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'الرجاء إدخال عنوان بريد إلكتروني صالح';
        }

        // Full name validation
        if (!formData.name_full.trim()) {
            newErrors.name_full = 'هذا الحقل فارغ. الرجاء تعبئة جميع الحقول';
        } else if (!/\S\S+\s+\w*\s*\S\S+.*/.test(formData.name_full)) {
            newErrors.name_full = 'من فضلك أدخل الاسم واسم العائلة بالكامل';
        }

        // Phone validation
        if (!formData.phone.trim()) {
            newErrors.phone = 'هذا الحقل فارغ. الرجاء تعبئة جميع الحقول';
        }

        // Country validation
        if (!formData.id_country) {
            newErrors.id_country = 'هذا الحقل فارغ. الرجاء تعبئة جميع الحقول';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const handleCountrySelect = (id, name) => {
        setFormData(prev => ({
            ...prev,
            id_country: id,
            selectedCountry: name
        }));
        if (errors.id_country) {
            setErrors(prev => ({ ...prev, id_country: null }));
        }
    };

    return (
        <form 
            encType="application/x-www-form-urlencoded" 
            className="quick-order-form-step-two quick-order-form-step-two--checkout" 
            data-form="" 
            data-submit-validation="" 
            data-pl-kit-form="Form_QuickOrder_StepTwo" 
            method="post"
            onSubmit={handleSubmit}
        >
            <div className="quick-order-form-step-two__elements">
                <input type="hidden" name="csrf_token" value="1e33d73125febb2c17c8f06d7def9d40" id="Form_QuickOrder_StepTwo-csrf_token" />
                
                <EmailField 
                    value={formData.email}
                    onChange={(value) => updateField('email', value)}
                    error={errors.email}
                />

                <NameField 
                    value={formData.name_full}
                    onChange={(value) => updateField('name_full', value)}
                    error={errors.name_full}
                />

                <PhoneField 
                    value={formData.phone}
                    onChange={(value) => updateField('phone', value)}
                    countryCode={formData.countryCode}
                    onCountryCodeChange={(code) => updateField('countryCode', code)}
                    error={errors.phone}
                />

                <CountryField 
                    value={formData.id_country}
                    selectedCountryName={formData.selectedCountry}
                    onCountrySelect={handleCountrySelect}
                    error={errors.id_country}
                />

                <input type="submit" className="hidden form-hiddenSubmit" name="" tabIndex="-1" disabled />
            </div>
            
            <div className="quick-order-form-step-two__submit">
                <input 
                    type="submit" 
                    name="submit" 
                    id="Form_QuickOrder_StepTwo-submit" 
                    value={isSubmitting ? "جاري التحميل..." : "استمرار"}
                    className="pl-kit-btn pl-kit-btn--action pl-kit-btn--big pl-kit-btn--wide" 
                    disabled={isSubmitting}
                />
            </div>
        </form>
    );
};

export default LoginForm; 