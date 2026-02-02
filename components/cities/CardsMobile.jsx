'use client'

const CardsMobile = ({ citySlug, eventsData = [], sectionTitle = 'المعالم السياحية المميزة', serverError = false }) => {
    // Function to create GA4 click data
    const createGA4ClickData = (event, type = "top_attractions_all") => {
        return JSON.stringify({
            event_name: "click_item",
            item: "event",
            type: type,
            hierarchy: event.hierarchy,
            id: event.id,
            id_name: event.title,
            interface_location: "page",
            status: null,
            meta: null,
            comment: null
        });
    };

    // Function to render mobile event card
    const renderMobileEventCard = (event, index) => (
        <div 
            key={event.id}
            className="item-slider__item item-slider__item--default slick-slide slick-current slick-active" 
            style={{width: "0px"}} 
            data-slick-index={index} 
            aria-hidden={index === 0 ? "false" : "true"} 
            tabIndex="-1" 
            role="option" 
            aria-describedby={`slick-slide${index.toString().padStart(2, '0')}`}
        >
            <div className={`carousel-item carousel-item--event ${index === 0 ? 'carousel-item--loaded' : 'carousel-item--not-loaded'}`} data-carousel-item="">
                <div className="carousel-item__image">
                    <a 
                        className={`picture-container picture-container--event picture-container--rectangular rounded-12 ${index === 0 ? 'picture-container--loaded' : 'picture-container--not-loaded'}`}
                        href={event.href}
                        data-picture-container=""
                        data-ga4-click-item={createGA4ClickData(event)}
                        tabIndex={index === 0 ? "0" : "-1"}
                    >
                        <div className="carousel-item__image-top">
                            <div className="carousel-item__image-top-left">
                                {event.label && (
                                    <div className="carousel-item__label">
                                        <div className="image-label image-label--with-crop">{event.label}</div>
                                    </div>
                                )}
                            </div>
                            <div className="carousel-item__image-top-right">
                                <span 
                                    className="carousel-item__add-to-favorite add-to-favorite" 
                                    data-add-to-favorite="" 
                                    data-favorite-status="not-in" 
                                    data-favorite-id={event.id} 
                                    data-favorite-entity="event"
                                >
                                    <svg className="icon icon-heart">
                                        <use xlinkHref="#svg-icon-heart"></use>
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <img 
                            alt={event.alt || event.title} 
                            title={event.alt || event.title} 
                            className={index === 0 ? "lazyloaded" : "lazyload"} 
                            src={index === 0 ? event.imageUrl : "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20370%20208'%20width='370'%20height='208'%3E%3C/svg%3E"} 
                        />
                    </a>
                </div>
                <div className="carousel-item__info carousel-item__info--not-loaded">
                    <div className="carousel-item__name">
                        <a 
                            className="carousel-item__title" 
                            href={event.href}
                            data-ga4-click-item={createGA4ClickData(event)}
                            tabIndex={index === 0 ? "0" : "-1"}
                        >
                            {event.title}
                        </a>
                    </div>
                    <div className="carousel-item__details">
                        <div className="carousel-item__top">
                            {event.crossedPrice && (
                                <span className="price price--accelerator-crossed-price">{event.crossedPrice}</span>
                            )}
                            <span className="price price--">{event.price}</span>
                            {event.accelerator && (
                                <div className={`carousel-item__accelerator accelerator accelerator-${event.acceleratorType || 'custom-text'}`}>
                                    {event.accelerator}
                                </div>
                            )}
                        </div>
                        <div className="carousel-item__bottom">
                            {event.discount && (
                                <div className="carousel-item__extended-accelerate extended-accelerate">
                                    <div className="extended-accelerate__discount discount-green">{event.discount}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="section">
            <div className="no-overflow">
                <div className="container2 padded clearfix">
                    <div className="section__header">
                        <h2 className="section__title">
                            <a 
                                href="/ar/attraction/top" 
                                className="section__link" 
                                data-ga4-click-item='{"event_name":"click_item_all","item":"event","type":"top_attractions_all","hierarchy":null,"id":null,"id_name":null,"interface_location":"page","status":null,"meta":null,"comment":null}'
                            >
                                {sectionTitle} 
                                <svg className="section__arrow-right icon icon-arrow-right">
                                    <use xlinkHref="#svg-icon-arrow-right"></use>
                                </svg>
                            </a>
                        </h2>
                        <a 
                            href="/ar/attraction/top" 
                            className="section__more-link no-mobile" 
                            data-ga4-click-item='{"event_name":"click_item_all","item":"event","type":"top_attractions_all","hierarchy":null,"id":null,"id_name":null,"interface_location":"page","status":null,"meta":null,"comment":null}'
                        >
                            عرض الكل 
                            <svg className="section__arrow-right section__arrow-right--light-grey icon icon-arrow-right">
                                <use xlinkHref="#svg-icon-arrow-right"></use>
                            </svg>
                        </a>
                    </div>
                    <div className="section__content">
                        {serverError && (
                            <div style={{ 
                                textAlign: 'center', 
                                padding: '1rem', 
                                color: '#dc3545', 
                                fontSize: '0.9rem',
                                marginBottom: '1rem'
                            }}>
                                خطأ في تحميل الفعاليات.
                            </div>
                        )}
                        <div className="content-slider content-wrapper no-mobile">
                            {/* First Slider */}
                            <div className="item-slider item-slider--default clearfix" data-item-slider="default" data-item-slider-config='{"slidesToShow":4,"slidesToScroll":1,"infinite":false,"autoplay":false,"responsive":[{"breakpoint":768,"settings":{"slidesToShow":1,"slidesToScroll":1}}]}'>
                                <div className="item-slider__items item-slider__items--wider item-slider__items--default slick-initialized slick-slider" data-item-slider--items="" data-ga4-swipe-item='{"event_name":"media_click","item":null,"type":"you_might_like","hierarchy":null,"id":null,"id_name":null,"interface_location":null,"status":null,"meta":null,"comment":null}'>
                                    <div aria-live="polite" className="slick-list draggable">
                                        <div className="slick-track" style={{opacity: 1, width: "0px", transform: "translate3d(0px, 0px, 0px)"}} role="listbox">
                                            {eventsData.slice(0, 4).map((event, index) => renderMobileEventCard(event, index))}
                                        </div>
                                    </div>
                                </div>
                                <a href="javascript:void(0)" className="item-slider__arrow item-slider__arrow--left slick-arrow slick-disabled" data-switch-item-slider="" data-ga4-click-item='{"event_name":"media_click","item":null,"type":"you_might_like","hierarchy":null,"id":null,"id_name":null,"interface_location":null,"status":null,"meta":null,"comment":null}' style={{display: "block"}} aria-disabled="true">
                                    <svg className="item-slider__arrow-icon item-slider__arrow-icon--left icon icon-arrowhead-b-left">
                                        <use xlinkHref="#svg-icon-arrowhead-b-left"></use>
                                    </svg>
                                </a>
                                <a href="javascript:void(0)" className="item-slider__arrow item-slider__arrow--right slick-arrow" data-switch-item-slider="" data-ga4-click-item='{"event_name":"media_click","item":null,"type":"you_might_like","hierarchy":null,"id":null,"id_name":null,"interface_location":null,"status":null,"meta":null,"comment":null}' style={{display: "block"}} aria-disabled="false">
                                    <svg className="item-slider__arrow-icon item-slider__arrow-icon--right icon icon-arrowhead-b-right">
                                        <use xlinkHref="#svg-icon-arrowhead-b-right"></use>
                                    </svg>
                                </a>
                            </div>

                            {/* Second Slider */}
                            <div className="item-slider item-slider--default clearfix" data-item-slider="default" data-item-slider-config='{"slidesToShow":4,"slidesToScroll":1,"infinite":false,"autoplay":false,"responsive":[{"breakpoint":768,"settings":{"slidesToShow":1,"slidesToScroll":1}}]}'>
                                <div className="item-slider__items item-slider__items--wider item-slider__items--default slick-initialized slick-slider" data-item-slider--items="" data-ga4-swipe-item='{"event_name":"media_click","item":null,"type":"you_might_like","hierarchy":null,"id":null,"id_name":null,"interface_location":null,"status":null,"meta":null,"comment":null}'>
                                    <div aria-live="polite" className="slick-list draggable">
                                        <div className="slick-track" style={{opacity: 1, width: "0px", transform: "translate3d(0px, 0px, 0px)"}} role="listbox">
                                            {eventsData.slice(4, 8).map((event, index) => renderMobileEventCard(event, index + 10))}
                                        </div>
                                    </div>
                                </div>
                                <a href="javascript:void(0)" className="item-slider__arrow item-slider__arrow--left slick-arrow slick-disabled" data-switch-item-slider="" data-ga4-click-item='{"event_name":"media_click","item":null,"type":"you_might_like","hierarchy":null,"id":null,"id_name":null,"interface_location":null,"status":null,"meta":null,"comment":null}' style={{display: "block"}} aria-disabled="true">
                                    <svg className="item-slider__arrow-icon item-slider__arrow-icon--left icon icon-arrowhead-b-left">
                                        <use xlinkHref="#svg-icon-arrowhead-b-left"></use>
                                    </svg>
                                </a>
                                <a href="javascript:void(0)" className="item-slider__arrow item-slider__arrow--right slick-arrow" data-switch-item-slider="" data-ga4-click-item='{"event_name":"media_click","item":null,"type":"you_might_like","hierarchy":null,"id":null,"id_name":null,"interface_location":null,"status":null,"meta":null,"comment":null}' style={{display: "block"}} aria-disabled="false">
                                    <svg className="item-slider__arrow-icon item-slider__arrow-icon--right icon icon-arrowhead-b-right">
                                        <use xlinkHref="#svg-icon-arrowhead-b-right"></use>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Mobile Slider */}
                        <div className="content-slider mobile">
                            <div className="item-slider item-slider--default clearfix" data-item-slider="default" data-item-slider-config='{"slidesToShow":4,"slidesToScroll":1,"infinite":false,"autoplay":false,"responsive":[{"breakpoint":768,"settings":{"slidesToShow":1,"slidesToScroll":1}}]}'>
                                <div className="item-slider__items item-slider__items--wider item-slider__items--default slick-initialized slick-slider" data-item-slider--items="" data-ga4-swipe-item='{"event_name":"media_click","item":null,"type":"you_might_like","hierarchy":null,"id":null,"id_name":null,"interface_location":null,"status":null,"meta":null,"comment":null}'>
                                    <div aria-live="polite" className="slick-list draggable">
                                        <div className="slick-track" style={{opacity: 1, width: "716px", transform: "translate3d(0px, 0px, 0px)"}} role="listbox">
                                            <div className="item-slider__item item-slider__item--default slick-slide slick-current slick-active" style={{width: "346px"}} data-slick-index="0" aria-hidden="false" tabIndex="-1" role="option" aria-describedby="slick-slide20">
                                                <div className="content-wrapper">
                                                    {eventsData.slice(0, 3).map((event, index) => (
                                                        <div key={event.id} className="carousel-item carousel-item--horizontal carousel-item--event carousel-item--loaded" data-carousel-item="">
                                                            <div className="carousel-item__image carousel-item__image--horizontal">
                                                                <a 
                                                                    className="picture-container picture-container--event picture-container--event--horizontal picture-container--square rounded-12 picture-container--loaded" 
                                                                    href={event.href} 
                                                                    data-picture-container="" 
                                                                    data-target-blank="no-mobile" 
                                                                    tabIndex="0"
                                                                >
                                                                    <img 
                                                                        alt={event.alt || event.title} 
                                                                        title={event.alt || event.title} 
                                                                        className="ls-is-cached lazyloaded" 
                                                                        src={event.imageFull || event.imageUrl} 
                                                                    />
                                                                </a>
                                                            </div>
                                                            <div className="carousel-item__info carousel-item__info--horizontal carousel-item__info--not-loaded">
                                                                <div className="carousel-item__name">
                                                                    <a 
                                                                        className="carousel-item__title" 
                                                                        href={event.href} 
                                                                        tabIndex="0"
                                                                    >
                                                                        {event.title}
                                                                    </a>
                                                                </div>
                                                                <div className="carousel-item__details">
                                                                    <div className="carousel-item__top">
                                                                        <span className="price price--">{event.price}</span>
                                                                    </div>
                                                                    {event.accelerator && (
                                                                        <div className="carousel-item__bottom">
                                                                            <div className={`accelerator accelerator-${event.acceleratorType || 'custom-text'}`}>
                                                                                {event.accelerator}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="item-slider__item item-slider__item--default slick-slide" tabIndex="-1" role="option" aria-describedby="slick-slide21" style={{width: "346px"}} data-slick-index="1" aria-hidden="true">
                                                <div className="content-wrapper">
                                                    {eventsData.slice(3, 6).map((event, index) => (
                                                        <div key={event.id} className="carousel-item carousel-item--horizontal carousel-item--event carousel-item--loaded" data-carousel-item="">
                                                            <div className="carousel-item__image carousel-item__image--horizontal">
                                                                <a 
                                                                    className="picture-container picture-container--event picture-container--event--horizontal picture-container--square rounded-12 picture-container--loaded" 
                                                                    href={event.href} 
                                                                    data-picture-container="" 
                                                                    data-target-blank="no-mobile" 
                                                                    tabIndex="-1"
                                                                >
                                                                    <img 
                                                                        alt={event.alt || event.title} 
                                                                        title={event.alt || event.title} 
                                                                        className="ls-is-cached lazyloaded" 
                                                                        src={event.imageFull || event.imageUrl} 
                                                                    />
                                                                </a>
                                                            </div>
                                                            <div className="carousel-item__info carousel-item__info--horizontal carousel-item__info--not-loaded">
                                                                <div className="carousel-item__name">
                                                                    <a 
                                                                        className="carousel-item__title" 
                                                                        href={event.href} 
                                                                        tabIndex="-1"
                                                                    >
                                                                        {event.title}
                                                                    </a>
                                                                </div>
                                                                <div className="carousel-item__details">
                                                                    <div className="carousel-item__top">
                                                                        {event.crossedPrice && (
                                                                            <span className="price price--accelerator-crossed-price">{event.crossedPrice}</span>
                                                                        )}
                                                                        <span className="price">{event.price}</span>
                                                                    </div>
                                                                    {event.discount && (
                                                                        <div className="carousel-item__bottom">
                                                                            <div className="extended-accelerate">
                                                                                <div className="extended-accelerate__discount discount-green">{event.discount}</div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <a href="javascript:void(0)" className="item-slider__arrow item-slider__arrow--left slick-arrow slick-disabled" data-switch-item-slider="" data-ga4-click-item='{"event_name":"media_click","item":null,"type":"you_might_like","hierarchy":null,"id":null,"id_name":null,"interface_location":null,"status":null,"meta":null,"comment":null}' style={{display: "block"}} aria-disabled="true">
                                    <svg className="item-slider__arrow-icon item-slider__arrow-icon--left icon icon-arrowhead-b-left">
                                        <use xlinkHref="#svg-icon-arrowhead-b-left"></use>
                                    </svg>
                                </a>
                                <a href="javascript:void(0)" className="item-slider__arrow item-slider__arrow--right slick-arrow" data-switch-item-slider="" data-ga4-click-item='{"event_name":"media_click","item":null,"type":"you_might_like","hierarchy":null,"id":null,"id_name":null,"interface_location":null,"status":null,"meta":null,"comment":null}' style={{display: "block"}} aria-disabled="false">
                                    <svg className="item-slider__arrow-icon item-slider__arrow-icon--right icon icon-arrowhead-b-right">
                                        <use xlinkHref="#svg-icon-arrowhead-b-right"></use>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardsMobile; 