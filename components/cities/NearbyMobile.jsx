'use client'

const NearbyMobile = ({ citiesData = [] }) => {
    // Function to render a single city item for mobile
    const renderMobileCityItem = (city, index) => (
        <div 
            key={city.id}
            className="item-slider__item item-slider__item--default slick-slide slick-current slick-active" 
            style={{width: "108px"}} 
            tabIndex="-1" 
            role="option" 
            aria-describedby={`slick-slide${70 + index}`} 
            data-slick-index={index} 
            aria-hidden="false"
        >
            <div className="carousel-item carousel-item--city text-center carousel-item--loaded" data-carousel-item="">
                <div className="carousel-item__image">
                    <a 
                        className="picture-container picture-container--city picture-container--square rounded-circle picture-container--loaded"
                        href={`https://${city.slug}.plateniemlist.net`}
                        data-picture-container=""
                        data-target-blank="no-mobile"
                        tabIndex="0"
                    >
                        <img 
                            alt={city.alt || city.name} 
                            className="ls-is-cached lazyloaded" 
                            src={city.imageUrl} 
                        />
                    </a>
                </div>
                <div className="carousel-item__info carousel-item__info--not-loaded">
                    <div className="carousel-item__name">
                        <a 
                            className="carousel-item__title" 
                            href={`https://${city.slug}.plateniemlist.net`} 
                            tabIndex="0"
                        >
                            {city.name}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="section ">
            <div className="no-overflow">
                <div className="container2 padded clearfix">
                    <div className="section__header">
                        <h2 className="section__title ">المدن القريبة مع الفعاليات المقامة حاليًا</h2>
                    </div>
                    <div className="section__content">
                        <div 
                            className="item-slider item-slider--default clearfix" 
                            data-item-slider="default"
                            data-item-slider-config='{"slidesToShow":6,"slidesToScroll":1,"infinite":false,"autoplay":false,"responsive":[{"breakpoint":768,"settings":{"slidesToShow":3,"slidesToScroll":3}}]}'
                        >
                            <div 
                                className="item-slider__items item-slider__items--wider item-slider__items--default slick-initialized slick-slider"
                                data-item-slider--items=""
                                data-ga4-swipe-item='{"event_name":"media_click","item":null,"type":"you_might_like","hierarchy":null,"id":null,"id_name":null,"interface_location":null,"status":null,"meta":null,"comment":null}'
                            >
                                <div aria-live="polite" className="slick-list draggable">
                                    <div 
                                        className="slick-track"
                                        style={{opacity: 1, width: "240px", transform: "translate3d(0px, 0px, 0px)"}}
                                        role="listbox"
                                    >
                                        {citiesData.slice(0, 2).map((city, index) => renderMobileCityItem(city, index))}
                                    </div>
                                </div>
                            </div>
                            <a 
                                href="javascript:void(0)"
                                className="item-slider__arrow item-slider__arrow--left slick-arrow slick-hidden"
                                data-switch-item-slider=""
                                data-ga4-click-item='{"event_name":"media_click","item":null,"type":"you_might_like","hierarchy":null,"id":null,"id_name":null,"interface_location":null,"status":null,"meta":null,"comment":null}'
                                style={{}}
                                aria-disabled="false" 
                                tabIndex="-1"
                            >
                                <svg className="item-slider__arrow-icon item-slider__arrow-icon--left icon icon-arrowhead-b-left">
                                    <use xlinkHref="#svg-icon-arrowhead-b-left"></use>
                                </svg>
                            </a>
                            <a 
                                href="javascript:void(0)"
                                className="item-slider__arrow item-slider__arrow--right slick-arrow slick-hidden slick-disabled"
                                data-switch-item-slider=""
                                data-ga4-click-item='{"event_name":"media_click","item":null,"type":"you_might_like","hierarchy":null,"id":null,"id_name":null,"interface_location":null,"status":null,"meta":null,"comment":null}'
                                style={{}}
                                aria-disabled="true" 
                                tabIndex="-1"
                            >
                                <svg className="item-slider__arrow-icon item-slider__arrow-icon--right icon icon-arrowhead-b-right">
                                    <use xlinkHref="#svg-icon-arrowhead-b-right"></use>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NearbyMobile; 