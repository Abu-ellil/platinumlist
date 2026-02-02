'use client';

const TicketDelivery = ({ email }) => {
    return (
        <div className="ticket-delivery">
            <div className="ticket-delivery__title">طريقة تسليم التذاكر</div>
            <div className="ticket-delivery__content">
                <div className="ticket-delivery__text">
                    <div className="ticket-delivery__change-email"
                        data-toggle-class="ticket-delivery__change-email--expanded"
                        data-toggle-listen="">
                        بمجرد إتمام عملية الشراء، ستصلك تذكرتك قبل 48 ساعة من موعد الحدث على:
                        <span className="ticket-delivery__email"
                            data-pl-kit-popover=""
                            data-pl-kit-popover-content="ستتلقى تأكيد الحجز على بريدك الإكتروني المرتبط بحسابك هذا، والذي تم استخدامه لتسجيل الدخول إلى التطبيق"
                            style={{ cursor: 'pointer' }}>
                            <span data-pl-kit-popover-anchor="">
                                {email || 'user@example.com'}
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDelivery; 