const Payments = () => {
    // Reasons data array
    const reasonsData = [
        {
            id: 1,
            image: "https://cdn.platinumlist.net/dist/v799/img/why-buy-with-us/secure-checkout.svg",
            alt: "عملية شراء آمنة",
            header: "عملية شراء آمنة",
            subheader: "دفع سريع وآمن"
        },
        {
            id: 2,
            image: "https://cdn.platinumlist.net/dist/v799/img/why-buy-with-us/instant-confirmation.svg",
            alt: "تأكيد فوري",
            header: "تأكيد فوري",
            subheader: "خدمة ضمان استرجاع اختيارية"
        },
        {
            id: 3,
            image: "https://cdn.platinumlist.net/dist/v799/img/why-buy-with-us/official-ticket-seller.svg",
            alt: "الموقع الرسمي لبيع التذاكر",
            header: "الموقع الرسمي لبيع التذاكر",
            subheader: "أكثر من 10 مليون مستخدم"
        },
        {
            id: 4,
            image: "https://cdn.platinumlist.net/dist/v799/img/why-buy-with-us/customer-service.svg",
            alt: "خدمة العملاء على مدار الساعة",
            header: "خدمة العملاء على مدار الساعة",
            subheader: "فريق دعم مخصص لخدمة العملاء وإدارة البيع"
        }
    ];

    // Payment systems data array
    const paymentSystems = [
        {
            id: 1,
            image: "https://cdn.platinumlist.net/dist/v799/img/payment-systems/mada.svg",
            alt: "",
            modifier: "mada"
        },
        {
            id: 2,
            image: "https://cdn.platinumlist.net/dist/v799/img/payment-systems/visa-logo.svg",
            alt: "",
            modifier: "visa"
        },
        {
            id: 3,
            image: "https://cdn.platinumlist.net/dist/v799/img/payment-systems/mastercard-logo.svg",
            alt: "",
            modifier: "mastercard"
        },
        {
            id: 4,
            image: "https://cdn.platinumlist.net/dist/v799/img/payment-systems/american-express.svg",
            alt: "",
            modifier: "american-express"
        },
        {
            id: 5,
            image: "https://cdn.platinumlist.net/dist/v799/img/payment-systems/stc-pay.svg",
            alt: "",
            modifier: "stc-pay"
        },
        {
            id: 6,
            image: "https://cdn.platinumlist.net/dist/v799/img/payment-systems/apple-pay.svg",
            alt: "",
            modifier: "apple-pay"
        }
    ];

    // Function to render a single reason
    const renderReason = (reason) => (
        <div key={reason.id} className="why-buy-block__reasons-reason">
            <img 
                className="why-buy-block__reasons-reason-image" 
                src={reason.image} 
                alt={reason.alt} 
            />
            <div className="why-buy-block__reasons-reason-description">
                <div className="why-buy-block__reasons-reason-description-header">
                    {reason.header}
                </div>
                <span className="why-buy-block__reasons-reason-description-subheader">
                    {reason.subheader}
                </span>
            </div>
        </div>
    );

    // Function to render a single payment system
    const renderPaymentSystem = (payment) => (
        <img 
            key={payment.id}
            className={`why-buy-block__payment-options-payment-systems-payment-system why-buy-block__payment-options-payment-systems-payment-system--${payment.modifier}`}
            src={payment.image} 
            alt={payment.alt} 
        />
    );

    return (
        <div className="why-buy-block no-mobile">
            <div className="container2 padded">
                <div className="why-buy-block__header">
                    ما الذي يميز منصة بلاتينوم لِست عن غيرها؟
                </div>
                <div className="why-buy-block__reasons">
                    {reasonsData.map(reason => renderReason(reason))}
                </div>
                <div className="why-buy-block__payment-options">
                    <div className="why-buy-block__payment-options-header">
                        اختيار طريقة الدفع المناسبة لك
                    </div>
                    <div className="why-buy-block__payment-options-payment-systems">
                        {paymentSystems.map(payment => renderPaymentSystem(payment))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payments;