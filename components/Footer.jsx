'use client';

import { useState, useEffect } from 'react';

const Footer = () => {
    const [whatsappNumber, setWhatsappNumber] = useState('971501408768'); // Default fallback
    const [supportPhone, setSupportPhone] = useState('920008640'); // Default fallback

    // Fetch contact settings from database
    useEffect(() => {
        const fetchContactSettings = async () => {
            try {
                // Fetch WhatsApp number
                const whatsappResponse = await fetch('/api/settings/whatsapp');
                const whatsappData = await whatsappResponse.json();
                if (whatsappData.success && whatsappData.whatsapp_number) {
                    setWhatsappNumber(whatsappData.whatsapp_number);
                }

                // Fetch support phone number
                const phoneResponse = await fetch('/api/settings/support-phone');
                const phoneData = await phoneResponse.json();
                if (phoneData.success && phoneData.support_phone) {
                    setSupportPhone(phoneData.support_phone);
                }
            } catch (error) {
                console.error('Error fetching contact settings:', error);
                // Keep default fallbacks
            }
        };

        fetchContactSettings();
    }, []);

    // Logo data
    const logoData = {
        desktop: {
            src: "https://cdn.platinumlist.net/dist/v816/img/main/logo-template/pl-logo-desktop-ar.svg",
            alt: "تذاكر فعاليات Platinumlist.net",
            title: "Platinumlist"
        },
        mobile: {
            src: "https://cdn.platinumlist.net/dist/v816/img/main/logo-template/pl-logo-desktop-ar.svg",
            alt: "تذاكر فعاليات Platinumlist.net",
            title: "Platinumlist"
        },
        caption: "منصة اكتشاف وتسويق المحتوى الترفيهي"
    };

    // Support data
    const supportData = {
        title: "هل لديك أي أسئلة أو استفسارات أخرى؟\nيسعدنا تواصلك معنا",
        whatsapp: {
            href: `https://wa.me/${whatsappNumber}`,
            image: "https://cdn.platinumlist.net/dist/v799/img/support/whatsapp-modern-round.svg",
            alt: "WhatsApp"
        }
    };

    // Customer service data
    const customerServiceData = {
        title: "خدمة العملاء",
        phone: supportPhone,
        hours: "الأحد - الخميس 9:00 - 17:00"
    };

    // Payment methods data
    const paymentMethods = [
        { id: 1, src: "https://cdn.platinumlist.net/dist/v799/img/payment-systems/mada.svg", alt: "mada" },
        { id: 2, src: "https://cdn.platinumlist.net/dist/v799/img/payment-systems/american-express.svg", alt: "american-express" },
        { id: 3, src: "https://cdn.platinumlist.net/dist/v799/img/payment-systems/visa-logo.svg", alt: "visa" },
        { id: 4, src: "https://cdn.platinumlist.net/dist/v799/img/payment-systems/apple-pay.svg", alt: "apple-pay" },
        { id: 5, src: "https://cdn.platinumlist.net/dist/v799/img/payment-systems/pay-pal.svg", alt: "pay-pal" },
        { id: 6, src: "https://cdn.platinumlist.net/dist/v799/img/payment-systems/mastercard-logo.svg", alt: "mastercard" },
        { id: 7, src: "https://cdn.platinumlist.net/dist/v799/img/payment-systems/stc-pay.svg", alt: "stc-pay" }
    ];

    // Footer links sections
    const footerSections = [
        {
            id: 1,
            title: "الفئات",
            links: [
                { title: "أبرز الفعاليات", href: "/ar/event/top" },
                { title: "المعالم السياحية المميزة", href: "/ar/attraction/top" },
                { title: "الحفلات الموسيقية", href: "/ar/concert" },
                { title: "دليل الفعاليات العربية", href: "/ar/arabic" },
                { title: "الحفلات العربية", href: "/ar/concert/concerts-arabic" },
                { title: "حفلات غنائية", href: "/ar/vocallyconcerts" },
                { title: "اظهار الكل", href: "/ar/event/list" }
            ]
        },
        {
            id: 2,
            title: "من نحن",
            links: [
                { title: "انضم لفريقنا", href: "https://apply.workable.com/platinum-list/" },
                { title: "الشعار", href: "https://platinumlist.net/ar/logo-center" },
                { title: "مدونة بلاتينوم لِست", href: "https://platinumlist.net/guide/" },
                { title: "آخر الأخبار", href: "https://platinumlist.net/guide/news" },
                { title: "الشروط والأحكام", href: "https://platinumlist.net/terms-and-conditions/TermsandConditionsCustomers" },
                { title: "خريطة الموقع", href: "https://platinumlist.net/ar/sitemap" }
            ]
        },
        {
            id: 3,
            title: "للمنظمين",
            links: [
                { title: "نظرة عامة", href: "https://platinumlist.net/for-organisers/" },
                { title: "الفعاليات الترفيهية", href: "https://platinumlist.net/for-organisers/entertainment-events-ticketing" },
                { title: "المغامرات والتجارب الاستثنائية", href: "https://platinumlist.net/for-organisers/attractions-ticketing" },
                { title: "فعاليات قطاع الأعمال", href: "https://platinumlist.net/for-organisers/business-events-ticketing" },
                { title: "الأنشطة والأحداث الرياضية", href: "https://platinumlist.net/for-organisers/sport-events-ticketing" },
                { title: "حلول تذاكر أماكن الفعاليات", href: "https://platinumlist.net/for-organisers/venue-ticketing" },
                { title: "خدمات النظام", href: "https://platinumlist.net/for-organisers/event-ticketing-software" },
                { title: "دليل المنظمين", href: "https://platinumlist.net/for-organisers/guide" }
            ]
        },
        {
            id: 4,
            title: "الخدمات",
            links: [
                { title: "خدمات إدارة الفعاليات", href: "https://platinumlist.net/for-organisers/event-services" },
                { title: "خدمات التسويق", href: "https://platinumlist.net/for-organisers/marketing-and-reporting" },
                { title: "فريق إدارة التذاكر للفعالية", href: "https://platinumlist.net/for-organisers/event-staffing-service" },
                { title: "طباعة التذاكر", href: "https://platinumlist.net/for-organisers/event-ticket-printing-service" },
                { title: "خدمة إصدار الترخيص بشكل سريع", href: "https://platinumlist.net/for-organisers/det-permit-for-events-application-service" }
            ],
            hasButton: true,
            buttonText: "إضافة فعالية",
            buttonHref: "https://platinumlist.net/ar/event/add"
        },
        {
            id: 5,
            title: "للشركاء",
            links: [
                { title: "برنامج التسويق بالعمولة", href: "https://platinumlist.net/for-organisers/affiliate-program" }
            ]
        }
    ];

    // Language switcher data
    const languageData = {
        current: {
            flag: "https://cdn.platinumlist.net/dist/v799/img/flags/4x3/arab_league.svg",
            alt: "arab_league",
            name: "العربية"
        },
        options: [
            { flag: "https://cdn.platinumlist.net/dist/v799/img/flags/4x3/gb.svg", alt: "en", name: "English", lang: "en" },
            { flag: "https://cdn.platinumlist.net/dist/v799/img/flags/4x3/arab_league.svg", alt: "ar", name: "العربية" },
            { flag: "https://cdn.platinumlist.net/dist/v799/img/flags/4x3/tr.svg", alt: "tr", name: "Türkçe", lang: "tr" }
        ]
    };

    // App download data
    const appDownloadData = [
        {
            id: 1,
            href: "https://play.google.com/store/apps/details?id=com.platinumlist",
            image: "https://cdn.platinumlist.net/dist/v799/img/b2c-app/google-play-black-ar.svg",
            alt: "Download GooglePlay Button",
            className: "footer-block-list__b2c-app-btn-img-google-play",
            gaData: '{"event_name":"click_item_social","item":"googleplay","type":null,"hierarchy":null,"id":null,"id_name":null,"interface_location":"footer","status":null,"meta":null,"comment":null}'
        },
        {
            id: 2,
            href: "https://apps.apple.com/app/id1538602869",
            image: "https://cdn.platinumlist.net/dist/v799/img/b2c-app/app-store-black-ar.svg",
            alt: "Download AppStore Button",
            className: "footer-block-list__b2c-app-btn-img-app-store",
            gaData: '{"event_name":"click_item_social","item":"appstore","type":null,"hierarchy":null,"id":null,"id_name":null,"interface_location":"footer","status":null,"meta":null,"comment":null}'
        },
        {
            id: 3,
            href: "https://appgallery.huawei.com/app/C110287535",
            image: "https://cdn.platinumlist.net/dist/v799/img/b2c-app/huawei-app-gallery-black-ar.svg",
            alt: "Download HuaweiAppGallery Button",
            className: "footer-block-list__b2c-app-btn-img-app-store",
            gaData: '{"event_name":"click_item_social","item":"huaweiAppGallery","type":null,"hierarchy":null,"id":null,"id_name":null,"interface_location":"footer","status":null,"meta":null,"comment":null}'
        }
    ];

    // Social media data
    const socialMediaData = [
        {
            id: 1,
            href: "/ar/telegram-channels",
            target: "_self",
            title: "Telegram",
            icon: "telegram",
            gaData: '{"event_name":"click_item_social","item":"telegram","type":null,"hierarchy":null,"id":null,"id_name":null,"interface_location":"footer","status":null,"meta":null,"comment":null}'
        },
        {
            id: 2,
            href: "https://x.com/platinumlistksa?lang=en",
            target: "_blank",
            title: "Twitter",
            icon: "x-logo",
            gaData: '{"event_name":"click_item_social","item":"twitter","type":null,"hierarchy":null,"id":null,"id_name":null,"interface_location":"footer","status":null,"meta":null,"comment":null}'
        },
        {
            id: 3,
            href: "https://www.facebook.com/PlatinumlistKSA/",
            target: "_blank",
            title: "Facebook",
            icon: "facebook",
            gaData: '{"event_name":"click_item_social","item":"facebook","type":null,"hierarchy":null,"id":null,"id_name":null,"interface_location":"footer","status":null,"meta":null,"comment":null}'
        },
        {
            id: 4,
            href: "https://www.instagram.com/platinumlistsaudia/",
            target: "_blank",
            title: "Instagram",
            icon: "instagram-new",
            gaData: '{"event_name":"click_item_social","item":"instagram","type":null,"hierarchy":null,"id":null,"id_name":null,"interface_location":"footer","status":null,"meta":null,"comment":null}'
        }
    ];

    return (
        <div className="footer">
            <hr />
            <div className="container2 ">
                <div className="footer-row footer-row-first">
                    {/* Logo Block */}
                    <div className="footer-block footer-block-logo">
                        <div className="footer-block-logo__image-wrapper no-mobile">
                            <img 
                                src={logoData.desktop.src} 
                                alt={logoData.desktop.alt} 
                                title={logoData.desktop.title} 
                                className="footer-block-logo__image" 
                            />
                        </div>
                        <div className="footer-block-logo__image-wrapper mobile">
                            <img 
                                src={logoData.mobile.src} 
                                alt={logoData.mobile.alt} 
                                title={logoData.mobile.title} 
                                className="footer-block-logo__image" 
                            />
                        </div>
                        <span className="footer-block-logo__caption">{logoData.caption}</span>
                    </div>

                    {/* Support Block */}
                    <div className="footer-block" data-intercomchat='{"app_id":"xbas31f3"}'>
                        <p className="footer-block__title footer-block__title--support">
                            {supportData.title.split('\n').map((line, index) => (
                                <span key={index}>{line}{index === 0 && <br />}</span>
                            ))}
                        </p>
                        <div className="footer-block__support-chat">
                            <a href={supportData.whatsapp.href} target="_blank" rel="noopener noreferrer">
                                <img 
                                    src={supportData.whatsapp.image} 
                                    className="footer-block__whatsapp-img" 
                                    alt={supportData.whatsapp.alt} 
                                />
                            </a>
                            <div data-plat-support-popup="">
                                <a 
                                    href={`https://wa.me/${supportData.whatsapp.href}`}
                                    className="option btn btn--outline-blue btn--small footer-block__contact-btn" 
                                    data-option="intercom" 
                                    data-ga4-click-item='{"event_name":"click_chat","item":"website","type":null,"hierarchy":null,"id":null,"id_name":null,"interface_location":"modal","status":null,"meta":null,"comment":null}'
                                >
                                    <svg className="icon icon-support">
                                        <use xlinkHref="#svg-icon-support"></use>
                                    </svg>
                                    فريق الدعم
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Customer Service Block */}
                    <div className="footer-block footer-block-ticket-hotline">
                        <div className="footer-block-ticket-hotline__inner-wrapper">
                            <p className="footer-block__title footer-block__title-ticket-hotline str-first-letter-upper">
                                {customerServiceData.title}
                            </p>
                        </div>
                        <a href={`tel:${customerServiceData.phone}`} className="footer-block-ticket-hotline__phone ">
                            {customerServiceData.phone}
                        </a>
                        <div className="footer-block-ticket-hotline__workdays">
                            {customerServiceData.hours}
                        </div>
                    </div>

                    {/* Payment Methods Block */}
                    <div className="footer-block footer-block-we-accept">
                        <p className="footer-block__title footer-block__title-we-accept str-first-letter-upper">
                            نقبل طرق الدفع التالية
                        </p>
                        <div className="footer-block-we-accept__logos">
                            {paymentMethods.map(payment => (
                                <img key={payment.id} src={payment.src} alt={payment.alt} />
                            ))}
                        </div>
                    </div>
                </div>

                <hr />

                <div className="footer-row footer-row-links">
                    {/* Footer Links Sections */}
                    {footerSections.map(section => (
                        <div key={section.id} className="footer-block" data-toggle-listen="">
                            <div className="footer-block__title footer-block__title-list str-first-letter-upper" data-toggle-active-button="">
                                {section.title}
                                <a href="javascript:void(0)" className="footer-block-toggle">
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
                            </div>
                            <ul className="footer-block-list footer-block-list__toggle">
                                {section.links.map((link, index) => (
                                    <li key={index} className="footer-block-list__item">
                                        <a 
                                            className="link" 
                                            href={link.href}
                                            {...(link.href === "https://platinumlist.net/guide/" && {
                                                'data-webengage-click': '{"eventName":"Clicked Blog Page Link","eventData":{"City":"Riyadh","Country":"Saudi Arabia"}}'
                                            })}
                                        >
                                            {link.title}
                                        </a>
                                    </li>
                                ))}
                                {section.hasButton && (
                                    <li className="footer-block-list__item">
                                        <a 
                                            href={section.buttonHref} 
                                            className="footer-block-list__btn btn btn--outline-blue btn--small no-mobile"
                                        >
                                            {section.buttonText}
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    ))}

                    {/* Language Switcher Block */}
                    <div className="footer-block footer-block-lang-switcher mobile">
                        <div className="footer-block__title no-mobile str-first-letter-upper">اللغة</div>
                        <div className="footer-block__language-switcher">
                            <div className="language-switcher-wrapper" data-language-switcher-wrapper="" data-toggle-listen="" data-toggle-scope="switcher-opened">
                                <div className="language-switcher" data-language-switcher="" data-toggle-active-button="" data-toggle-class="switcher-opened" data-toggle-scope="closest">
                                    <div className="language-switcher__lang language-switcher__lang--current">
                                        <span className="flag">
                                            <img src={languageData.current.flag} alt={languageData.current.alt} />
                                        </span>
                                        <span>{languageData.current.name}</span>
                                    </div>
                                    <svg className="language-switcher__arrow icon icon-arrowhead-down">
                                        <use xlinkHref="#svg-icon-arrowhead-down"></use>
                                    </svg>
                                </div>
                                <ul className="language-switcher__lang-list">
                                    {languageData.options.map((lang, index) => (
                                        <li key={index}>
                                            <a 
                                                href="javascript:void(0);" 
                                                className="language-switcher__lang" 
                                                data-toggle-active-button="" 
                                                data-toggle-class="switcher-opened" 
                                                data-toggle-scope="closest"
                                                {...(lang.lang && { 'data-switcher-language': lang.lang })}
                                            >
                                                <span className="flag">
                                                    <img src={lang.flag} alt={lang.alt} />
                                                </span>
                                                <span>{lang.name}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Download App Block */}
                    <div className="footer-block footer-block-download-app">
                        <div className="footer-block__title footer-block__title-download-app str-first-letter-upper">
                            تحميل التطبيق
                        </div>
                        <div className="footer-block-list footer-block-list__download-app">
                            {appDownloadData.map(app => (
                                <a 
                                    key={app.id}
                                    className="footer-block-list__b2c-app-btn" 
                                    target="_blank" 
                                    href={app.href} 
                                    data-ga4-click-item={app.gaData} 
                                    rel="noopener noreferrer"
                                >
                                    <img 
                                        src={app.image} 
                                        alt={app.alt} 
                                        className={app.className} 
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Basement */}
            <div className="footer-basement">
                <div className="container2 padded ">
                    <div className="footer-basement-row footer-basement-row-contacts">
                        <span className="footer-basement-support__text mobile">
                            هل لديك أي أسئلة أو استفسارات أخرى؟<br />يرجى زيارة
                        </span>
                        <ul className="footer-basement-social-media">
                            {socialMediaData.map(social => (
                                <li key={social.id}>
                                    <a 
                                        href={social.href} 
                                        className="footer-basement-social-media__item" 
                                        target={social.target} 
                                        rel="noopener nofollow" 
                                        title={social.title} 
                                        data-ga4-click-item={social.gaData}
                                        {...(social.target === '_blank' && { rel: "noopener noreferrer" })}
                                    >
                                        <svg className={`icon icon-${social.icon}`}>
                                            <use xlinkHref={`#svg-icon-${social.icon}`}></use>
                                        </svg>
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <div className="footer-basement-support no-mobile">
                            <span className="footer-basement-support__text">
                                هل لديك أي أسئلة أو استفسارات أخرى؟ يرجى زيارة
                            </span>
                            <a 
                                className="footer-basement__btn btn btn--outline-dark btn--medium" 
                                href={`https://wa.me/${supportData.whatsapp.href}`}
                                data-ga4-click-item='{"event_name":"click_help","item":null,"type":null,"hierarchy":null,"id":null,"id_name":null,"interface_location":"footer","status":null,"meta":null,"comment":null}'
                            >
                                مركز الدعم
                            </a>
                        </div>
                    </div>
                    <div className="footer-basement-row footer-basement-row-mobile-buttons mobile">
                        <a 
                            className="btn btn--outline-dark footer-basement__btn--mobile" 
                            href={`https://wa.me/${supportData.whatsapp.href}`}
                            data-ga4-click-item='{"event_name":"click_help","item":null,"type":null,"hierarchy":null,"id":null,"id_name":null,"interface_location":"footer","status":null,"meta":null,"comment":null}'
                        >
                            مركز الدعم
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;