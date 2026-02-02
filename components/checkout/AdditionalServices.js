'use client';
import { useState } from 'react';

const AdditionalServices = ({ onServicesChange }) => {
    const [services, setServices] = useState({
        refundGuarantee: true,
        whatsappNotifications: true
    });

    const [showRefundDescription, setShowRefundDescription] = useState(false);

    const handleServiceChange = (serviceKey, value, price) => {
        const newServices = {
            ...services,
            [serviceKey]: value
        };
        setServices(newServices);
        onServicesChange && onServicesChange(newServices);
    };

    return (
        <div className="services-block">
            <div className="services-block-header">خدمات إضافية</div>
            <ul className="errors">
                <li></li>
            </ul>
            
            {/* Refund Guarantee Service */}
            <div className="service form_element filled" data-toggle-listen="">
                <div className="service-header form_element-content">
                    <a
                        href="javascript:void(0)"
                        className="service-toggle"
                        onClick={() => setShowRefundDescription(!showRefundDescription)}
                        data-toggle-active-button=""
                    >
                        <span className="more">
                            <svg className="icon icon-arrowhead-down">
                                <use xlinkHref="#svg-icon-arrowhead-down"></use>
                            </svg>
                        </span>
                        <span className="less">
                            <svg className="icon icon-arrowhead-up">
                                <use xlinkHref="#svg-icon-arrowhead-up"></use>
                            </svg>
                        </span>
                    </a>
                    <label className="service-label form_element-label form_element-option">
                        <input
                            type="checkbox"
                            name="services[]"
                            id="services-50815"
                            value="50815"
                            checked={services.refundGuarantee}
                            onChange={(e) => handleServiceChange('refundGuarantee', e.target.checked, 475.48)}
                            data-order-checkout-service="475.48"
                            className="form_element-checkbox filled"
                        />
                        <span></span>
                        ضمان استرجاع المبلغ
                    </label>
                </div>
                {showRefundDescription && (
                    <div className="service-description">
                        تضمن خدمة "ضمان الاسترجاع" استرجاع مبلغ التذاكر كليًا أو جزئيًا في حالات معينة:<br /><br />
                        1- إذا تم إلغاء الفعالية أو الحدث بشكل كامل.<br />
                        2- في الحالات الطارئة مثل وجوب ملازمة العناية المركزة، أو حوادث السيارات، أو الولادة، أو الإصابات الخطيرة التي تتطلب دخول المستشفى.<br /><br />
                        ملاحظات هامة:<br /><br />
                        1- يجب تقديم طلب الاسترجاع في غضون 3 أيام من انتهاء الفعالية.<br />
                        2- سيتم معالجة طلب الاسترجاع خلال 7-15 يوم عمل بعد انتهاء الفعالية.<br />
                        3- يجب أن تكون التذاكر صالحة. التذاكر المستخدمة غير مستردة.<br />
                        4- يجب تقديم الشهادات الرسمية ونسخة من بطاقة الهوية وغيره من المستندات ذات الصلة.<br />
                        5- باستثناء في حالة إلغاء الفعالية أو الحدث، فإن الحد الأقصى لمبلغ الاسترداد يُعادل 600 دولار أمريكي للطلب/عملية الشراء.<br />
                        6- يقتصر مبلغ الاسترداد على عدد التذاكر المشمولة بالوثائق الداعمة.<br />
                        7- رسوم خدمة ضمان الاسترجاع غير مستردة.<br />
                        8- أي أسباب أخرى غير المذكورة أعلاه، لا تؤهل العميل لاسترجاع مبلغ التذاكر.
                    </div>
                )}
            </div>
            
            {/* WhatsApp Notifications Service */}
            <div className="service form_element filled" data-toggle-listen="">
                <div className="service-header form_element-content">
                    <label className="service-label form_element-label form_element-option event-service-whatsapp-logo">
                        <input
                            type="checkbox"
                            name="services[]"
                            id="services-50818"
                            value="50818"
                            checked={services.whatsappNotifications}
                            onChange={(e) => handleServiceChange('whatsappNotifications', e.target.checked, 27.97)}
                            data-order-checkout-service="27.97"
                            className="form_element-checkbox filled"
                        />
                        <span></span>
                        ارسال الرسائل عبر الواتس اب
                    </label>
                </div>
            </div>
        </div>
    );
};

export default AdditionalServices; 