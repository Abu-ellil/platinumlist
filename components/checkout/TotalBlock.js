'use client';

const TotalBlock = ({ total, currency, ticketPrice, serviceFee, refundGuarantee, whatsappService, vatRate }) => {
    const formatPrice = (price) => {
        return `${price.toFixed(2)} ${currency}`;
    };

    return (
        <div className="total-block">
            <div className="total-block-inner">
                <div className="total-block-content">
                    <div className="total-block-row">
                        <div className="total-block-label">سعر التذاكر</div>
                        <div className="total-block-value">{formatPrice(ticketPrice)}</div>
                    </div>
                    <div className="total-block-row">
                        <div className="total-block-label">رسوم الخدمة</div>
                        <div className="total-block-value">{formatPrice(serviceFee)}</div>
                    </div>
                    {refundGuarantee > 0 && (
                        <div className="total-block-row">
                            <div className="total-block-label">ضمان استرداد الأموال</div>
                            <div className="total-block-value">{formatPrice(refundGuarantee)}</div>
                        </div>
                    )}
                    {whatsappService > 0 && (
                        <div className="total-block-row">
                            <div className="total-block-label">خدمة إشعارات WhatsApp</div>
                            <div className="total-block-value">{formatPrice(whatsappService)}</div>
                        </div>
                    )}
                    <div className="total-block-row">
                        <div className="total-block-label">ضريبة القيمة المضافة ({vatRate}%)</div>
                        <div className="total-block-value">{formatPrice((total * vatRate) / 100)}</div>
                    </div>
                    <div className="total-block-row total-block-row--total">
                        <div className="total-block-label">المجموع الكلي</div>
                        <div className="total-block-value">{formatPrice(total)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TotalBlock; 