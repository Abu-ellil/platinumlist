'use client';

const EventDescription = ({ data, slug }) => {
    // Handle loading and error states
    if (!data) {
        return (
            <div className="event-item__description-section event-item__description-section--structured">
                <div className="section section--item-page">
                    <div className="section__content">
                        <div>Loading...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (data.error) {
        return (
            <div className="event-item__description-section event-item__description-section--structured">
                <div className="section section--item-page">
                    <div className="section__content">
                        <div>Error loading event data: {data.error}</div>
                    </div>
                </div>
            </div>
        );
    }

    // Extract event data
    const eventData = data.data;
    if (!eventData) {
        return (
            <div className="event-item__description-section event-item__description-section--structured">
                <div className="section section--item-page">
                    <div className="section__content">
                        <div>No event data available</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="event-item__description-section event-item__description-section--structured">
            <div className="section section--item-page">
                <div className="section__content">
                    {/* Main Title Section */}
                    <div className="event-item__title">
                        <h1 className="event-item__name-title">{eventData.title}</h1>
                        <div className="event-item__text-teaser">{eventData.teaser}</div>
                    </div>

                    {/* Mobile Buy Block Section */}
                    <div className="event-item__buy-block mobile">
                        <div className="buy-block mobile">
                            <div className="buy-block__section">
                                <div className="buy-block__summary">
                                    {/* Date Section */}
                                    <div className="buy-block__date">
                                        <div className="buy-block__date-icon">
                                            <svg className="icon icon-16-kit-calendar">
                                                <use xlinkHref="#svg-icon-16-kit-calendar"></use>
                                            </svg>
                                        </div>
                                        <div className="buy-block__date-text">
                                            {/* Extract date from eventTiming or use placeholder */}
                                            {eventData.eventTiming?.eventDate || 'تاريخ الفعالية'}
                                        </div>
                                    </div>
                                    
                                    {/* Time Section */}
                                    <div className="buy-block__time">
                                        <div className="buy-block__time-icon">
                                            <svg className="icon icon-16-kit-clock">
                                                <use xlinkHref="#svg-icon-16-kit-clock"></use>
                                            </svg>
                                        </div>
                                        <div className="buy-block__time-text-wrapper">
                                            <span className="buy-block__time-text">تُفتح الأبواب:</span>
                                            <span className="buy-block__time-value">
                                                {eventData.schedule?.items?.[0]?.time || '21:00'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Venue Section */}
                                    <div className="buy-block__venue-wrapper mobile">
                                        <a className="buy-block__venue" href={eventData.google_maps_link || "javascript:void(0)"} target="_blank" rel="noopener noreferrer">
                                            <span className="buy-block__venue-icon">
                                                <svg className="icon icon-16-kit-geo-mark">
                                                    <use xlinkHref="#svg-icon-16-kit-geo-mark"></use>
                                                </svg>
                                            </span>
                                        </a>
                                        <a className="buy-block__venue" href={eventData.google_maps_link || "javascript:void(0)"} target="_blank" rel="noopener noreferrer">
                                            <span className="buy-block__venue-text">
                                                {eventData.location?.name || 'المكان'}
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Bottom Fixed Section with Price and Buy Button */}
                            <div className="buy-block__bottom-fixed">
                                <div className="buy-block__price-from">
                                    <div className="buy-block__price">
                                        <div className="buy-block__price-from-title">من:</div>
                                        {eventData.pricing?.priceFrom || 'السعر غير متوفر'}
                                    </div>
                                    {eventData.pricing?.acceleratorText && (
                                        <div className="buy-block__accelerator">
                                            <div className="accelerator-rotation" data-accelerator-rotation="">
                                                <div data-accelerator-block="" className="accelerator-rotation__accelerator accelerator-rotation__accelerator--accelerator-best-price accelerator-best-price">
                                                    {eventData.pricing.acceleratorText}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="buy-block__btn-wrapper">
                                    <a 
                                        className="buy-block__btn btn btn--blue" 
                                        href={`/tickets/${slug}`}
                                        onClick={(e) => {
                                            // Save event data to localStorage for checkout
                                            const eventDataForCheckout = {
                                                name: eventData.title || 'Event Name',
                                                venue: eventData.location?.name || 'Venue',
                                                date: eventData.eventTiming?.eventDate || 'Event Date',
                                                time: eventData.eventTiming?.doorOpenTime || '21:00',
                                                image: eventData.sliderImages?.[0]?.imageUrl || '/default-event.jpg',
                                                slug: slug,
                                                pricing: eventData.pricing,
                                                currency: eventData.pricing?.pricing_currency,
                                                pricing_currency: eventData.pricing?.pricing_currency
                                            };
                                            localStorage.setItem('eventData', JSON.stringify(eventDataForCheckout));
                                            console.log('Event data saved to localStorage:', eventDataForCheckout);
                                        }}
                                        data-webengage-click={eventData.buyButton?.webengageData ? JSON.stringify(eventData.buyButton.webengageData) : ''}
                                        data-ga4-click-item={eventData.buyButton?.ga4Data ? JSON.stringify(eventData.buyButton.ga4Data) : ''}
                                    >
                                        {eventData.buyButton?.text || 'اختيار التذاكر'}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="event-item__venue-name no-mobile">
                        <div className="event-item__venue-name-container">
                            <a href={eventData.google_maps_link || "javascript:void(0)"} target="_blank" rel="noopener noreferrer">
                                <span className="event-item__venue-name-icon">
                                    <svg className="icon icon-16-kit-geo-mark">
                                        <use xlinkHref="#svg-icon-16-kit-geo-mark"></use>
                                    </svg>
                                </span>
                            </a>
                            <a href={eventData.google_maps_link || "javascript:void(0)"} target="_blank" rel="noopener noreferrer">
                                <span className="event-item__venue-name-text">{eventData.location?.name}</span>
                            </a>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="event-item__description-section event-item__description-section--structured">
                        <div className="event-item__description-structured description-structured">
                            {/* Main Description */}
                            {eventData.description?.main && (
                                <div className="description-structured__text description-structured__text--mce description-structured__text--overview">
                                    <div dangerouslySetInnerHTML={{ __html: eventData.description.main }}></div>
                                </div>
                            )}

                            {/* Description Sections */}
                            {eventData.description?.sections && eventData.description.sections.map((section, index) => (
                                <div key={index} className="description-structured__block" data-toggle-listen="">
                                    <button
                                        className="description-structured__title"
                                        type="button"
                                        data-toggle-active-button=""
                                        data-toggle-class="description-structured__block--closed"
                                    >
                                        <h2>{section.title}</h2>
                                        <span className="description-structured__toggle">
                                            <svg className="icon icon-arrowhead-fat-up">
                                                <use xlinkHref="#svg-icon-arrowhead-fat-up"></use>
                                            </svg>
                                        </span>
                                    </button>
                                    <div className="description-structured__content">
                                        <div className="description-structured__text description-structured__text--mce">
                                            <div dangerouslySetInnerHTML={{ __html: section.content }}></div>
                                        </div>
                                    </div>
                                    <div className="description-structured__underline"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gallery Section */}
                    {eventData.gallery && eventData.gallery.length > 0 && (
                        <div className="event-item__gallery">
                            <div className="section section--item-page">
                                <div className="section__header">
                                    <h2 className="section__title section__title--item-page">استديو الصور</h2>
                                </div>
                                <div className="section__content gallery" itemScope="" itemType="http://schema.org/ImageGallery">
                                    <div className="clearfix">
                                        <div className="simple-gallery__container">
                                            {eventData.gallery.slice(0, 6).map((image, index) => (
                                                <div key={index} className="simple-gallery__container__item">
                                                    <div className="simple-gallery__container__item__image">
                                                        <figure className="item" itemProp="associatedMedia" itemScope="" itemType="http://schema.org/ImageObject">
                                                            <a href="javascript:void(0)" className="picture-container picture-container--gallery picture-container--square rounded-12" data-target="popup" data-popup-full-width="" data-popup-additional-class="with-event-gallery" data-picture-container="" itemProp="contentUrl">
                                                                <img 
                                                                    title={image.title} 
                                                                    alt={image.alt} 
                                                                    itemProp="thumbnail" 
                                                                    className="lazyloaded" 
                                                                    src={image.src} 
                                                                />
                                                            </a>
                                                            <figcaption itemProp="caption description" style={{display: 'none'}}>
                                                                {image.title}
                                                            </figcaption>
                                                        </figure>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default EventDescription;