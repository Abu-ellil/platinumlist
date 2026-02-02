'use client'

const YouMayLikeMobile = ({ data }) => {
    // Handle loading and error states
    if (!data || data.error || !data.data) {
        return null;
    }

    const eventData = data.data;
    if (!eventData.similarEvents || eventData.similarEvents.length === 0) {
        return null;
    }

    const renderMobileEventCard = (event, index) => (
        <div 
            key={index} 
            className="item-slider__item item-slider__item--similar slick-slide slick-current slick-active" 
            style={{width: "252px"}} 
            data-slick-index={index} 
            aria-hidden={index === 0 ? "false" : "true"} 
            tabIndex="-1" 
            role="option" 
            aria-describedby={`slick-slide${(index + 10).toString().padStart(2, '0')}`}
        >
            <div className="carousel-item carousel-item--similar-event carousel-item--loaded" data-carousel-item="">
                <div className="carousel-item__image">
                    <a 
                        className="picture-container picture-container--similar-event picture-container--rectangular rounded-12 picture-container--loaded" 
                        href={event.href?.replace('platinumlist.net/ar', 'plateniemlist.net')} 
                        data-picture-container="" 
                        data-target-blank="no-mobile" 
                        data-ga4-click-item='{"event_name":"click_item","item":"event","type":"similar_event","hierarchy":null,"id":null,"id_name":null,"interface_location":"page","status":null,"meta":null,"comment":null}' 
                        tabIndex={index === 0 ? "0" : "-1"}
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
                                    data-favorite-id={event.id || ""} 
                                    data-favorite-entity="event"
                                >
                                    <svg className="icon icon-heart">
                                        <use xlinkHref="#svg-icon-heart"></use>
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <img 
                            alt={event.title} 
                            title={event.title} 
                            className="lazyloaded" 
                            data-src={event.image} 
                            src={event.image} 
                        />
                    </a>
                </div>
                <div className="carousel-item__info carousel-item__info--not-loaded">
                    <div className="carousel-item__name">
                        <a 
                            className="carousel-item__title" 
                            href={event.href} 
                            data-ga4-click-item='{"event_name":"click_item","item":"event","type":"similar_event","hierarchy":null,"id":null,"id_name":null,"interface_location":"page","status":null,"meta":null,"comment":null}' 
                            tabIndex={index === 0 ? "0" : "-1"}
                        >
                            {event.title}
                        </a>
                    </div>
                    <div className="carousel-item__details">
                        <div className="carousel-item__top">
                            <span className={`price ${event.soldOut ? 'price--color-red' : 'price--'}`}>
                                {event.soldOut ? 'التذاكر بيعت بالكامل' : event.price}
                            </span>
                            {event.accelerator && (
                                <div className="accelerator accelerator-best-price">{event.accelerator}</div>
                            )}
                        </div>
                        <div className="carousel-item__bottom">
                            {event.date && (
                                <span className="date date--color-gray">{event.date}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Calculate track width - 252px per item for mobile
    const trackWidth = eventData.similarEvents.length * 252;

    return (
        <div className="event-item__similar-events">
            <div className="section section--item-page">
                <div className="section__header">
                    <h2 className="section__title section__title--item-page">قد يعجبك أيضًا</h2>
                </div>
                <div className="section__content">
                    <div 
                        className="item-slider item-slider--similar clearfix" 
                        data-item-slider="similar" 
                        data-item-slider-config='{"slidesToShow":2,"slidesToScroll":1,"infinite":false,"autoplay":false,"prevArrow":"[data-similar-arrow--left]","nextArrow":"[data-similar-arrow--right]","responsive":[{"breakpoint":768,"settings":{"slidesToShow":1,"slidesToScroll":1,"arrows":false}}]}'
                    >
                        <div 
                            className="item-slider__items item-slider__items--wider item-slider__items--similar slick-initialized slick-slider" 
                            data-item-slider--items="" 
                            data-ga4-swipe-item='{"event_name":"media_click","item":null,"type":"you_might_like","hierarchy":null,"id":null,"id_name":null,"interface_location":null,"status":null,"meta":null,"comment":null}'
                        >
                            <div aria-live="polite" className="slick-list draggable">
                                <div 
                                    className="slick-track" 
                                    style={{
                                        opacity: 1, 
                                        width: `${trackWidth}px`, 
                                        transform: "translate3d(0px, 0px, 0px)",
                                        display: 'flex'
                                    }} 
                                    role="listbox"
                                >
                                    {eventData.similarEvents.map((event, index) => renderMobileEventCard(event, index))}
                                </div>
                            </div>
                        </div>
                        
                        <a 
                            href="javascript:void(0)" 
                            className="item-slider__arrow-event-slider item-slider__arrow-event-slider--left" 
                            data-similar-arrow--left="" 
                            data-ga4-click-item='{"event_name":"media_click","item":null,"type":"you_might_like","hierarchy":null,"id":null,"id_name":null,"interface_location":null,"status":null,"meta":null,"comment":null}' 
                            style={{display: "block"}}
                        >
                            <svg className="item-slider__arrow-icon item-slider__arrow-icon--left icon icon-main-slider-arrow-left">
                                <use xlinkHref="#svg-icon-main-slider-arrow-left"></use>
                            </svg>
                        </a>
                        
                        <a 
                            href="javascript:void(0)" 
                            className="item-slider__arrow-event-slider item-slider__arrow-event-slider--right" 
                            data-similar-arrow--right="" 
                            data-ga4-click-item='{"event_name":"media_click","item":null,"type":"you_might_like","hierarchy":null,"id":null,"id_name":null,"interface_location":null,"status":null,"meta":null,"comment":null}' 
                            style={{display: "block"}}
                        >
                            <svg className="item-slider__arrow-icon item-slider__arrow-icon--right icon icon-main-slider-arrow-right">
                                <use xlinkHref="#svg-icon-main-slider-arrow-right"></use>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YouMayLikeMobile; 