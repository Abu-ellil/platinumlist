'use client';

const SideBar = ({ data, slug }) => {
    // Handle loading and error states
    if (!data) {
        return (
            <div className="event-item__side-bar event-item__side-bar--sticky no-mobile">
                <div className="event-item__side-bar-content">
                    <div>Loading...</div>
                </div>
            </div>
        );
    }

    if (data.error) {
        return (
            <div className="event-item__side-bar event-item__side-bar--sticky no-mobile">
                <div className="event-item__side-bar-content">
                    <div>Error loading event data: {data.error}</div>
                </div>
            </div>
        );
    }

    // Extract event data
    const eventData = data.data;
    if (!eventData) {
        return (
            <div className="event-item__side-bar event-item__side-bar--sticky no-mobile">
                <div className="event-item__side-bar-content">
                    <div>No event data available</div>
                </div>
            </div>
        );
    }

    // Deduplicate schedule items
    const uniqueScheduleItems = eventData.schedule?.items ? 
        eventData.schedule.items.filter((item, index, self) => 
            index === self.findIndex(t => t.time === item.time && t.description === item.description)
        ) : [];

    // Deduplicate whyBuy reasons
    const uniqueWhyBuyReasons = eventData.whyBuy?.reasons ? 
        eventData.whyBuy.reasons.filter((reason, index, self) => 
            index === self.findIndex(r => r.title === reason.title && r.description === reason.description)
        ) : [];

    // Deduplicate payment options
    const uniquePaymentOptions = eventData.whyBuy?.paymentOptions ? 
        eventData.whyBuy.paymentOptions.filter((option, index, self) => 
            index === self.findIndex(o => o.src === option.src)
        ) : [];

    return (
        <div className="event-item__side-bar event-item__side-bar--sticky no-mobile" data-event-item-sidebar="" style={{top: '119px'}}>
            <div className="event-item__side-bar-content" data-event-item-sidebar-content="">
                <div className="event-item__buy-block">
                    <div className="buy-block">
                        {/* Buy Block Summary Section */}
                        {(eventData.eventTiming?.eventDate || eventData.eventTiming?.doorOpenTime || eventData.eventTiming?.showStartTime) && (
                            <div className="buy-block__section">
                                <div className="buy-block__summary">
                                    {/* Event Date */}
                                    {eventData.eventTiming?.eventDate && (
                                        <div className="buy-block__date">
                                            <svg className="icon icon-16-kit-calendar">
                                                <use xlinkHref="#svg-icon-16-kit-calendar"></use>
                                            </svg>
                                            <div className="buy-block__date-text">{eventData.eventTiming.eventDate}</div>
                                        </div>
                                    )}
                                    
                                    {/* Event Timing */}
                                    {(eventData.eventTiming?.doorOpenTime || eventData.eventTiming?.showStartTime) && (
                                        <div className="buy-block__time">
                                            <svg className="icon icon-16-kit-clock">
                                                <use xlinkHref="#svg-icon-16-kit-clock"></use>
                                            </svg>
                                            {eventData.eventTiming?.doorOpenTime && (
                                                <div className="buy-block__time-text-wrapper">
                                                    <span className="buy-block__time-text">
                                                        {eventData.eventTiming?.doorOpenLabel || 'تُفتح الأبواب:'}
                                                    </span>
                                                    <span className="buy-block__time-value">{eventData.eventTiming.doorOpenTime}</span>
                                                </div>
                                            )}
                                            {eventData.eventTiming?.showStartTime && (
                                                <div className="buy-block__time-text-wrapper">
                                                    <span className="buy-block__time-text">
                                                        {eventData.eventTiming?.showStartLabel || 'يبدأ العرض:'}
                                                    </span>
                                                    <span className="buy-block__time-value">{eventData.eventTiming.showStartTime}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        <div className="buy-block__section buy-block__section--on-sale">
                            <div className="buy-block__section-item buy-block__section-item--on-sale" data-buy-block-action-block="" style={{width: '100%'}}>
                                <div className="buy-block__info-wrapper" data-buy-block-info-wrapper="">
                                    <div className="buy-block__price-from">
                                        <div className="buy-block__price-from-title">الأسعار تبدأ من:</div>
                                        <div className="buy-block__price">{eventData.pricing?.priceFrom || 'غير متوفر'}</div>
                                    </div>
                                </div>
                                <div className="buy-block__btn-wrapper" data-buy-block-btn-wrapper="" style={{width: 'fit-content'}}>
                                    <a 
                                        className="buy-block__btn btn btn--blue" 
                                        href={`/tickets/${slug}`}
                                        onClick={(e) => {
                                            // Save event data to localStorage for checkout
                                            const eventDataForCheckout = {
                                                name: eventData.title || 'Event Name',
                                                venue: eventData.location?.name || 'Venue',
                                                date: eventData.eventTiming?.eventDate || 'Event Date',
                                                time: eventData.eventTiming?.doorOpenTime || eventData.eventTiming?.showStartTime || '21:00',
                                                image: eventData.sliderImages?.[0]?.imageUrl || '/default-event.jpg',
                                                slug: slug,
                                                pricing: eventData.pricing,
                                                currency: eventData.pricing?.pricing_currency,
                                                pricing_currency: eventData.pricing?.pricing_currency
                                            };
                                            localStorage.setItem('eventData', JSON.stringify(eventDataForCheckout));
                                            console.log('Event data saved to localStorage:', eventDataForCheckout);
                                        }}
                                    >
                                        <span className="buy-block__btn-text">{eventData.buyButton?.text || 'اختيار التذاكر'}</span>
                                    </a>
                                </div>
                            </div>
                            {eventData.pricing?.acceleratorText && (
                                <div className="buy-block__hot-block">
                                    <div className="buy-block__accelerator">
                                        <div className="accelerator-rotation" data-accelerator-rotation="">
                                            <div data-accelerator-block="" className="accelerator-rotation__accelerator accelerator-rotation__accelerator--accelerator-custom-text accelerator-custom-text">
                                                {eventData.pricing.acceleratorText}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Inline script for buy block positioning */}
                        <script dangerouslySetInnerHTML={{
                            __html: `
                                (function () {
                                    var block = document.querySelector('[data-buy-block-action-block]');
                                    var info = document.querySelector('[data-buy-block-info-wrapper]');
                                    var btn = document.querySelector('[data-buy-block-btn-wrapper]');
                                    
                                    if (!block || !info || !btn) {
                                        return;
                                    }
                                    
                                    var setBuyBlockPosition = function () {
                                        // reset to default values
                                        btn.style.width = 'fit-content';
                                        block.style.width = '100%';
                                        
                                        var blockRect = block.getBoundingClientRect();
                                        var infoRect = info.getBoundingClientRect();
                                        var btnRect = btn.getBoundingClientRect();
                                        var isSingleLineContent = Math.ceil(blockRect.width)
                                            >= (Math.ceil(infoRect.width) + Math.ceil(btnRect.width) + 16);
                                        
                                        // setup new values
                                        if (isSingleLineContent) {
                                            block.style.height = infoRect.height > blockRect.height
                                                ? infoRect.height
                                                : btnRect.height;
                                        } else if (blockRect.height > infoRect.height && blockRect.height > btnRect.height) {
                                            btn.style.width = '100%';
                                        }
                                    };
                                    
                                    window.addEventListener('resize', setBuyBlockPosition);
                                    setBuyBlockPosition();
                                })();
                            `
                        }} />
                    </div>
                </div>
                
                {/* Schedule Block */}
                {uniqueScheduleItems.length > 0 && (
                    <div className="event-item__schedule-block no-mobile">
                        <div className="schedule-block schedule-block--active" data-toggle-listen="">
                            <div className="schedule-block__header">
                                <div className="schedule-block__title">
                                    <svg className="schedule-block__time-logo icon icon-clock">
                                        <use xlinkHref="#svg-icon-clock"></use>
                                    </svg>
                                    <p className="schedule-block__text-header">المدة</p>
                                </div>
                                <div className="schedule-block__content-dropdown">
                                    <button type="button" className="schedule-block__more-details-btn" data-toggle-active-button="" data-toggle-class="schedule-block--active" data-toggle-scope="all">
                                        <span className="schedule-block__details">التفاصيل</span>
                                        <svg className="icon icon-arrowhead-down">
                                            <use xlinkHref="#svg-icon-arrowhead-down"></use>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            {eventData.schedule?.duration && (
                                <div className="schedule-block__additional-info">
                                    <p className="schedule-block__accordion-subheader">
                                        <span>المدة</span>
                                        <span>{eventData.schedule.duration}</span>
                                    </p>
                                </div>
                            )}
                            <div className="schedule-block__accordion-content">
                                <div className="schedule-block__horizontal-delimiter"></div>
                                <div className="schedule-block__wrapper">
                                    <div className="schedule-block__content">
                                        {uniqueScheduleItems.map((item, index) => (
                                            <div key={index} className="schedule-block__text">
                                                <div className="schedule-block__circle-block-no-date">
                                                    <svg className="schedule-block__circle icon icon-16-kit-point">
                                                        <use xlinkHref="#svg-icon-16-kit-point"></use>
                                                    </svg>
                                                </div>
                                                {index < uniqueScheduleItems.length - 1 && (
                                                    <div className="schedule-block__vertical-delimiter-no-date schedule-block__vertical-delimiter-no-date--not-subtitle"></div>
                                                )}
                                                <div className="schedule-block__accordion-content-item">
                                                    {item.time && (
                                                        <div className="schedule-block__left-part">
                                                            <p className="schedule-block__time">{item.time}</p>
                                                        </div>
                                                    )}
                                                    <div className="schedule-block__right-part">
                                                        <p className="schedule-block__point-name">{item.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Why Buy Block */}
                {uniqueWhyBuyReasons.length > 0 && (
                    <div className="why-buy-block why-buy-block--attraction-desktop no-mobile">
                        <div className="why-buy-block__header">ما الذي يميز منصة بلاتينوم لِست عن غيرها؟</div>
                        <div className="why-buy-block__reasons">
                            {uniqueWhyBuyReasons.map((reason, index) => (
                                <div key={index} className="why-buy-block__reasons-reason">
                                    <img className="why-buy-block__reasons-reason-image" src={reason.image} alt={reason.title} />
                                    <div className="why-buy-block__reasons-reason-description">
                                        <div className="why-buy-block__reasons-reason-description-header">{reason.title}</div>
                                        <span className="why-buy-block__reasons-reason-description-subheader">{reason.description}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {uniquePaymentOptions.length > 0 && (
                            <div className="why-buy-block__payment-options">
                                <div className="why-buy-block__payment-options-header">خيارات دفع متعددة</div>
                                <div className="why-buy-block__payment-options-payment-systems">
                                    {uniquePaymentOptions.map((option, index) => (
                                        <img key={index} className={option.class} src={option.src} alt={option.alt} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SideBar;