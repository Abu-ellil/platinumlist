const NavBar = () => {
    return (
        <div 
            className="ww-header" 
            data-header='{"eventShowAttendingDatesList":null,"eventShowFavoriteDatesList":null,"iconAttending":"<svg  class=\"icon icon-checkmark\"><use xlink:href=\"#svg-icon-checkmark\"></use></svg>","iconFavorite":"<svg  class=\"icon icon-heart\"><use xlink:href=\"#svg-icon-heart\"></use></svg>","isWorldWide":1,"lang":"ar","cityPopupUrl":"/ar/city"}'
        >
            <div className="container2 ww-header__top padded">
                {/* logo */}
                <div className="ww-header-logo">
                    <a href="https://cairo.platinumlist.net/ar/" className="ww-header-logo__link">
                        <img 
                            src="https://cdn.platinumlist.net/dist/v816/img/main/logo-template/pl-logo-desktop-ar.svg" 
                            alt="تذاكر فعاليات Platinumlist.net" 
                            title="Platinumlist" 
                        />
                    </a>
                </div>
                
                {/* search */}
                <div className="ww-header-search">
                    <div className="ww-header-search__inner-wrapper">
                        <div className="ww-header-search__close mobile" data-search-close="">
                            <svg className="icon icon-arrow-rounded">
                                <use xlinkHref="#svg-icon-arrow-rounded"></use>
                            </svg>
                        </div>
                        <div className="ww-header-search__input-wrapper">
                            <svg className="icon icon-search">
                                <use xlinkHref="#svg-icon-search"></use>
                            </svg>
                            <input 
                                className="ww-header-search__input" 
                                placeholder="البحث عن الفعالية أو الفئة" 
                                type="text" 
                                data-search-input="" 
                                data-webengage-search="" 
                            />
                            <a 
                                href="javascript:void(0)" 
                                className="ww-header-search__mobile-clear" 
                                data-search-clear="" 
                                style={{display: 'none'}}
                            >
                                <svg className="icon icon-cross">
                                    <use xlinkHref="#svg-icon-cross"></use>
                                </svg>
                            </a>
                            <a 
                                href="javascript:void(0)" 
                                className="ww-header-search__desktop-clear" 
                                data-search-clear="" 
                                style={{display: 'none'}}
                            >
                                مسح
                            </a>
                        </div>
                    </div>
                    
                    {/* search results */}
                    <div className="search-results" data-search-results="">
                        <div className="container2 padded" style={{height: 'auto', position: 'relative', zoom: 1}} data-element-blocker-keep-no-overflow-class="">
                            <div className="search-results-list search-event-results">
                                <div className="search-results-list__title">الفعاليات والأنشطة الترفيهية</div>
                                
                                {/* Sample search result - you can make this dynamic later */}
                                <div className="search-results-block" data-webengage-search-event-block="">
                                    <a 
                                        className="search-results-block__image-link add-to-favorite-sticker-target" 
                                        href="https://dubai.platinumlist.net/ar/event-tickets/laperle" 
                                        data-ga4-click-item='{"event_name":"click_search_item","item":null,"type":"event_attractions","hierarchy":null,"id":"98363","id_name":"La Perle by Dragone at Al Habtoor City","interface_location":"modal","status":null,"meta":"","comment":null}'
                                    >
                                        <img 
                                            src="https://cdn.platinumlist.net/upload/event/la_perle_by_dragone_at_al_habtoor_city_2023_feb_01_2025_may_31_al_habtoor_city_dubai_98363-full-en1742303067.jpg" 
                                            alt="لا بيرل باي دراغون في مدينة الحبتور" 
                                            className="search-results-block__image" 
                                        />
                                    </a>
                                    <div className="search-results-block__info">
                                        <div className="search-results-block__name">
                                            <a 
                                                href="https://dubai.platinumlist.net/ar/event-tickets/laperle" 
                                                data-ga4-click-item='{"event_name":"click_search_item","item":null,"type":"event_attractions","hierarchy":null,"id":"98363","id_name":"La Perle by Dragone at Al Habtoor City","interface_location":"modal","status":null,"meta":"","comment":null}'
                                            >
                                                لا بيرل باي دراغون في مدينة الحبتور
                                            </a>
                                        </div>
                                        <div className="search-results-block__price-wrapper dot-wrapper">
                                            <div className="search-results-block__price">3,097.84 EGP</div>
                                        </div>
                                        <div className="search-results-block__venue">
                                            <div className="search-results-block__venue-name">مدينة الحبتور، دبي</div>
                                            <div className="dot"></div>
                                            <div className="search-results-block__venue-date">الجمعة 18 ابريل - الأحد 21 سبتمبر</div>
                                        </div>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                            </div>
                            
                            <div className="search-results-list search-artist-results">
                                <div className="search-results-list__title">نجوم الحدث</div>
                                
                                {/* Sample artist result */}
                                <div className="search-results-block">
                                    <a 
                                        className="search-results-block__image-link" 
                                        href="https://platinumlist.net/ar/artist/50/hussain-al-jassmi-hsyn-lgsmy" 
                                        data-ga4-click-item='{"event_name":"click_search_item","item":null,"type":"artists","hierarchy":null,"id":"50","id_name":"Hussain Al Jassmi","interface_location":"modal","status":null,"meta":"","comment":null}'
                                    >
                                        <img 
                                            src="https://cdn.platinumlist.net/upload/artist/hussain_al_jassmi_50-mobile1703774093.jpeg" 
                                            alt="حسين الجسمي" 
                                            className="search-results-block__image" 
                                        />
                                    </a>
                                    <div className="search-results-block__info">
                                        <div className="search-results-block__name">
                                            <a 
                                                href="https://platinumlist.net/ar/artist/50/hussain-al-jassmi-hsyn-lgsmy" 
                                                data-ga4-click-item='{"event_name":"click_search_item","item":null,"type":"artists","hierarchy":null,"id":"50","id_name":"Hussain Al Jassmi","interface_location":"modal","status":null,"meta":"","comment":null}'
                                            >
                                                حسين الجسمي
                                            </a>
                                        </div>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                            </div>
                            
                            <div className="search-results-close-btn no-mobile" data-search-close="">إغلاق</div>
                        </div>
                    </div>
                </div>
                
                {/* switchers */}
                <div className="ww-header__switchers no-mobile">
                    {/* language switcher */}
                    <div className="ww-header__switchers-item ww-header__switchers-item--lang">
                        <div className="language-switcher-modern" data-language-switcher-wrapper="" data-toggle-listen="" data-toggle-scope="switcher-opened">
                            <div className="language-switcher-modern__desktop no-mobile" data-language-switcher="" data-toggle-active-button="" data-toggle-class="switcher-opened" data-toggle-scope="closest">
                                <div className="language-switcher-modern__current color-white">
                                    <svg className="icon icon-event-panel-languages">
                                        <use xlinkHref="#svg-icon-event-panel-languages"></use>
                                    </svg>
                                    <span>العربية</span>
                                </div>
                                <svg className="language-switcher-modern__arrow color-white icon icon-arrowhead-down">
                                    <use xlinkHref="#svg-icon-arrowhead-down"></use>
                                </svg>
                            </div>
                            <div className="popup-content">
                                <div className="popup-content__head mobile">
                                    <div className="popup-content__title">اللغة</div>
                                    <a className="popup-content__close" href="javascript:void(0)" data-dismiss="modal">إغلاق</a>
                                </div>
                                <div className="popup-content__body">
                                    <ul className="language-switcher-modern__list">
                                        <li>
                                            <a 
                                                href="javascript:void(0);" 
                                                className="language-switcher-modern__item" 
                                                data-toggle-active-button="" 
                                                data-toggle-class="switcher-opened" 
                                                data-toggle-scope="closest" 
                                                data-switcher-language="en"
                                            >
                                                <span>English</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a 
                                                href="javascript:void(0);" 
                                                className="language-switcher-modern__item selected" 
                                                data-toggle-active-button="" 
                                                data-toggle-class="switcher-opened" 
                                                data-toggle-scope="closest"
                                            >
                                                <span>العربية</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a 
                                                href="javascript:void(0);" 
                                                className="language-switcher-modern__item" 
                                                data-toggle-active-button="" 
                                                data-toggle-class="switcher-opened" 
                                                data-toggle-scope="closest" 
                                                data-switcher-language="tr"
                                            >
                                                <span>Türkçe</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* currency switcher */}
                    <div className="ww-header__switchers-item ww-header__switchers-item--currency">
                        <div className="currency-switcher-modern" data-currency-switcher-wrapper="" data-toggle-listen="" data-toggle-scope="switcher-opened">
                            <div className="currency-switcher-modern__desktop no-mobile" data-currency-switcher="" data-toggle-active-button="" data-toggle-class="switcher-opened" data-toggle-scope="closest">
                                <div className="currency-switcher-modern__current color-white">
                                    <span>EGP</span>
                                </div>
                                <svg className="currency-switcher-modern__arrow color-white icon icon-arrowhead-down">
                                    <use xlinkHref="#svg-icon-arrowhead-down"></use>
                                </svg>
                            </div>
                            <div className="popup-content">
                                <div className="popup-content__head mobile">
                                    <div className="popup-content__title">العملة</div>
                                    <a className="popup-content__close" href="javascript:void(0)" data-dismiss="modal">إغلاق</a>
                                </div>
                                <div className="popup-content__body">
                                    <ul className="currency-switcher-modern__list">
                                        <li>
                                            <a 
                                                href="javascript:void(0);" 
                                                className="currency-switcher-modern__item" 
                                                data-toggle-active-button="" 
                                                data-toggle-class="switcher-opened" 
                                                data-toggle-scope="closest" 
                                                data-switcher-currency="usd"
                                            >
                                                <span>USD - دولار أمريكي</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a 
                                                href="javascript:void(0);" 
                                                className="currency-switcher-modern__item selected" 
                                                data-toggle-active-button="" 
                                                data-toggle-class="switcher-opened" 
                                                data-toggle-scope="closest"
                                            >
                                                <span>EGP - جنيه مصري</span>
                                            </a>
                                        </li>
                                        {/* Add more currencies as needed */}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* user menu */}
                <div className="ww-header__user-btn blur-inactive-menu" data-toggle-listen="" data-user-menu-btn="">
                    <div className="toggle-active-button user-menu-switcher user-menu-switcher-world-wide">
                        <div className="user-menu-switcher__close mobile">
                            <svg className="icon icon-arrow-hall-left">
                                <use xlinkHref="#svg-icon-arrow-hall-left"></use>
                            </svg>
                        </div>
                        <div className="user-menu-switcher__logo mobile">
                            <img 
                                src="https://cdn.platinumlist.net/dist/v816/img/main/logo-template/pl-logo-desktop-ar.svg" 
                                alt="تذاكر فعاليات Platinumlist.net" 
                                title="Platinumlist" 
                                className="icon" 
                            />
                        </div>
                        <svg className="icon icon-dots">
                            <use xlinkHref="#svg-icon-dots"></use>
                        </svg>
                        <div className="user-menu-switcher__avatar">
                            <div className="user-avatar">
                                <svg className="user-avatar__icon icon icon-avatar">
                                    <use xlinkHref="#svg-icon-avatar"></use>
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className="toggle-content user-menu user-menu--world-wide log-in">
                        <div className="user-menu__log-in no-mobile border-bottom">
                            <a 
                                href="javascript:void(0)" 
                                title="تسجيل الدخول" 
                                data-header-login-button="" 
                                data-target="popup" 
                                data-popup-href="/ar/auth/login?ref=https%3A%2F%2Fplatinumlist.net%2Far%2F" 
                                data-popup-additional-class="auth-popup" 
                                data-popup-smooth="1"
                            >
                                تسجيل الدخول
                            </a>
                        </div>
                        
                        <div className="user-menu__item-list">
                            <ul>
                                <li className="user-menu__item">
                                    <a href="/ar/b2capp">حمّل التطبيق الآن</a>
                                </li>
                                <li className="user-menu__item">
                                    <a href="http://helpcenter.platinumlist.net/">التواصل مع الدعم</a>
                                </li>
                                <li className="user-menu__item">
                                    <a href="https://cairo.platinumlist.net/ar/careers">انضم لفريقنا</a>
                                </li>
                            </ul>
                        </div>
                        
                        <div className="user-menu__item-list user-menu__item-list--settings border-top mobile">
                            <ul>
                                <li>
                                    <a href="javascript:void(0)" data-user-menu-settings="location">
                                        <span>الموقع:</span> القاهرة
                                    </a>
                                </li>
                                <li data-localization-switcher-user-menu-settings='{"langData":{"en":{"name":"English","title":"ENG"},"ar":{"name":"العربية","title":"العربية"},"tr":{"name":"Türkçe","title":"TUR"}},"currencyData":{"USD":{"name":"دولار أمريكي","title":"USD"},"EGP":{"name":"جنيه مصري","title":"EGP"}},"currentCurrency":"EGP","scope":"site"}' data-v-app="">
                                    <ul>
                                        <li>
                                            <button><span>اللغة:</span> AR</button>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        
                        <div className="user-menu__item-list border-top">
                            <ul>
                                <li className="user-menu__item">
                                    <a href="https://platinumlist.net/for-organisers/">بيع فعاليتك معنا</a>
                                </li>
                            </ul>
                        </div>
                        
                        <div className="user-menu__log-in mobile">
                            <a 
                                href="javascript:void(0)" 
                                title="تسجيل الدخول" 
                                data-header-login-button="" 
                                data-target="popup" 
                                data-popup-href="/ar/auth/login?ref=https%3A%2F%2Fplatinumlist.net%2Far%2F" 
                                data-popup-additional-class="auth-popup" 
                                data-popup-smooth="1" 
                                className="col-12 btn btn--primary-bordered"
                            >
                                تسجيل الدخول
                            </a>
                        </div>
                        
                        <div className="clearfix"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NavBar;