'use client'

import React, { useState } from 'react';
import CityModal from './CityModal';

const Header = ({ navigationData = { mainLinks: [], dropdowns: {} }, citySlug = 'riyadh', currentCityName = 'الرياض' }) => {
    const [isCityModalOpen, setIsCityModalOpen] = useState(false);

    const handleCityClick = () => {
        setIsCityModalOpen(true);
    };

    const handleCityModalClose = () => {
        setIsCityModalOpen(false);
    };
    // Function to render main navigation links
    const renderMainNavLinks = () => {
        // Use dynamic data if available, otherwise show fallback
        const mainLinks = navigationData.mainLinks

        return mainLinks.map(link => (
            <li key={link.id} className="main-header-links__item">
                {link.hasDropdown ? (
                    <>
                        <a href="javascript:void(0)" className="main-header-links__link link no-mobile" data-dropdown-toggle="" data-dropdown-target={link.dropdownTarget}>
                            {link.text}
                            <svg className="icon icon-slider-arrow-left">
                                <use xlinkHref="#svg-icon-slider-arrow-left"></use>
                            </svg>
                        </a>
                        <a href="javascript:void(0)" className="main-header-links__link link mobile" data-overlap-modal-button="header-links" data-overlap-modal-target={link.dropdownTarget}>
                            {link.text}
                            <svg className="icon icon-slider-arrow-left">
                                <use xlinkHref="#svg-icon-slider-arrow-left"></use>
                            </svg>
                        </a>
                    </>
                ) : (
                    <a href={link.href} className="main-header-links__link link">
                        {link.text}
                    </a>
                )}
            </li>
        ));
    };

    // Function to render dropdown categories
    const renderDropdownCategories = (dropdownType) => {
        const dropdown = navigationData.dropdowns[dropdownType];
        if (!dropdown || !dropdown.categories.length) return null;

        return dropdown.categories.map(category => (
            <li 
                key={category.id} 
                className={`main-header-links__dropdown-item ${category.hasBorder ? (category.isAllLink ? 'border-top' : 'border-bottom') : ''}`}
            >
                <a 
                    href={category.href} 
                    className={`main-header-links__dropdown-link ${category.isTopLevel ? 'main-header-links__dropdown-link--top' : ''} ${category.isAllLink ? 'main-header-links__dropdown-link--all' : ''} link`}
                    data-header-links-top-events={category.isTopLevel ? dropdownType.slice(0, -1) : undefined}
                >
                    {category.text}
                    {category.isTopLevel && (
                        <svg className="icon icon-arrowhead-down">
                            <use xlinkHref="#svg-icon-arrowhead-down"></use>
                        </svg>
                    )}
                </a>
            </li>
        ));
    };

    // Function to render top events in dropdown
    const renderTopEvents = (dropdownType) => {
        const dropdown = navigationData.dropdowns[dropdownType];
        if (!dropdown || !dropdown.topEvents.length) return null;

        return (
            <div className="main-header-top-events">
                <div className="main-header-top-events__title">{dropdown.title}</div>
                <div className="main-header-top-events__item-list" data-header-links-top-events-content={dropdownType.slice(0, -1)}>
                    <div className="main-header-top-events__column">
                        {dropdown.topEvents.map(event => (
                            <div key={event.id} className="main-header-top-event">
                                <div className="main-header-top-event__image">
                                    <div className="picture-container picture-container--square">
                                        <a href={event.href}>
                                            <img src={event.imageUrl} alt={event.alt} />
                                        </a>
                                    </div>
                                </div>
                                <div className="main-header-top-event__data">
                                    <a href={event.href} className="main-header-top-event__name string-trim">
                                        {event.title}
                                    </a>
                                    <div className="dot-wrapper">
                                        <div className="main-header-top-event__date string-trim">{event.date}</div>
                                        <div className="dot dot--top-events"></div>
                                        <div className="main-header-top-event__price string-trim">{event.price}</div>
                                    </div>
                                </div>
                                <div className="clearfix"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };
    return (
        <div className="main-header"
            data-header='{"eventShowAttendingDatesList":[],"eventShowFavoriteDatesList":[],"iconAttending":"<svg  class=\"icon icon-checkmark\"><use xlink:href=\"#svg-icon-checkmark\"></use></svg>","iconFavorite":"<svg  class=\"icon icon-heart\"><use xlink:href=\"#svg-icon-heart\"></use></svg>","isWorldWide":0,"lang":"ar","cityPopupUrl":"/ar/city","isSetRefForCityUrl":false}'
            style={{ top: "0px" }}>
            <div className="container2 padded">
                <div className="main-header__top" data-header-top="">
                    {/* Logo */}
                    <div className="main-header__logo">
                        <div className="main-header-logo" data-main-header-logo="">
                            {/* Desktop logo */}
                            <span className="main-header-logo__desktop no-mobile">
                                <a href={`https://${citySlug}.plateniemlist.net`} className="main-header-logo__link">
                                    <img
                                        src="https://cdn.platinumlist.net/dist/v799/img/main/logo-template/pl-logo-desktop.svg"
                                        alt="تذاكر فعاليات Platinumlist.net"
                                        title="بلاتينوم لِست"
                                        className="logo__img desktop"
                                    />
                                </a>
                            </span>
                            {/* Mobile logo */}
                            <span className="main-header-logo__mobile mobile">
                                <a href={`https://${citySlug}.plateniemlist.net`} className="main-header-logo__link">
                                    <img
                                        src="https://cdn.platinumlist.net/dist/v799/img/main/logo-template/pl-logo-desktop.svg"
                                        alt="تذاكر فعاليات Platinumlist.net"
                                        title="بلاتينوم لِست"
                                        className="logo__img desktop"
                                    />
                                </a>
                            </span>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="main-header-search no-mobile" data-main-header-search="">
                        <div className="main-header-search__inner-wrapper">
                            <div className="main-header-search__close" data-search-close="">
                                <svg className="icon icon-24-kit-arrowhead-left">
                                    <use xlinkHref="#svg-icon-24-kit-arrowhead-left"></use>
                                </svg>
                            </div>
                            <div className="main-header-search__input-wrapper">
                                <div className="main-header-search__input-underlay-left"></div>
                                <div className="main-header-search__input-underlay-right"></div>
                                <div className="main-header-search__input-area">
                                    <svg className="icon icon-16-kit-search">
                                        <use xlinkHref="#svg-icon-16-kit-search"></use>
                                    </svg>
                                    <input
                                        className="main-header-search__input"
                                        placeholder="البحث عن الفعالية أو الفئة"
                                        type="text"
                                        data-search-input=""
                                        data-webengage-search=""
                                        data-main-header-search-animate=""
                                    />
                                </div>
                                <a href="javascript:void(0)" className="main-header-search__clear" data-search-clear="">
                                    <svg className="icon icon-cross">
                                        <use xlinkHref="#svg-icon-cross"></use>
                                    </svg>
                                </a>
                                {/* Calendar */}
                                <div className="main-header-search__calendar-btn main-header-calendar-btn no-mobile" data-calendar-btn="">
                                    <div className="date-picker">
                                        <button type="button" className="ui-datepicker-trigger">
                                            <svg className="icon icon-16-kit-calendar">
                                                <use xlinkHref="#svg-icon-16-kit-calendar"></use>
                                            </svg>
                                        </button>
                                        <input
                                            type="text"
                                            name=""
                                            id="dp1751102800922"
                                            value=""
                                            readOnly={true}
                                            className="main-header-calendar-btn__input hasDatepicker"
                                            placeholder="اختر التاريخ"
                                            autoComplete="off"
                                            hiddeninput='<input type="hidden" name="" value="" id="alternate-id-" />'
                                        />
                                        <input type="hidden" name="" value="" id="alternate-id-" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Search results */}
                        <div className="search-results" data-search-results="">
                            <div className="container2 padded"></div>
                        </div>
                    </div>

                    {/* City Button */}
                    <button 
                        className="main-header__city" 
                        data-main-header-city="" 
                        data-user-menu-settings="location"
                        onClick={handleCityClick}
                    >
                        <span className="main-header__city-icon">
                            <svg className="icon icon-16-kit-geo-mark">
                                <use xlinkHref="#svg-icon-16-kit-geo-mark"></use>
                            </svg>
                        </span>
                        <span className="main-header__city-name">{currentCityName}</span>
                    </button>

                    {/* Localization Switcher */}
                    <div className="main-header__localization-switcher-container no-mobile"
                        data-localization-switcher-button='{"langData":{"en":{"name":"English","title":"ENG"},"ar":{"name":"العربية","title":"العربية"},"tr":{"name":"Türkçe","title":"TUR"}},"currencyData":{"USD":{"name":"دولار أمريكي","title":"USD"},"AED":{"name":"درهم إماراتي","title":"AED"},"QAR":{"name":"ريال قطري","title":"QAR"},"SAR":{"name":"ريال سعودي","title":"SAR"},"OMR":{"name":"ريال عماني","title":"OMR"},"KWD":{"name":"دينار كويتي","title":"KWD"},"BHD":{"name":"دينار بحريني","title":"BHD"},"EUR":{"name":"يورو","title":"EUR"},"GBP":{"name":"جنيه استرليني","title":"GBP"},"EGP":{"name":"جنيه مصري","title":"EGP"},"MAD":{"name":"درهم مغربي","title":"MAD"},"TRY":{"name":"ليرة تركية","title":"TRY"},"ZAR":{"name":"الراند الجنوب أفريقي","title":"ZAR"}},"currentCurrency":"EGP","scope":"site","webengageCurrencyData":{"eventName":"Changed Currency","eventData":{"City":"Riyadh","Country":"Saudi Arabia","Previous Currency":"EGP","New Currency":"{{New Currency}}"}},"webengageLangData":{"eventName":"Changed Language","eventData":{"City":"Riyadh","Country":"Saudi Arabia","Previous Language":"{{Previous Language}}","New Language":"{{New Language}}"}}}'
                        data-v-app="">
                        <div className="__toggle__ZQpvRr8Kkp">
                            <button className="__localizationSwitcherToggle__k2ZmG4ZBc-">
                                <span className="__item__jbyp0rKpwd">
                                    <span className="__itemIcon__gjcLS8EgOa">
                                        <svg className="icon-16-kit-planet icon">
                                            <use xlinkHref="#svg-icon-16-kit-planet"></use>
                                        </svg>
                                    </span> AR
                                </span>
                                <span className="__dividerIcon__Fn2uAHAjac">
                                    <svg className="icon-divider icon">
                                        <use xlinkHref="#svg-icon-divider"></use>
                                    </svg>
                                </span>
                                <span className="__item__jbyp0rKpwd">EGP</span>
                            </button>
                        </div>
                    </div>

                    {/* User Menu */}
                    <div className="main-header__user-btn blur-inactive-menu " data-toggle-listen="" data-user-menu-btn="">
                        <div className="main-header__user-menu-overlay mobile" data-toggle-active-button=""></div>
                        <div className="toggle-active-button main-header-user-menu-switcher"
                            data-ga4-click-item='{"event_name":"login_click","item":"","type":null,"hierarchy":null,"id":null,"id_name":null,"interface_location":"page","status":null,"meta":null,"comment":null}'>
                            <div className="main-header-user-menu-switcher__close mobile">
                                <svg className="icon icon-arrow-hall-left">
                                    <use xlinkHref="#svg-icon-arrow-hall-left"></use>
                                </svg>
                            </div>
                            <div className="main-header-user-menu-switcher__logo mobile">
                                <img
                                    src="https://cdn.platinumlist.net/dist/v816/img/main/logo-template/pl-logo-desktop-ar.svg"
                                    alt="تذاكر فعاليات Platinumlist.net"
                                    title="Platinumlist"
                                    className="icon"
                                />
                            </div>
                            <div className="main-header-user-menu-switcher__avatar">
                                <div className="user-avatar">
                                    <svg className="user-avatar__icon icon icon-avatar">
                                        <use xlinkHref="#svg-icon-avatar"></use>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="main-header-user-menu log-in" data-user-menu="">
                            <div className="main-header-user-menu__log-in no-mobile main-header-border-bottom">
                                <a
                                    href="javascript:void(0)"
                                    title="تسجيل الدخول"
                                    data-header-login-button=""
                                    data-target="popup"
                                    data-popup-href={`/ar/auth/login?ref=https%3A%2F%2F${citySlug}.platinumlist.net%2Far%2F`}
                                    data-popup-additional-class="auth-popup"
                                    data-popup-smooth="1">
                                    تسجيل الدخول
                                </a>
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
                            <div className="main-header-user-menu__item-list main-header-user-menu__item-list--settings main-header-border-top mobile"
                                data-localization-switcher-user-menu-settings='{"langData":{"en":{"name":"English","title":"ENG"},"ar":{"name":"العربية","title":"العربية"},"tr":{"name":"Türkçe","title":"TUR"}},"currencyData":{"USD":{"name":"دولار أمريكي","title":"USD"},"AED":{"name":"درهم إماراتي","title":"AED"},"QAR":{"name":"ريال قطري","title":"QAR"},"SAR":{"name":"ريال سعودي","title":"SAR"},"OMR":{"name":"ريال عماني","title":"OMR"},"KWD":{"name":"دينار كويتي","title":"KWD"},"BHD":{"name":"دينار بحريني","title":"BHD"},"EUR":{"name":"يورو","title":"EUR"},"GBP":{"name":"جنيه استرليني","title":"GBP"},"EGP":{"name":"جنيه مصري","title":"EGP"},"MAD":{"name":"درهم مغربي","title":"MAD"},"TRY":{"name":"ليرة تركية","title":"TRY"},"ZAR":{"name":"الراند الجنوب أفريقي","title":"ZAR"}},"currentCurrency":"EGP","scope":"site","webengageCurrencyData":{"eventName":"Changed Currency","eventData":{"City":"Riyadh","Country":"Saudi Arabia","Previous Currency":"EGP","New Currency":"{{New Currency}}"}},"webengageLangData":{"eventName":"Changed Language","eventData":{"City":"Riyadh","Country":"Saudi Arabia","Previous Language":"{{Previous Language}}","New Language":"{{New Language}}"}}}'
                                data-v-app="">
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
                                <a href="javascript:void(0)"
                                    title="تسجيل الدخول"
                                    data-header-login-button=""
                                    data-target="popup"
                                    data-popup-href={`/ar/auth/login?ref=https%3A%2F%2F${citySlug}.platinumlist.net%2Far%2F`}
                                    data-popup-additional-class="auth-popup"
                                    data-popup-smooth="1"
                                    className="col-12 btn btn--primary-bordered">
                                    تسجيل الدخول
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Header Bottom Navigation */}
                <div className="main-header__bottom">
                    <div className="main-header-links">
                        {/* Mobile Search */}
                        <div className="main-header-search main-header-search--main-header-links mobile" data-alt-search="">
                            <div className="main-header-search__inner-wrapper">
                                <div className="main-header-search__close" data-search-close="">
                                    <svg className="icon icon-24-kit-arrowhead-left">
                                        <use xlinkHref="#svg-icon-24-kit-arrowhead-left"></use>
                                    </svg>
                                </div>
                                <div className="main-header-search__input-wrapper main-header-search__input-wrapper--main-header-links">
                                    <svg className="icon icon-16-kit-search">
                                        <use xlinkHref="#svg-icon-16-kit-search"></use>
                                    </svg>
                                    <input
                                        className="main-header-search__input main-header-search__input--main-header-links"
                                        placeholder="البحث عن الفعالية أو الفئة"
                                        type="text"
                                        data-search-input=""
                                        data-webengage-search=""
                                    />
                                    <a href="javascript:void(0)" className="main-header-search__clear" data-search-clear="">
                                        <svg className="icon icon-cross">
                                            <use xlinkHref="#svg-icon-cross"></use>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                            <div className="search-results" data-search-results="">
                                <div className="container2 padded"></div>
                            </div>
                        </div>

                        {/* Navigation Controls */}
                        <div className="main-header-links__controls main-header-links__controls--prev" data-header-links-controls-prev="">
                            <div className="main-header-links__control-btn main-header-links__control-btn--prev" data-header-links-control-btn-prev="">
                                <svg className="icon icon-arrow-rounded-2">
                                    <use xlinkHref="#svg-icon-arrow-rounded-2"></use>
                                </svg>
                            </div>
                            <div className="main-header-links__control-gradient main-header-links__control-gradient--prev"></div>
                        </div>
                        <div className="main-header-links__controls main-header-links__controls--next" data-header-links-controls-next="">
                            <div className="main-header-links__control-btn main-header-links__control-btn--next" data-header-links-control-btn-next="">
                                <svg className="icon icon-arrow-rounded-2">
                                    <use xlinkHref="#svg-icon-arrow-rounded-2"></use>
                                </svg>
                            </div>
                            <div className="main-header-links__control-gradient main-header-links__control-gradient--next"></div>
                        </div>

                        {/* Main Navigation Links */}
                        <ul className="main-header-links__list" data-header-links-list="">
                            {renderMainNavLinks()}
                        </ul>

                        {/* Dynamic Dropdown Content */}
                        {navigationData.dropdowns.events && (
                            <div className="main-header-links__dropdown" data-header-links-top-events-wrapper="" data-dropdown-content="events">
                                <div className="main-header-links__dropdown-item-list">
                                    <ul>
                                        {renderDropdownCategories('events')}
                                    </ul>
                                </div>
                                {renderTopEvents('events')}
                            </div>
                        )}

                        {navigationData.dropdowns.attractions && (
                            <div className="main-header-links__dropdown" data-header-links-top-events-wrapper="" data-dropdown-content="attractions">
                                <ul className="main-header-links__dropdown-item-list">
                                    {renderDropdownCategories('attractions')}
                                </ul>
                                {renderTopEvents('attractions')}
                            </div>
                        )}
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

export default Header;