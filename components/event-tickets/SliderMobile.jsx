'use client'

const SliderMobile = ({ sliderData = [] }) => {
    // Function to render a single mobile slider item
    const renderMobileSliderItem = (banner, index, isActive = false) => (
        <div 
            key={banner.id}
            className={`full-width-slider-item slick-slide ${isActive ? 'slick-current slick-active' : ''} ${banner.hasVideo ? '' : ''}`}
            data-full-width-slider-item=""
            data-slick-index={index}
            aria-hidden={isActive ? "false" : "true"}
            style={{ width: "100vw" }}
            tabIndex="-1"
            role="option"
            aria-describedby={`slick-slide${index.toString().padStart(2, '0')}`}
        >
            <div className={`full-width-slider-item-inner ${banner.hasVideo ? 'embedded-video' : ''}`} data-full-width-slider-embedded-video-item={banner.hasVideo ? "" : undefined}>
                {banner.hasVideo ? (
                    <>
                        <div className="full-width-slider-item-preview" data-full-width-slider-embedded-video-preview="" style={{opacity: isActive ? 0 : 1, width: "100%", height: "100%", overflow: "hidden"}}>
                            <picture style={{width: "100%", height: "100%", display: "block"}}>
                                <source data-srcset={banner.imageUrl} srcSet={banner.imageUrl} media="(min-width: 767px)" />
                                <source data-srcset={banner.mobileThumb || banner.imageUrl} srcSet={banner.mobileThumb || banner.imageUrl} media="(max-width: 767px)" />
                                <img 
                                    data-full-width-slider-image="" 
                                    alt={banner.alt} 
                                    className="lazyloaded" 
                                    data-src={banner.imageUrl} 
                                    src={banner.imageUrl} 
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        display: "block"
                                    }}
                                />
                            </picture>
                        </div>
                        <div className="full-width-slider-embedded-video" data-full-width-slider-embedded-video={banner.videoUrl} style={{width: "100vw", height: "100vw", overflow: "hidden"}}>
                            <video 
                                data-embedded-video="" 
                                className="" 
                                src={banner.videoUrl} 
                                style={{
                                    opacity: isActive ? 1 : 0,
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    display: "block"
                                }} 
                                muted={true}
                                loop={true}
                                playsInline={true}
                            />
                        </div>
                        <svg data-full-width-slider-embedded-video-play="" className="mobile icon icon-play-circled" style={{display: isActive ? "none" : "block"}}>
                            <use xlinkHref="#svg-icon-play-circled"></use>
                        </svg>
                    </>
                ) : (
                    <picture style={{width: "100%", height: "100%", display: "block", overflow: "hidden"}}>
                        <source data-srcset={banner.imageUrl} srcSet={banner.imageUrl} media="(min-width: 767px)" />
                        <source data-srcset={banner.mobileThumb || banner.imageUrl} srcSet={banner.mobileThumb || banner.imageUrl} media="(max-width: 767px)" />
                        <img 
                            data-full-width-slider-image="" 
                            alt={banner.alt} 
                            className="lazyloaded" 
                            data-src={banner.imageUrl} 
                            src={banner.imageUrl} 
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block"
                            }}
                        />
                    </picture>
                )}
            </div>
        </div>
    );

    // Only show slider if we have real data
    if (sliderData.length === 0) {
        return null;
    }

    // Calculate track width based on viewport width and number of slides
    const hasMultipleSlides = sliderData.length > 1;
    const slideWidth = window.innerWidth || 390; // Use full viewport width
    const trackWidth = hasMultipleSlides ? sliderData.length * slideWidth + (2 * slideWidth) : slideWidth;
    const translateX = hasMultipleSlides ? slideWidth : 0;

    // Generate pagination dots for multi-slider only
    const renderPaginationDots = () => {
        if (!hasMultipleSlides) return null;
        
        return sliderData.map((_, index) => (
            <li 
                key={index}
                className={index === 0 ? "slick-active" : ""}
                aria-hidden={index === 0 ? "false" : "true"}
                role="presentation"
                aria-selected={index === 0 ? "true" : "false"}
                aria-controls={`navigation${index.toString().padStart(2, '0')}`}
                id={`slick-slide${index.toString().padStart(2, '0')}`}
                style={{"--slick-active-translateX": index === 0 ? "-13.7%" : "0%"}}
            >
                <button type="button" data-role="none" role="button" tabIndex="0">
                    {index + 1}
                </button>
            </li>
        ));
    };

    return (
        <div className="image-slider-container" data-event-image-dev10333="">
            <div className="no-overflow">
                <div className="container2">
                    <div className={`main-slider main-slider--promo ${!hasMultipleSlides ? 'full-width-slider-single-item' : ''}`} data-main-slider-promo="">
                        <div className="main-slider__items" data-full-width-slider-element="" data-ga4-swipe-item='{"event_name":"media_click","item":null,"type":"hero_banner","hierarchy":null,"id":null,"id_name":null,"interface_location":null,"status":null,"meta":null,"comment":null}'>
                            <div className={`main-slider__items-container slick-initialized slick-slider ${hasMultipleSlides ? 'slick-dotted' : ''}`} data-full-width-slider-list-container="">
                                <div aria-live="polite" className="slick-list draggable">
                                    <div 
                                        className="slick-track" 
                                        style={{
                                            opacity: 1, 
                                            width: hasMultipleSlides ? `${trackWidth}px` : "100vw",
                                            transform: `translate3d(${hasMultipleSlides ? translateX : 0}px, 0px, 0px)`
                                        }} 
                                        role="listbox"
                                    >
                                        {/* Clone last item at beginning for infinite scroll effect - only for multi-slider */}
                                        {hasMultipleSlides && (
                                            <div 
                                                className="full-width-slider-item slick-slide slick-cloned" 
                                                data-full-width-slider-item="" 
                                                data-slick-index="-1" 
                                                aria-hidden="true" 
                                                style={{ width: "100vw" }}
                                                tabIndex="-1"
                                            >
                                                <div className="full-width-slider-item-inner">
                                                    <picture style={{width: "100%", height: "100%", display: "block", overflow: "hidden"}}>
                                                        <source data-srcset={sliderData[sliderData.length - 1].imageUrl} srcSet={sliderData[sliderData.length - 1].imageUrl} media="(min-width: 767px)" />
                                                        <source data-srcset={sliderData[sliderData.length - 1].mobileThumb || sliderData[sliderData.length - 1].imageUrl} srcSet={sliderData[sliderData.length - 1].mobileThumb || sliderData[sliderData.length - 1].imageUrl} media="(max-width: 767px)" />
                                                        <img 
                                                            data-full-width-slider-image="" 
                                                            alt={sliderData[sliderData.length - 1].alt} 
                                                            className="lazyloaded" 
                                                            data-src={sliderData[sliderData.length - 1].imageUrl} 
                                                            src={sliderData[sliderData.length - 1].imageUrl} 
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "cover",
                                                                display: "block"
                                                            }}
                                                        />
                                                    </picture>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Actual slider items */}
                                        {sliderData.map((banner, index) => 
                                            renderMobileSliderItem(banner, index, index === 0)
                                        )}
                                        
                                        {/* Clone first item at end for infinite scroll effect - only for multi-slider */}
                                        {hasMultipleSlides && (
                                            <div 
                                                className="full-width-slider-item slick-slide slick-cloned" 
                                                data-full-width-slider-item="" 
                                                data-slick-index={sliderData.length} 
                                                aria-hidden="true" 
                                                style={{ width: "100vw" }}
                                                tabIndex="-1"
                                            >
                                                <div className="full-width-slider-item-inner">
                                                    <picture style={{width: "100%", height: "100%", display: "block", overflow: "hidden"}}>
                                                        <source data-srcset={sliderData[0].imageUrl} srcSet={sliderData[0].imageUrl} media="(min-width: 767px)" />
                                                        <source data-srcset={sliderData[0].mobileThumb || sliderData[0].imageUrl} srcSet={sliderData[0].mobileThumb || sliderData[0].imageUrl} media="(max-width: 767px)" />
                                                        <img 
                                                            data-full-width-slider-image="" 
                                                            alt={sliderData[0].alt} 
                                                            className="lazyloaded" 
                                                            data-src={sliderData[0].imageUrl} 
                                                            src={sliderData[0].imageUrl} 
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "cover",
                                                                display: "block"
                                                            }}
                                                        />
                                                    </picture>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Pagination Dots - Always present, but empty for single slider */}
                            <div className="main-slider__pagination mobile" data-full-width-slider-pagination="" role={hasMultipleSlides ? "toolbar" : undefined}>
                                {hasMultipleSlides && (
                                    <ul className="slick-dots" style={{display: "block"}} role="tablist">
                                        {renderPaginationDots()}
                                    </ul>
                                )}
                            </div>
                            
                            {/* Navigation Arrows - Always present, but with slide-moving class for single slider */}
                            <div className={`main-slider__arrow main-slider__arrow--left ${hasMultipleSlides ? 'slick-arrow' : 'slide-moving'}`} data-full-width-slider-control="prev" data-ga4-click-item='{"event_name":"media_click","item":null,"type":"hero_banner","hierarchy":null,"id":null,"id_name":null,"interface_location":null,"status":null,"meta":null,"comment":null}' style={{display: "block"}}>
                                <a className="main-slider__arrow-btn main-slider__arrow-btn--left no-mobile">
                                    <svg className="icon icon-main-slider-arrow-left">
                                        <use xlinkHref="#svg-icon-main-slider-arrow-left"></use>
                                    </svg>
                                </a>
                                <a className="main-slider__arrow-btn main-slider__arrow-btn--left mobile">
                                    <svg className="icon icon-arrowhead-b-left">
                                        <use xlinkHref="#svg-icon-arrowhead-b-left"></use>
                                    </svg>
                                </a>
                            </div>
                            <div className={`main-slider__arrow main-slider__arrow--right ${hasMultipleSlides ? 'slick-arrow' : 'slide-moving'}`} data-full-width-slider-control="next" data-ga4-click-item='{"event_name":"media_click","item":null,"type":"hero_banner","hierarchy":null,"id":null,"id_name":null,"interface_location":null,"status":null,"meta":null,"comment":null}' style={{display: "block"}}>
                                <a className="main-slider__arrow-btn main-slider__arrow-btn--right no-mobile">
                                    <svg className="icon icon-main-slider-arrow-right">
                                        <use xlinkHref="#svg-icon-main-slider-arrow-right"></use>
                                    </svg>
                                </a>
                                <a className="main-slider__arrow-btn main-slider__arrow-btn--right mobile">
                                    <svg className="icon icon-arrowhead-b-right">
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

export default SliderMobile; 