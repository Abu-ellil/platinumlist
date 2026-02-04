'use client'

const Cards = ({ citySlug, eventsData = [], sectionTitle = 'أبرز الفعاليات', serverError = false, isFallback = false }) => {
    // Split events into two groups for the two sliders
    const firstSliderEvents = eventsData.slice(0, 4);
    const secondSliderEvents = eventsData.slice(4, 8);

    // Function to create GA4 click data
    const createGA4ClickData = (event, type = "top_events_all") => {
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

    // Function to render a single event card
    const renderEventCard = (event, isHorizontal = false) => (
        <div key={event.id} className={`carousel-item carousel-item--event ${isHorizontal ? 'carousel-item--horizontal' : ''} carousel-item--loaded`} data-carousel-item="">
            <div className={`carousel-item__image ${isHorizontal ? 'carousel-item__image--horizontal' : ''}`}>
                <a 
                    className={`picture-container picture-container--event ${isHorizontal ? 'picture-container--event--horizontal picture-container--square' : 'picture-container--rectangular'} rounded-12 picture-container--loaded`}
                    href={event.href}
                    data-picture-container=""
                    data-ga4-click-item={createGA4ClickData(event)}
                    tabIndex="0"
                >
                    <div className="carousel-item__image-top">
                        <div className="carousel-item__image-top-left">
                            {event.label && (
                                <div className="carousel-item__label">
                                    <div className="image-label image-label--with-crop">{event.label}</div>
                                </div>
                            )}
                            {event.rating && (
                                <div className="carousel-item__rating">{event.rating}</div>
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
                    <picture>
                        <source 
                            data-srcset={event.imageUrl} 
                            srcSet={event.imageUrl} 
                            media="(min-width: 767px)" 
                        />
                        <source 
                            data-srcset={isHorizontal ? event.mobileThumb : event.imageFull} 
                            srcSet={isHorizontal ? event.mobileThumb : event.imageFull} 
                            media="(min-width: 414px)" 
                        />
                        <source 
                            data-srcset={isHorizontal ? event.mobileThumb : event.imageUrl} 
                            srcSet={isHorizontal ? event.mobileThumb : event.imageUrl} 
                            media="(max-width: 414px)" 
                        />
                        <img 
                            alt={event.alt} 
                            title={event.alt} 
                            className=" ls-is-cached lazyloaded" 
                            data-src={event.imageUrl} 
                            src={event.imageUrl} 
                        />
                    </picture>
                </a>
            </div>
            <div className={`carousel-item__info ${isHorizontal ? 'carousel-item__info--horizontal' : ''} carousel-item__info--not-loaded`}>
                <div className="carousel-item__name">
                    <a 
                        className="carousel-item__title" 
                        href={event.href}
                        data-ga4-click-item={createGA4ClickData(event)}
                        tabIndex="0"
                    >
                        {event.title}
                    </a>
                </div>
                <div className="carousel-item__details">
                    <div className="carousel-item__top">
                        <span className="price price--">{event.price}</span>
                        {event.accelerator && (
                            <div className={`carousel-item__accelerator accelerator accelerator-${event.acceleratorType}`}>
                                {event.accelerator}
                            </div>
                        )}
                    </div>
                    <div className="carousel-item__bottom">
                        <span className="date date--color-gray">{event.date}</span>
                    </div>
                    {isHorizontal && event.accelerator && (
                        <div className="carousel-item__bottom">
                            <div className={`accelerator accelerator-${event.acceleratorType}`}>
                                {event.accelerator}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // Function to render slider items
    const renderSliderItems = (events, isHorizontal = false) => 
        events.map((event, index) => (
            <div 
                key={event.id}
                className="item-slider__item item-slider__item--default slick-slide slick-current slick-active" 
                data-slick-index={index} 
                aria-hidden="false" 
                style={{width: isHorizontal ? "0px" : "269px"}} 
                tabIndex="-1" 
                role="option" 
                aria-describedby={`slick-slide${index + 10}`}
            >
                {isHorizontal ? (
                    <div className="content-wrapper">
                        {renderEventCard(event, true)}
                    </div>
                ) : (
                    renderEventCard(event, false)
                )}
            </div>
        ));

    return (
        <div className="section">
            <div className="no-overflow">
                <div className="container2 padded clearfix">
                    <div className="section__header">
                        <h2 className="section__title">
                            <a 
                                href="/ar/event/top" 
                                className="section__link" 
                                data-ga4-click-item='{"event_name":"click_item_all","item":"event","type":"top_events_all","hierarchy":null,"id":null,"id_name":null,"interface_location":"page","status":null,"meta":null,"comment":null}'
                            >
                                {sectionTitle}
                                <svg className="section__arrow-right icon icon-arrow-right">
                                    <use xlinkHref="#svg-icon-arrow-right"></use>
                                </svg>
                            </a>
                        </h2>
                        <a 
                            href="/ar/event/top" 
                            className="section__more-link no-mobile" 
                            data-ga4-click-item='{"event_name":"click_item_all","item":"event","type":"top_events_all","hierarchy":null,"id":null,"id_name":null,"interface_location":"page","status":null,"meta":null,"comment":null}'
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
                        {isFallback && !serverError && (
                            <div style={{ 
                                textAlign: 'center', 
                                padding: '1rem', 
                                color: '#28a745', 
                                fontSize: '0.9rem',
                                marginBottom: '1rem',
                                backgroundColor: '#d4edda',
                                borderRadius: '4px'
                            }}>
                                جلب بيانات من قاعدة البيانات
                            </div>
                        )}
                        <div className="content-slider content-wrapper no-mobile">
                            {/* First Slider */}
                            <div className="item-slider item-slider--default clearfix" data-item-slider="default" data-item-slider-config='{"slidesToShow":4,"slidesToScroll":1,"infinite":false,"autoplay":false,"responsive":[{"breakpoint":768,"settings":{"slidesToShow":1,"slidesToScroll":1}}]}'>
                                <div className="item-slider__items item-slider__items--wider item-slider__items--default slick-initialized slick-slider" data-item-slider--items="" data-ga4-swipe-item='{"event_name":"media_click","item":null,"type":"you_might_like","hierarchy":null,"id":null,"id_name":null,"interface_location":null,"status":null,"meta":null,"comment":null}'>
                                    <div aria-live="polite" className="slick-list draggable">
                                        <div className="slick-track" style={{opacity: 1, width: "1188px", transform: "translate3d(0px, 0px, 0px)"}} role="listbox">
                                            {renderSliderItems(firstSliderEvents)}
                                        </div>
                                    </div>
                                </div>
                                <a href="javascript:void(0)" className="item-slider__arrow item-slider__arrow--left slick-arrow slick-hidden" data-switch-item-slider="" data-ga4-click-item='{"event_name":"media_click","item":null,"type":"you_might_like","hierarchy":null,"id":null,"id_name":null,"interface_location":null,"status":null,"meta":null,"comment":null}' aria-disabled="true" tabIndex="-1">
                                    <svg className="item-slider__arrow-icon item-slider__arrow-icon--left icon icon-arrowhead-b-left">
                                        <use xlinkHref="#svg-icon-arrowhead-b-left"></use>
                                    </svg>
                                </a>
                                <a href="javascript:void(0)" className="item-slider__arrow item-slider__arrow--right slick-arrow slick-hidden" data-switch-item-slider="" data-ga4-click-item='{"event_name":"media_click","item":null,"type":"you_might_like","hierarchy":null,"id":null,"id_name":null,"interface_location":null,"status":null,"meta":null,"comment":null}' aria-disabled="true" tabIndex="-1">
                                    <svg className="item-slider__arrow-icon item-slider__arrow-icon--right icon icon-arrowhead-b-right">
                                        <use xlinkHref="#svg-icon-arrowhead-b-right"></use>
                                    </svg>
                                </a>
                            </div>

                            {/* Second Slider */}
                            <div className="item-slider item-slider--default clearfix" data-item-slider="default" data-item-slider-config='{"slidesToShow":4,"slidesToScroll":1,"infinite":false,"autoplay":false,"responsive":[{"breakpoint":768,"settings":{"slidesToShow":1,"slidesToScroll":1}}]}'>
                                <div className="item-slider__items item-slider__items--wider item-slider__items--default slick-initialized slick-slider" data-item-slider--items="" data-ga4-swipe-item='{"event_name":"media_click","item":null,"type":"you_might_like","hierarchy":null,"id":null,"id_name":null,"interface_location":null,"status":null,"meta":null,"comment":null}'>
                                    <div aria-live="polite" className="slick-list draggable">
                                        <div className="slick-track" style={{opacity: 1, width: "1188px", transform: "translate3d(0px, 0px, 0px)"}} role="listbox">
                                            {renderSliderItems(secondSliderEvents)}
                                        </div>
                                    </div>
                                </div>
                                <a href="javascript:void(0)" className="item-slider__arrow item-slider__arrow--left slick-arrow slick-hidden" data-switch-item-slider="" data-ga4-click-item='{"event_name":"media_click","item":null,"type":"you_might_like","hierarchy":null,"id":null,"id_name":null,"interface_location":null,"status":null,"meta":null,"comment":null}' aria-disabled="true" tabIndex="-1">
                                    <svg className="item-slider__arrow-icon item-slider__arrow-icon--left icon icon-arrowhead-b-left">
                                        <use xlinkHref="#svg-icon-arrowhead-b-left"></use>
                                    </svg>
                                </a>
                                <a href="javascript:void(0)" className="item-slider__arrow item-slider__arrow--right slick-arrow slick-hidden" data-switch-item-slider="" data-ga4-click-item='{"event_name":"media_click","item":null,"type":"you_might_like","hierarchy":null,"id":null,"id_name":null,"interface_location":null,"status":null,"meta":null,"comment":null}' aria-disabled="true" tabIndex="-1">
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

export default Cards;