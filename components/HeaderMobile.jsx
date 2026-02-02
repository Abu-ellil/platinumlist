'use client'

import React, { useState } from 'react';
import CityModal from './CityModal';

const HeaderMobile = ({ navigationData = { mainLinks: [], dropdowns: {} }, cityData = {}, currentCityName }) => {
    const citySlug = cityData?.data?.slug || 'riyadh';

    console.log('HeaderMobile cityData:', cityData);
    console.log('HeaderMobile citySlug:', citySlug);
    const [isCityModalOpen, setIsCityModalOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const handleCityClick = () => {
        setIsCityModalOpen(true);
    };

    const handleCityModalClose = () => {
        setIsCityModalOpen(false);
    };

    const handleUserMenuToggle = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    return (
        <div className="main-header"
            data-header='{"eventShowAttendingDatesList":[],"eventShowFavoriteDatesList":[],"iconAttending":"<svg  class=\"icon icon-checkmark\"><use xlink:href=\"#svg-icon-checkmark\"></use></svg>","iconFavorite":"<svg  class=\"icon icon-heart\"><use xlink:href=\"#svg-icon-heart\"></use></svg>","isWorldWide":0,"lang":"ar","cityPopupUrl":"/ar/city","isSetRefForCityUrl":false}'
        >
            <div className="container2 padded">
                <div className="main-header__top" data-header-top="">
                    {/* logo */}
                    <div className="main-header__logo">
                        <div className="main-header-logo" data-main-header-logo="">
                            {/* desktop logo */}
                            <span className="main-header-logo__desktop no-mobile">
                                <a href={`https://plateniemlist.net`} className="main-header-logo__link">
                                    <img src="https://cdn.platinumlist.net/dist/v816/img/main/logo-template/pl-logo-desktop-ar.svg" alt="تذاكر فعاليات Platinumlist.net" title="بلاتينوم لِست" className="logo__img desktop" />
                                </a>
                            </span>
                            {/* mobile logo */}
                            <span className="main-header-logo__mobile mobile">
                                <a href={`https://plateniemlist.net`} className="main-header-logo__link">
                                    <img src="https://cdn.platinumlist.net/dist/v816/img/main/logo-template/pl-logo-desktop-ar.svg" alt="تذاكر فعاليات Platinumlist.net" title="بلاتينوم لِست" className="logo__img desktop" />
                                </a>
                            </span>
                        </div>
                    </div>

                    {/* search */}
                    <div className="main-header-search no-mobile" data-main-header-search="">
                        <div className="main-header-search__inner-wrapper">
                            <div className="main-header-search__close" data-search-close="">
                                <svg className="icon icon-24-kit-arrowhead-left"><use xlinkHref="#svg-icon-24-kit-arrowhead-left"></use></svg>
                            </div>
                            <div className="main-header-search__input-wrapper">
                                <div className="main-header-search__input-underlay-left"></div>
                                <div className="main-header-search__input-underlay-right"></div>
                                <div className="main-header-search__input-area">
                                    <svg className="icon icon-16-kit-search"><use xlinkHref="#svg-icon-16-kit-search"></use></svg>
                                    <input className="main-header-search__input" placeholder="البحث" type="text" data-search-input="" data-webengage-search="" data-main-header-search-animate="" />
                                </div>
                                <a href="javascript:void(0)" className="main-header-search__clear" data-search-clear="">
                                    <svg className="icon icon-cross"><use xlinkHref="#svg-icon-cross"></use></svg>
                                </a>
                                {/* calendar */}
                                <div className="main-header-search__calendar-btn main-header-calendar-btn no-mobile" data-calendar-btn="">
                                    <div className="date-picker">
                                        <button type="button" className="ui-datepicker-trigger">
                                            <svg className="icon icon-16-kit-calendar"><use xlinkHref="#svg-icon-16-kit-calendar"></use></svg>
                                        </button>
                                        <input type="text" name="" id="dp1751371426782" value="" readOnly className="main-header-calendar-btn__input hasDatepicker" placeholder="اختر التاريخ" autoComplete="off" hiddeninput='<input type="hidden" name="" value="" id="alternate-id-" />' />
                                        <input type="hidden" name="" value="" id="alternate-id-" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* search results */}
                        <div className="search-results" data-search-results="">
                            <div className="container2 padded"></div>
                        </div>
                    </div>

                    <button
                        className="main-header__city"
                        data-main-header-city=""
                        data-user-menu-settings="location"
                        onClick={handleCityClick}
                    >
                        <span className="main-header__city-icon">
                            <svg className="icon icon-16-kit-geo-mark"><use xlinkHref="#svg-icon-16-kit-geo-mark"></use></svg>
                        </span>
                        <span className="main-header__city-name">{currentCityName}</span>
                    </button>

                    <div className="main-header__localization-switcher-container no-mobile" data-localization-switcher-button='{"langData":{"en":{"name":"English","title":"ENG"},"ar":{"name":"العربية","title":"العربية"},"tr":{"name":"Türkçe","title":"TUR"}},"currencyData":{"USD":{"name":"دولار أمريكي","title":"USD"},"AED":{"name":"درهم إماراتي","title":"AED"},"QAR":{"name":"ريال قطري","title":"QAR"},"SAR":{"name":"ريال سعودي","title":"SAR"},"OMR":{"name":"ريال عماني","title":"OMR"},"KWD":{"name":"دينار كويتي","title":"KWD"},"BHD":{"name":"دينار بحريني","title":"BHD"},"EUR":{"name":"يورو","title":"EUR"},"GBP":{"name":"جنيه استرليني","title":"GBP"},"EGP":{"name":"جنيه مصري","title":"EGP"},"MAD":{"name":"درهم مغربي","title":"MAD"},"TRY":{"name":"ليرة تركية","title":"TRY"},"ZAR":{"name":"الراند الجنوب أفريقي","title":"ZAR"}},"currentCurrency":"EGP","scope":"site","webengageCurrencyData":{"eventName":"Changed Currency","eventData":{"City":"Khobar","Country":"Saudi Arabia","Previous Currency":"EGP","New Currency":"{{New Currency}}"}},"webengageLangData":{"eventName":"Changed Language","eventData":{"City":"Khobar","Country":"Saudi Arabia","Previous Language":"{{Previous Language}}","New Language":"{{New Language}}"}}}' data-v-app="">
                        <button className="__localizationSwitcherToggle__k2ZmG4ZBc-">
                            <span className="__item__jbyp0rKpwd">
                                <span className="__itemIcon__gjcLS8EgOa">
                                    <svg className="icon-16-kit-planet icon"><use xlinkHref="#svg-icon-16-kit-planet"></use></svg>
                                </span> AR
                            </span>
                            <span className="__dividerIcon__Fn2uAHAjac">
                                <svg className="icon-divider icon"><use xlinkHref="#svg-icon-divider"></use></svg>
                            </span>
                            <span className="__item__jbyp0rKpwd">EGP</span>
                        </button>
                    </div>

                    <div
                        className={`main-header__user-btn blur-inactive-menu ${isUserMenuOpen ? 'active' : ''}`}
                        data-toggle-listen=""
                        data-user-menu-btn=""
                        onClick={handleUserMenuToggle}
                    >
                        <div className="main-header__user-menu-overlay mobile" data-toggle-active-button=""></div>
                        {/* user menu */}
                        <div className="toggle-active-button main-header-user-menu-switcher" data-ga4-click-item='{"event_name":"login_click","item":"","type":null,"hierarchy":null,"id":null,"id_name":null,"interface_location":"page","status":null,"meta":null,"comment":null}'>
                            <div className="main-header-user-menu-switcher__close mobile">
                                <svg className="icon icon-arrow-hall-left"><use xlinkHref="#svg-icon-arrow-hall-left"></use></svg>
                            </div>
                            <div className="main-header-user-menu-switcher__logo mobile">
                                <img src="https://cdn.platinumlist.net/dist/v816/img/main/logo-template/pl-logo-desktop-ar.svg" alt="تذاكر فعاليات Platinumlist.net" title="Platinumlist" className="icon" />
                            </div>
                            <div className="main-header-user-menu-switcher__avatar">
                                <div className="user-avatar">
                                    <svg className="user-avatar__icon icon icon-avatar"><use xlinkHref="#svg-icon-avatar"></use></svg>
                                </div>
                            </div>
                        </div>
                        <div className="main-header-user-menu log-in" data-user-menu="">
                            <div className="main-header-user-menu__log-in no-mobile main-header-border-bottom">
                                <a href="javascript:void(0)" title="تسجيل الدخول" data-header-login-button="" data-target="popup" data-popup-href={`/ar/auth/login?ref=https%3A%2F%2F${citySlug}.platinumlist.net%2Far%2F`} data-popup-additional-class="auth-popup" data-popup-smooth="1">تسجيل الدخول</a>
                            </div>
                            <ul className="main-header-user-menu__item-list">
                                <li className="main-header-user-menu__item">
                                    <a href="/ar/b2capp">حمّل التطبيق الآن</a>
                                </li>
                                <li className="main-header-user-menu__item">
                                    <a href="http://helpcenter.platinumlist.net/">التواصل مع الدعم</a>
                                </li>
                                <li className="main-header-user-menu__item">
                                    <a href={`https://${citySlug}.platinumlist.net/ar/careers`}>انضم لفريقنا</a>
                                </li>
                            </ul>
                            <div className="main-header-user-menu__item-list main-header-user-menu__item-list--settings main-header-border-top mobile" data-localization-switcher-user-menu-settings='{"langData":{"en":{"name":"English","title":"ENG"},"ar":{"name":"العربية","title":"العربية"},"tr":{"name":"Türkçe","title":"TUR"}},"currencyData":{"USD":{"name":"دولار أمريكي","title":"USD"},"AED":{"name":"درهم إماراتي","title":"AED"},"QAR":{"name":"ريال قطري","title":"QAR"},"SAR":{"name":"ريال سعودي","title":"SAR"},"OMR":{"name":"ريال عماني","title":"OMR"},"KWD":{"name":"دينار كويتي","title":"KWD"},"BHD":{"name":"دينار بحريني","title":"BHD"},"EUR":{"name":"يورو","title":"EUR"},"GBP":{"name":"جنيه استرليني","title":"GBP"},"EGP":{"name":"جنيه مصري","title":"EGP"},"MAD":{"name":"درهم مغربي","title":"MAD"},"TRY":{"name":"ليرة تركية","title":"TRY"},"ZAR":{"name":"الراند الجنوب أفريقي","title":"ZAR"}},"currentCurrency":"EGP","scope":"site","webengageCurrencyData":{"eventName":"Changed Currency","eventData":{"City":"Khobar","Country":"Saudi Arabia","Previous Currency":"EGP","New Currency":"{{New Currency}}"}},"webengageLangData":{"eventName":"Changed Language","eventData":{"City":"Khobar","Country":"Saudi Arabia","Previous Language":"{{Previous Language}}","New Language":"{{New Language}}"}}}' data-v-app="">
                                <ul>
                                    <li><button><span>اللغة:</span> AR</button></li>
                                </ul>
                            </div>
                            <ul className="main-header-user-menu__item-list main-header-border-top">
                                <li className="main-header-user-menu__item">
                                    <a href="https://platinumlist.net/for-organisers/">بيع فعاليتك معنا</a>
                                </li>
                            </ul>
                            <div className="main-header-user-menu__log-in mobile">
                                <a href="javascript:void(0)" title="تسجيل الدخول" data-header-login-button="" data-target="popup" data-popup-href={`/ar/auth/login?ref=https%3A%2F%2F${citySlug}.platinumlist.net%2Far%2F`} data-popup-additional-class="auth-popup" data-popup-smooth="1" className="col-12 btn btn--primary-bordered">تسجيل الدخول</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="main-header__bottom">
                    <div className="main-header-links">
                        <div className="main-header-search main-header-search--main-header-links mobile" data-alt-search="">
                            <div className="main-header-search__inner-wrapper">
                                <div className="main-header-search__close" data-search-close="">
                                    <svg className="icon icon-24-kit-arrowhead-left"><use xlinkHref="#svg-icon-24-kit-arrowhead-left"></use></svg>
                                </div>
                                <div className="main-header-search__input-wrapper main-header-search__input-wrapper--main-header-links">
                                    <svg className="icon icon-16-kit-search"><use xlinkHref="#svg-icon-16-kit-search"></use></svg>
                                    <input className="main-header-search__input main-header-search__input--main-header-links" placeholder="البحث عن الفعالية أو الفئة" type="text" data-search-input="" data-webengage-search="" />
                                    <a href="javascript:void(0)" className="main-header-search__clear" data-search-clear="">
                                        <svg className="icon icon-cross"><use xlinkHref="#svg-icon-cross"></use></svg>
                                    </a>
                                </div>
                            </div>
                            {/* search results */}
                            <div className="search-results" data-search-results="">
                                <div className="container2 padded"></div>
                            </div>
                        </div>

                        <div className="main-header-links__controls main-header-links__controls--prev" data-header-links-controls-prev="">
                            <div className="main-header-links__control-btn main-header-links__control-btn--prev" data-header-links-control-btn-prev="">
                                <svg className="icon icon-arrow-rounded-2"><use xlinkHref="#svg-icon-arrow-rounded-2"></use></svg>
                            </div>
                            <div className="main-header-links__control-gradient main-header-links__control-gradient--prev"></div>
                        </div>
                        <div className="main-header-links__controls main-header-links__controls--next" data-header-links-controls-next="">
                            <div className="main-header-links__control-btn main-header-links__control-btn--next" data-header-links-control-btn-next="">
                                <svg className="icon icon-arrow-rounded-2"><use xlinkHref="#svg-icon-arrow-rounded-2"></use></svg>
                            </div>
                            <div className="main-header-links__control-gradient main-header-links__control-gradient--next"></div>
                        </div>

                        <ul className="main-header-links__list" data-header-links-list="">
                            <li className="main-header-links__item">
                                <a href="javascript:void(0)" className="main-header-links__link link no-mobile" data-dropdown-toggle="" data-dropdown-target="events">الفعاليات
                                    <svg className="icon icon-slider-arrow-left"><use xlinkHref="#svg-icon-slider-arrow-left"></use></svg>
                                </a>
                                <a href="javascript:void(0)" className="main-header-links__link link mobile" data-overlap-modal-button="header-links" data-overlap-modal-target="events">الفعاليات
                                    <svg className="icon icon-slider-arrow-left"><use xlinkHref="#svg-icon-slider-arrow-left"></use></svg>
                                </a>
                            </li>
                            <li className="main-header-links__item">
                                <a href="javascript:void(0)" className="main-header-links__link link no-mobile" data-dropdown-toggle="" data-dropdown-target="attractions">المغامرات والتجارب
                                    <svg className="icon icon-slider-arrow-left"><use xlinkHref="#svg-icon-slider-arrow-left"></use></svg>
                                </a>
                                <a href="javascript:void(0)" className="main-header-links__link link mobile" data-overlap-modal-button="header-links" data-overlap-modal-target="attractions">المغامرات والتجارب
                                    <svg className="icon icon-slider-arrow-left"><use xlinkHref="#svg-icon-slider-arrow-left"></use></svg>
                                </a>
                            </li>
                        </ul>

                        <div className="main-header-links__dropdown" data-header-links-top-events-wrapper="" data-dropdown-content="events">
                            <div className="main-header-links__dropdown-item-list">
                                <ul>
                                    <li className="main-header-links__dropdown-item border-bottom">
                                        <a href="javascript:void(0)" data-header-links-top-events="event" className="main-header-links__dropdown-link main-header-links__dropdown-link--top link" data-ga4-click-item='{"event_name":"click_filter","item":"top_events","type":"event","hierarchy":null,"id":null,"id_name":null,"interface_location":"header_menu","status":null,"meta":{"type":{"static_block":"top_events"}},"comment":null}'>أبرز الفعاليات
                                            <svg className="icon icon-arrowhead-down"><use xlinkHref="#svg-icon-arrowhead-down"></use></svg>
                                        </a>
                                    </li>
                                    <li className="main-header-links__dropdown-item">
                                        <a href="/ar/calendar/today" className="main-header-links__dropdown-link link" data-ga4-click-item='{"event_name":"click_filter","item":"today","type":"event","hierarchy":null,"id":null,"id_name":null,"interface_location":"header_menu","status":null,"meta":{"type":{"static_block":"today"}},"comment":null}'>اليوم</a>
                                    </li>
                                    <li className="main-header-links__dropdown-item">
                                        <a href="/ar/calendar/this-weekend" className="main-header-links__dropdown-link link" data-ga4-click-item='{"event_name":"click_filter","item":"this_weekend","type":"event","hierarchy":null,"id":null,"id_name":null,"interface_location":"header_menu","status":null,"meta":{"type":{"static_block":"this_weekend"}},"comment":null}'>عطلة نهاية أسبوع جميلة</a>
                                    </li>
                                    <li className="main-header-links__dropdown-item border-bottom">
                                        <a href="/ar/calendar/july" className="main-header-links__dropdown-link link" data-ga4-click-item='{"event_name":"click_filter","item":"this_month","type":"event","hierarchy":null,"id":null,"id_name":null,"interface_location":"header_menu","status":null,"meta":{"type":{"static_block":"this_month"}},"comment":null}'>خلال هذا الشهر</a>
                                    </li>
                                    <li className="main-header-links__dropdown-item">
                                        <a href={`https://${citySlug}.platinumlist.net/ar/nightlife/ladies-night`} className="main-header-links__dropdown-link link" data-ga4-click-item='{"event_name":"click_filter","item":"الفعاليات الخاصة بالسيدات","type":"event","hierarchy":null,"id":null,"id_name":null,"interface_location":"header_menu","status":null,"meta":{"type":{"static_block":"الفعاليات الخاصة بالسيدات"}},"comment":null}'>الفعاليات الخاصة بالسيدات</a>
                                    </li>
                                    <li className="main-header-links__dropdown-item">
                                        <a href={`https://${citySlug}.platinumlist.net/ar/nightlife`} className="main-header-links__dropdown-link link" data-ga4-click-item='{"event_name":"click_filter","item":"السهرات الليلية","type":"event","hierarchy":null,"id":null,"id_name":null,"interface_location":"header_menu","status":null,"meta":{"type":{"static_block":"السهرات الليلية"}},"comment":null}'>السهرات الليلية</a>
                                    </li>
                                    <li className="main-header-links__dropdown-item">
                                        <a href={`https://${citySlug}.platinumlist.net/ar/festival`} className="main-header-links__dropdown-link link" data-ga4-click-item='{"event_name":"click_filter","item":"المهرجانات","type":"event","hierarchy":null,"id":null,"id_name":null,"interface_location":"header_menu","status":null,"meta":{"type":{"static_block":"المهرجانات"}},"comment":null}'>المهرجانات</a>
                                    </li>
                                    <li className="main-header-links__dropdown-item">
                                        <a href={`https://${citySlug}.platinumlist.net/ar/arabic`} className="main-header-links__dropdown-link link" data-ga4-click-item='{"event_name":"click_filter","item":"دليل الفعاليات العربية","type":"event","hierarchy":null,"id":null,"id_name":null,"interface_location":"header_menu","status":null,"meta":{"type":{"static_block":"دليل الفعاليات العربية"}},"comment":null}'>دليل الفعاليات العربية</a>
                                    </li>
                                    <li className="main-header-links__dropdown-item">
                                        <a href={`https://${citySlug}.platinumlist.net/ar/gaming`} className="main-header-links__dropdown-link link" data-ga4-click-item='{"event_name":"click_filter","item":"الألعاب والرياضات الإلكترونية","type":"event","hierarchy":null,"id":null,"id_name":null,"interface_location":"header_menu","status":null,"meta":{"type":{"static_block":"الألعاب والرياضات الإلكترونية"}},"comment":null}'>الألعاب والرياضات الإلكترونية</a>
                                    </li>
                                    <li className="main-header-links__dropdown-item">
                                        <a href={`https://${citySlug}.platinumlist.net/ar/festival/family-festival`} className="main-header-links__dropdown-link link" data-ga4-click-item='{"event_name":"click_filter","item":"المهرجانات العائلية","type":"event","hierarchy":null,"id":null,"id_name":null,"interface_location":"header_menu","status":null,"meta":{"type":{"static_block":"المهرجانات العائلية"}},"comment":null}'>المهرجانات العائلية</a>
                                    </li>
                                    <li className="main-header-links__dropdown-item border-top">
                                        <a href="/ar/event" className="main-header-links__dropdown-link main-header-links__dropdown-link--all" data-ga4-click-item='{"event_name":"click_filter","item":"all_events","type":"event","hierarchy":null,"id":null,"id_name":null,"interface_location":"main_filter","status":null,"meta":{"type":{"static_block":"all_events"}},"comment":null}'>كل الفعاليات</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="main-header-top-events">
                                <div className="main-header-top-events__title">أبرز الفعاليات</div>
                                <div className="main-header-top-events__item-list" data-header-links-top-events-content="event">
                                    <div className="main-header-top-events__column">
                                        <div className="main-header-top-event">
                                            <div className="main-header-top-event__image">
                                                <div className="picture-container picture-container--square">
                                                    <a href={`https://${citySlug}.platinumlist.net/ar/event-tickets/180-beach-club`}>
                                                        <img src="/upload/event/180_beach_club_in_khobar_2025_apr_03_2025_jun_29_al_azizyah_beach_98388-featuredmobilethumb-en1749453405.jpg" alt="شاطئ 180 في الخبر" />
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="main-header-top-event__data">
                                                <a href={`https://${citySlug}.platinumlist.net/ar/event-tickets/180-beach-club`} className="main-header-top-event__name string-trim">شاطئ 180 في الخبر</a>
                                                <div className="dot-wrapper">
                                                    <div className="main-header-top-event__date string-trim">الخميس 3 ابريل–الخميس 31 يوليو</div>
                                                    <div className="dot dot--top-events"></div>
                                                    <div className="main-header-top-event__price string-trim"><span className="price price--">1,406.05 EGP</span></div>
                                                </div>
                                            </div>
                                            <div className="clearfix"></div>
                                        </div>
                                        <div className="main-header-top-event">
                                            <div className="main-header-top-event__image">
                                                <div className="picture-container picture-container--square">
                                                    <a href={`https://${citySlug}.platinumlist.net/ar/event-tickets/banana-vip-camps`}>
                                                        <img src="/upload/event/banana_chalets_2025_jan_03_2025_jun_30_banana_beach_half_moon_96906-featuredmobilethumb-en1749453343.jpg" alt="شاليهات بنانا" />
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="main-header-top-event__data">
                                                <a href={`https://${citySlug}.platinumlist.net/ar/event-tickets/banana-vip-camps`} className="main-header-top-event__name string-trim">شاليهات بنانا</a>
                                                <div className="dot-wrapper">
                                                    <div className="main-header-top-event__date string-trim">الجمعة 3 يناير–الخميس 31 يوليو</div>
                                                    <div className="dot dot--top-events"></div>
                                                    <div className="main-header-top-event__price string-trim"><span className="price price--">6,113.26 EGP</span></div>
                                                </div>
                                            </div>
                                            <div className="clearfix"></div>
                                        </div>
                                        <div className="main-header-top-event">
                                            <div className="main-header-top-event__image">
                                                <div className="picture-container picture-container--square">
                                                    <a href={`https://${citySlug}.platinumlist.net/ar/event-tickets/96769/banana-beach-events-halfmoon`}>
                                                        <img src="/upload/event/banana_beach_events_halfmoon_2025_jan_02_2025_jun_30_banana_beach_half_moon_96769-featuredmobilethumb-en1749453341.png" alt="فعالية شاطئ بنانا - هافمون" />
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="main-header-top-event__data">
                                                <a href={`https://${citySlug}.platinumlist.net/ar/event-tickets/96769/banana-beach-events-halfmoon`} className="main-header-top-event__name string-trim">فعالية شاطئ بنانا - هافمون</a>
                                                <div className="dot-wrapper">
                                                    <div className="main-header-top-event__date string-trim">الخميس 2 يناير–الجمعة 1 اغسطس</div>
                                                    <div className="dot dot--top-events"></div>
                                                    <div className="main-header-top-event__price string-trim"><span className="price price--">135.85 EGP</span></div>
                                                </div>
                                            </div>
                                            <div className="clearfix"></div>
                                        </div>
                                        <div className="main-header-top-event">
                                            <div className="main-header-top-event__image">
                                                <div className="picture-container picture-container--square">
                                                    <a href={`https://${citySlug}.platinumlist.net/ar/event-tickets/99765/family-park-at-sunset-beach-resort`}>
                                                        <img src="/upload/event/family_park_at_sunset_beach_resort_2025_jun_03_2025_jun_28_sunset_beach_resort_marina_spa_99765-featuredmobilethumb-en1749453553.png" alt="الحديقة المائية في منتجع شاطئ الغروب" />
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="main-header-top-event__data">
                                                <a href={`https://${citySlug}.platinumlist.net/ar/event-tickets/99765/family-park-at-sunset-beach-resort`} className="main-header-top-event__name string-trim">الحديقة المائية في منتجع شاطئ الغروب</a>
                                                <div className="dot-wrapper">
                                                    <div className="main-header-top-event__date string-trim">الثلاثاء 3 يونيو–الجمعة 29 اغسطس</div>
                                                    <div className="dot dot--top-events"></div>
                                                    <div className="main-header-top-event__price string-trim"><span className="price price--">1,630.20 EGP</span></div>
                                                </div>
                                            </div>
                                            <div className="clearfix"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="main-header-links__dropdown" data-header-links-top-events-wrapper="" data-dropdown-content="attractions">
                            <ul className="main-header-links__dropdown-item-list">
                                <li className="main-header-links__dropdown-item border-bottom">
                                    <a href="javascript:void(0)" data-header-links-top-events="attraction" className="main-header-links__dropdown-link main-header-links__dropdown-link--top link">التجارب الاستثنائية
                                        <svg className="icon icon-arrowhead-down"><use xlinkHref="#svg-icon-arrowhead-down"></use></svg>
                                    </a>
                                </li>
                                <li className="main-header-links__dropdown-item event-type-link">
                                    <a href={`https://${citySlug}.platinumlist.net/ar/attraction/attractions`} className="main-header-links__dropdown-link link">أفضل الأماكن السياحية تقييمًا</a>
                                </li>
                                <li className="main-header-links__dropdown-item event-type-link">
                                    <a href={`https://${citySlug}.platinumlist.net/ar/attraction/experiences`} className="main-header-links__dropdown-link link">التجارب المشوّقة</a>
                                </li>
                                <li className="main-header-links__dropdown-item event-type-link">
                                    <a href={`https://${citySlug}.platinumlist.net/ar/attraction/experiences/entertainment-and-games`} className="main-header-links__dropdown-link link">الترفيه والألعاب</a>
                                </li>
                                <li className="main-header-links__dropdown-item border-top">
                                    <a href="/ar/attraction" className="main-header-links__dropdown-link main-header-links__dropdown-link--all">المغامرات والتجارب المشوقة</a>
                                </li>
                            </ul>
                            <div className="main-header-top-events">
                                <div className="main-header-top-events__title">أبرز الفعاليات والأنشطة الترفيهية</div>
                                <div className="main-header-top-events__item-list" data-header-links-top-events-content="attraction">
                                    <div className="main-header-top-events__column">
                                        <div className="main-header-top-event">
                                            <div className="main-header-top-event__image">
                                                <div className="picture-container picture-container--square">
                                                    <a href={`https://${citySlug}.platinumlist.net/ar/event-tickets/eva-virtual`}>
                                                        <img src="/upload/event/eva_virtual_reality_gaming_in_khobar_2025_feb_21_2025_jul_01_eva_al_khobar_97886-featuredmobilethumb-en1749453378.png" alt="عالم إيفا لألعاب الواقع الإفتراضي في الخبر" />
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="main-header-top-event__data">
                                                <a href={`https://${citySlug}.platinumlist.net/ar/event-tickets/eva-virtual`} className="main-header-top-event__name string-trim">عالم إيفا لألعاب الواقع الإفتراضي في الخبر</a>
                                                <div className="dot-wrapper">
                                                    <div className="main-header-top-event__date string-trim">الجمعة 21 فبراير–الإثنين 1 سبتمبر</div>
                                                    <div className="dot dot--top-events"></div>
                                                    <div className="main-header-top-event__price string-trim"><span className="price price--color-red">التذاكر بيعت بالكامل</span></div>
                                                </div>
                                            </div>
                                            <div className="clearfix"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* City Modal */}
            <CityModal
                isOpen={isCityModalOpen}
                onClose={handleCityModalClose}
                citySlug={citySlug}
            />
        </div>
    );
};

export default HeaderMobile; 