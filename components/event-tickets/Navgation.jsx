const Navgation = ({ navigationData }) => {
    // Default data structure - can be passed as props
    const defaultNavigationData = {
        breadcrumbs: [
            {
                text: "الصفحة الرئيسية",
                url: "https://antalya.platinumlist.net/ar/",
                isActive: false
            },
            {
                text: "الفعاليات والأماكن السياحية",
                url: "https://antalya.platinumlist.net/ar/attraction",
                isActive: false
            },
            {
                text: "المتاحف",
                url: "https://antalya.platinumlist.net/ar/attraction/museums",
                isActive: false
            },
            {
                text: "متحف أرض الرمال ساندلاند في أنطاليا",
                url: "",
                isActive: true
            }
        ],
        share: {
            buttonText: "مشاركة الفعالية",
            eventId: "93282",
            eventName: "Sand Art Museum - Sandland",
            shareUrl: "https://antalya.platinumlist.net/ar/event-tickets/sand-art-museum-sandland",
            options: [
                {
                    type: "facebook",
                    text: "المشاركة عبر فيسبوك",
                    icon: "icon-facebook"
                },
                {
                    type: "twitter",
                    text: "المشاركة على X",
                    icon: "icon-x-logo"
                },
                {
                    type: "copy-link",
                    text: "نسخ الرابط",
                    icon: "icon-copy-link"
                }
            ]
        },
        favorite: {
            id: "93282",
            entity: "event",
            label: "Event-page",
            addText: "إضافة إلى المفضلة",
            inFavoriteText: "المفضلة",
            status: "not-in" // or "in"
        }
    };

    // Use passed navigationData or fall back to default
    const data = navigationData || defaultNavigationData;

    return (
        <div className="no-mobile">
            <div className="container2 padded">
                <div className="breadcrumbs">
                    <ul className="breadcrumbs__list">
                        {data.breadcrumbs.map((breadcrumb, index) => (
                            <li key={index} className="breadcrumbs__item">
                                {breadcrumb.isActive ? (
                                    <span>{breadcrumb.text}</span>
                                ) : (
                                    <a className="breadcrumbs__item-link" href={breadcrumb.url}>
                                        {breadcrumb.text}
                                    </a>
                                )}
                                <svg className="icon icon-arrow-rounded">
                                    <use xlinkHref="#svg-icon-arrow-rounded"></use>
                                </svg>
                            </li>
                        ))}
                    </ul>
                    <div className="breadcrumbs__right-side">
                        <div className="breadcrumbs__share-button">
                            <div className="share-block-wrapper">
                                <div className="blur-unactive" data-toggle-listen="">
                                    <div 
                                        className="share-button" 
                                        data-share-button="" 
                                        data-toggle-active-button="" 
                                        data-toggle-class="active"
                                    >
                                        <svg className="icon icon-combined-shape">
                                            <use xlinkHref="#svg-icon-combined-shape"></use>
                                        </svg>
                                        <span className="share-button__text">{data.share.buttonText}</span>
                                    </div>
                                    <div className="share-body" style={{display: 'none'}}>
                                        {data.share.options.map((option, index) => (
                                            <a 
                                                key={index}
                                                className="share-body__link link" 
                                                href="javascript:void(0);" 
                                                data-share-social="" 
                                                data-share-button-facebook={option.type === 'facebook' ? '' : undefined}
                                                data-share-button-twitter={option.type === 'twitter' ? '' : undefined}
                                                data-copy-link={option.type === 'copy-link' ? '' : undefined}
                                                data-clipboard-text={option.type === 'copy-link' ? data.share.shareUrl : undefined}
                                                target="_blank"
                                                data-ga4-click-item={`{"event_name":"share_item","item":"event","type":"${option.type}","hierarchy":null,"id":"${data.share.eventId}","id_name":"${data.share.eventName}","interface_location":"page","status":null,"meta":null,"comment":null}`}
                                                rel="noopener noreferrer"
                                            >
                                                <span className={`share-body__icon share-body__icon--${option.type === 'twitter' ? 'x' : option.type}`}>
                                                    <svg className={`icon ${option.icon}`}>
                                                        <use xlinkHref={`#svg-${option.icon}`}></use>
                                                    </svg>
                                                </span>
                                                {option.type === 'copy-link' ? (
                                                    <span data-copy-link-text="">{option.text}</span>
                                                ) : (
                                                    option.text
                                                )}
                                            </a>
                                        ))}
                                        <input 
                                            type="text" 
                                            className="share-body__personal-link" 
                                            data-link-for-copy="" 
                                            readOnly 
                                            style={{display: 'none'}} 
                                            value={data.share.shareUrl}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="breadcrumbs__add-to-favorite">
                            <div className="favorite-block">
                                <a 
                                    href="javascript:void(0)" 
                                    className="favorite-block__main-favorite" 
                                    data-add-to-favorite="" 
                                    data-favorite-status={data.favorite.status} 
                                    data-favorite-id={data.favorite.id} 
                                    data-favorite-entity={data.favorite.entity} 
                                    data-favorite-label={data.favorite.label}
                                >
                                    <span className="favorite-block__btn favorite-block__btn--action-bar favorite-block__btn--not-favorite">
                                        <svg className="favorite-block__not-favorite-icon icon-heart-not-favourites favorite-heart icon icon-heart">
                                            <use xlinkHref="#svg-icon-heart"></use>
                                        </svg>
                                        <span>{data.favorite.addText}</span>
                                    </span>
                                    <span className="favorite-block__btn favorite-block__btn--action-bar favorite-block__btn--in-favorite">
                                        <svg className="favorite-block__in-favorite-icon icon-checkmark-in-favourites icon icon-checkmark">
                                            <use xlinkHref="#svg-icon-checkmark"></use>
                                        </svg>
                                        <span>{data.favorite.inFavoriteText}</span>
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navgation;