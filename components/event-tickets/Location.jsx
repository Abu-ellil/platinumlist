const Location = ({ data }) => {

    console.log(data);
    // Handle loading and error states
    if (!data || data.error || !data.data) {
        return null; // Don't render if no valid data
    }

    const eventData = data.data;
    if (!eventData.location) {
        return null; // Don't render if no location data
    }

    return (
        <div className="event-item__location-block section section--item-page">
            <div className="section__header">
                <h2 className="section__title section__title--item-page">الموقع</h2>
            </div>
            <div className="section__content">
                <div className="location-block" data-location-block="">
                    <div className="location-block__item" data-location-block-item="">
                        <a 
                            href={eventData.google_maps_link || "javascript:void(0)"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="location-block__info"
                            data-ga4-click-item='{"event_name":"location_click","item":null,"type":null,"hierarchy":null,"id":null,"id_name":null,"interface_location":null,"status":null,"meta":null,"comment":null}'
                        >
                            <div className="location-block__aside-info" data-location-block-aside-default="">
                                <div className="location-block__aside-icon">
                                    <svg className="icon icon-location-marker">
                                        <use xlinkHref="#svg-icon-location-marker"></use>
                                    </svg>
                                </div>
                                <div className="location-block__aside-text">موقع الفعالية</div>
                                <div className="location-block__aside-sub-text">الموقع</div>
                            </div>
                            <div 
                                className="location-block__aside-info hidden"
                                data-location-block-aside={`{"latitude":null,"longitude":null}`}
                            >
                                <div className="location-block__aside-icon">
                                    <svg className="icon icon-car">
                                        <use xlinkHref="#svg-icon-car"></use>
                                    </svg>
                                </div>
                                <div className="location-block__aside-text" data-location-block-travel-time=""></div>
                                <div className="location-block__aside-sub-text">من موقعك</div>
                            </div>
                            <div className="location-block__main-info">
                                <div className="location-block__venue-name">{eventData.location.name}</div>
                                {eventData.location.address && (
                                    <div className="location-block__address">{eventData.location.address}</div>
                                )}
                            </div>
                        </a>
                    </div>
                    {eventData?.metadata?.map_image && (
                        <div className="location-block__google-map-container location-block__google-map-container--open" data-location-block-map="">
                            <picture>
                                <img 
                                    className="location-block__google-map-static-image lazyloaded" 
                                    alt={`خريطة موقع ${eventData.location.name}`}
                                    src={eventData?.metadata?.map_image}
                                />
                            </picture>
                        </div>
                    )}
                </div>
            </div>
            <div className="section__underline"></div>
        </div>
    );
};

export default Location;