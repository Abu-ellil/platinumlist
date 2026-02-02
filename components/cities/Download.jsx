const Download = () => {
    return (
        <div className="section your-platinumlist-app">
            <div className="container2 padded">
                <div className="your-platinumlist-app__wrapper">
                    <p className="your-platinumlist-app__title">تحميل التطبيق</p>
                    <p className="your-platinumlist-app__subtitle">قم بتحميل التطبيق واحصل على الكثير من المزايا الرائعة والعروض الحصرية المميزة</p>
                    <div className="your-platinumlist-app__featured mobile">
                        <div className="your-platinumlist-app__thumbs-up">
                            <svg className="icon icon-thumbs-up">
                                <use xlinkHref="#svg-icon-thumbs-up"></use>
                            </svg>
                        </div>
                        <p className="your-platinumlist-app__featured-text">ضمن قائمة التطبيقات المميزة على متجر Apple</p>
                    </div>
                    <div className="your-platinumlist-app__btns">
                        <a className="your-platinumlist-app__btn" target="_blank" href="https://app.adjust.com/112tm8c6" rel="noopener noreferrer">
                            <img src="https://cdn.platinumlist.net/dist/v799/img/b2c-app/app-store-transparent-ar.svg" alt="" />
                        </a>
                        <a className="your-platinumlist-app__btn" target="_blank" href="https://app.adjust.com/112tm8c6" rel="noopener noreferrer">
                            <img src="https://cdn.platinumlist.net/dist/v799/img/b2c-app/google-play-transparent-ar.svg" alt="" />
                        </a>
                    </div>
                    <img src="https://cdn.platinumlist.net/dist/v799/img/iphone.png" alt="" className="your-platinumlist-app__iphone" />
                </div>
            </div>
        </div>
    );
};

export default Download;