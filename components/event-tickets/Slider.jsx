const Slider = ({ sliderData = [] }) => {
    // Function to render a single slider item
    const renderSliderItem = (banner, index, isActive = false) => (
        <div 
            key={banner.id}
            className={`main-slider__item 1 slick-slide ${isActive ? 'slick-current slick-active' : ''}`}
            data-top-featured-id-banner={banner.id}
            data-full-width-slider-item=""
            style={{ background: "transparent", width: "1170px" }}
            tabIndex="-1"
            role="option"
            aria-describedby={`slick-slide${index.toString().padStart(2, '0')}`}
            data-slick-index={index}
            aria-hidden={isActive ? "false" : "true"}
        >
            {banner.hasVideo ? (
                // Video banner
                <div className="main-slider__video-wrapper" data-main-slider-video-wrapper="">
                    <div className="main-slider__video-preview" data-main-slider-video-preview="" style={{opacity: 1.85731e-05}}>
                        <a 
                            href={banner.href} 
                            className="picture-container picture-container--main-slider picture-container--loaded" 
                            data-picture-container="" 
                            tabIndex={isActive ? "0" : "-1"}
                        >
                            <picture>
                                <img 
                                    data-full-width-slider-image="" 
                                    alt={banner.alt} 
                                    className=" ls-is-cached lazyloaded" 
                                    data-src={banner.imageUrl} 
                                    src={banner.imageUrl} 
                                />
                            </picture>
                        </a>
                    </div>
                    <a 
                        href={banner.href} 
                        className="main-slider__video" 
                        data-main-slider-video={banner.videoUrl} 
                        tabIndex={isActive ? "0" : "-1"} 
                        style={{width: "1170px", height: "450px"}}
                    >
                        <video 
                            data-embedded-video="" 
                            className="main-slider__video-inner" 
                            src={banner.videoUrl} 
                            style={{position: "relative", opacity: 1, top: "0px"}} 
                            muted={true}
                            loop={true}
                            playsInline={true}
                            autoPlay={isActive}
                            width="1170" 
                            height="450"
                        />
                    </a>
                    <button className="main-slider__sound-control" type="button" data-main-slider-sound-control="" tabIndex={isActive ? "0" : "-1"}>
                        <span className="main-slider__sound-icon" data-main-slider-sound-control-unmuted="">
                            <svg className="no-mobile icon icon-24-kit-sound"><use xlinkHref="#svg-icon-24-kit-sound"></use></svg>
                            <svg className="mobile icon icon-16-kit-sound"><use xlinkHref="#svg-icon-16-kit-sound"></use></svg>
                        </span>
                        <span className="main-slider__sound-muted-icon" data-main-slider-sound-control-muted="">
                            <svg className="no-mobile icon icon-24-kit-sound-muted"><use xlinkHref="#svg-icon-24-kit-sound-muted"></use></svg>
                            <svg className="mobile icon icon-16-kit-sound-muted"><use xlinkHref="#svg-icon-16-kit-sound-muted"></use></svg>
                        </span>
                    </button>
                </div>
            ) : (
                // Image banner
                <a 
                    href={banner.href} 
                    className="picture-container picture-container--main-slider picture-container--loaded" 
                    data-picture-container="" 
                    tabIndex={isActive ? "0" : "-1"}
                >
                    <picture>
                        <img 
                            data-full-width-slider-image="" 
                            alt={banner.alt} 
                            className=" ls-is-cached lazyloaded" 
                            data-src={banner.imageUrl} 
                            src={banner.imageUrl} 
                        />
                    </picture>
                </a>
            )}
            <div className="main-slider__item-info-visible">
                <div className="main-slider__item-labels"></div>
                <div className="main-slider__item-info-loader trigger-loading">
                    <svg className="main-slider-spinner" width="30" height="28" viewBox="0 0 30 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "inline" }}>
                        <path d="M27.5005 6.38885L25.7058 7.56105C23.524 4.41549 20.0528 2.42183 16.1824 2.09124L16.3721 1.95767e-05C20.8962 0.386322 24.9522 2.71505 27.5005 6.38885Z" fill="white"></path>
                        <path d="M26.5002 19.1499C27.2222 17.5683 27.5882 15.8801 27.5882 14.1325C27.5882 12.3849 27.2222 10.6968 26.5002 9.11519L28.4783 8.26504C29.3233 10.1161 29.7517 12.0901 29.7517 14.1325C29.7517 16.1749 29.3233 18.149 28.4783 20L26.5002 19.1499Z" fill="white"></path>
                        <path d="M16.5 28L16.3103 25.9088C20.1808 25.5782 23.652 23.5845 25.8338 20.439L27.6284 21.6112C25.0801 25.285 21.0241 27.6136 16.5 28Z" fill="white"></path>
                        <path d="M3.03551 21.6112L4.83017 20.439C7.01195 23.5845 10.4831 25.5782 14.3536 25.9088L14.1639 28C9.63983 27.6137 5.58377 25.285 3.03551 21.6112Z" fill="white"></path>
                        <path d="M4.00009 9.1017C3.27807 10.6833 2.912 12.3714 2.912 14.119C2.912 15.8666 3.27807 17.5547 4.00009 19.1363L2.02196 19.9865C1.17691 18.1355 0.748535 16.1614 0.748535 14.119C0.748535 12.0767 1.17691 10.1026 2.02196 8.25156L4.00009 9.1017Z" fill="white"></path>
                        <path d="M14.1287 -3.79799e-06L14.3184 2.09121C10.4479 2.42181 6.97673 4.41547 4.79495 7.56104L3.00028 6.38883C5.54855 2.71503 9.60461 0.386439 14.1287 -3.79799e-06Z" fill="white"></path>
                    </svg>
                </div>
            </div>
            <div className="main-slider__item-info-hidden no-mobile">
                <div className="main-slider__item-info-title" title={banner.title}>
                    <a href={banner.href} tabIndex={isActive ? "0" : "-1"}>{banner.title}</a>
                </div>
            </div>
        </div>
    );

    // Only show slider if we have real data
    if (sliderData.length === 0) {
        return null;
    }

    // Calculate track width based on number of slides
    const trackWidth = sliderData.length * 1170;
    const hasMultipleSlides = sliderData.length > 1;

    return (
        <div className="no-overflow">
            <div className="container2 padded">
                <div className="main-slider top-featured" data-item-slider="main">
                    <div className="main-slider__items main-slider__items--wider slick-initialized slick-slider" data-item-slider--items="" data-ga4-swipe-item='{"event_name":"media_click","item":null,"type":"hero_banner","hierarchy":null,"id":null,"id_name":null,"interface_location":null,"status":null,"meta":null,"comment":null}'>
                        <div aria-live="polite" className="slick-list draggable">
                            <div 
                                className="slick-track" 
                                role="listbox"
                                style={{
                                    opacity: 1, 
                                    width: `${trackWidth}px`, 
                                    transform: "translate3d(0px, 0px, 0px)"
                                }}
                            >
                                {sliderData.map((banner, index) => 
                                    renderSliderItem(banner, index, index === 0)
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={`main-slider__arrow main-slider__arrow--left no-mobile slick-arrow ${!hasMultipleSlides ? 'slick-hidden' : ''}`} data-main-slider-control="prev" data-ga4-click-item='{"event_name":"media_click","item":null,"type":"hero_banner","hierarchy":null,"id":null,"id_name":null,"interface_location":null,"status":null,"meta":null,"comment":null}' style={{ display: hasMultipleSlides ? "block" : "none" }}>
                        <a className="main-slider__arrow-btn main-slider__arrow-btn--left">
                            <svg className="icon icon-main-slider-arrow-left">
                                <use xlinkHref="#svg-icon-main-slider-arrow-left"></use>
                            </svg>
                        </a>
                    </div>
                    <div className={`main-slider__arrow main-slider__arrow--right no-mobile slick-arrow ${!hasMultipleSlides ? 'slick-hidden' : ''}`} data-main-slider-control="next" data-ga4-click-item='{"event_name":"media_click","item":null,"type":"hero_banner","hierarchy":null,"id":null,"id_name":null,"interface_location":null,"status":null,"meta":null,"comment":null}' style={{ display: hasMultipleSlides ? "block" : "none" }}>
                        <a className="main-slider__arrow-btn main-slider__arrow-btn--right">
                            <svg className="icon icon-main-slider-arrow-right">
                                <use xlinkHref="#svg-icon-main-slider-arrow-right"></use>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Slider; 