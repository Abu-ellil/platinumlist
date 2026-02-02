'use client';
import { useState } from 'react';

const Terms = ({ onTermsChange }) => {
    const [termsAccepted, setTermsAccepted] = useState(true);

    const handleTermsChange = (e) => {
        const checked = e.target.checked;
        setTermsAccepted(checked);
        onTermsChange && onTermsChange(checked);
    };

    const termsContent = `
        <div>
            <div class="terms-popup-title">الأحكام والشروط</div>
            <div class="terms-popup-text mce-wrapper-content">
                <ul>
                    <li>التذاكر غير قابلة للاسترداد وغير قابلة للتغيير وغير قابلة للتحويل.<br /></li>
                    <li>يجب على العميل عند دخوله إبراز وثيقة سارية المفعول (مثل بطاقة الهوية أو رخصة القيادة أو جواز السفر) مع اسم يطابق بطاقة الخصم / الائتمان التي تم استخدامها عند شراء التذاكر.<br /></li>
                    <li>يُسمح بإعادة بيع التذاكر عبر منصة بلاتينوم لِست فقط.<br /></li>
                    <li>إذا تم شراء التذكرة عن طريق منصات بيع تذاكر أخرى، تعتبر التذاكر غير صالحة، وسيتم رفض الدخول إلى الحدث.<br /></li>
                    <li>من مسؤولية العميل أن يكون في نطاق العمر الصحيح المطلوب للدخول للحفل.<br /></li>
                    <li>من مسئولية العملاء الالتزام بالزي المناسب في حالة وجود شروط معينة تم وضعها من قبل المنظم.<br /></li>
                    <li>اذا تم رفض دخول أي عميل من قبل المنظم، فإن شركة بلاتينوم لِست غير مسؤولة عن استرداد التذاكر.<br /></li>
                    <li>تقع على عاتق العميل مسؤولية حضور الحدث في الوقت المناسب.<br /></li>
                    <li>لن يتم استرداد الأحداث التي لم يتم حضورها.<br /></li>
                    <li>لا تتحمل شركة بلاتينوم لِست أي مسؤولية عن أي ممتلكات شخصية فقدت أو سرقت، أو إصابة أو أي خسائر تكبدتها في الحفل.<br /></li>
                    <li>شركة بلاتينوم لِست لن تكون مسؤولة عن أي تذاكر مفقودة أو تالفة.<br /></li>
                    <li>لا يسمح بتغيير المقاعد أو فئات التذاكر. كل تذكرة مخصصة لشخص واحد فقط.<br /></li>
                    <li>التذكرة صالحة فقط للعرض المحدد ولا يمكن إعادة استخدامها لأحداث أخرى متعددة.<br /></li>
                    <li>منظم الحدث لديه الحق في رفض الدخول بمجرد بدء العرض، ولا يمكن الدخول اكثر من مرة.<br /></li>
                    <li>تشكيلة الفنانين عرضة للتغيير في أي وقت.</li>
                </ul>
                <br>
            </div>
        </div>
    `;

    const showTermsPopup = () => {
        // You can implement a modal popup here
        alert('Terms and conditions popup would open here');
    };

    return (
        <div className="terms">
            <div className="form_element empty">
                <div className="terms-accepted-checkbox form_element-content">
                    <label htmlFor="isAccepted" className="form_element-label form_element-option">
                        <input type="hidden" name="" value="0" className="filled" />
                        <input
                            type="checkbox"
                            name=""
                            id="isAccepted"
                            value=""
                            checked={termsAccepted}
                            onChange={handleTermsChange}
                            className="form_element-checkbox empty"
                            data-order-checkout-terms-accepted-checkbox=""
                        />
                        <span></span>
                        <span className="label-text">
                            أوافق على{' '}
                            <a
                                href="javascript:void(0)"
                                className="terms-link"
                                onClick={showTermsPopup}
                                data-target="popup"
                                data-popup-wrapper="scrollable-popup"
                                data-popup-content={termsContent}
                                data-popup-additional-class="terms-and-conditions-popup"
                            >
                                القواعد والأنظمة الخاصة بمكان إقامة الحدث
                            </a>{' '}
                            الخاصة بهذه الفعالية
                        </span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Terms; 