const Categories = () => {
    // Categories data array
    const categoriesData = [
        {
            id: 1,
            name: "دليل الفعاليات العربية",
            href: "https://riyadh.platinumlist.net/ar/arabic"
        },
        {
            id: 2,
            name: "حفلات غنائية",
            href: "https://riyadh.platinumlist.net/ar/vocallyconcerts"
        },
        {
            id: 3,
            name: "الحفلات الموسيقية",
            href: "https://riyadh.platinumlist.net/ar/concert"
        },
        {
            id: 4,
            name: "السهرات الليلية",
            href: "https://riyadh.platinumlist.net/ar/nightlife"
        },
        {
            id: 5,
            name: "فعاليات الصحة واللياقة",
            href: "https://riyadh.platinumlist.net/ar/health-and-wellness"
        },
        {
            id: 6,
            name: "الألعاب والرياضات الإلكترونية",
            href: "https://riyadh.platinumlist.net/ar/gaming"
        },
        {
            id: 7,
            name: "دور السينما",
            href: "https://riyadh.platinumlist.net/ar/cinema"
        },
        {
            id: 8,
            name: "التجارب المشوّقة",
            href: "https://riyadh.platinumlist.net/ar/attraction/experiences"
        },
        {
            id: 9,
            name: "التجارب المضافة حديثًا",
            href: "https://riyadh.platinumlist.net/ar/attraction/recently-added"
        },
        {
            id: 10,
            name: "المؤتمرات",
            href: "https://riyadh.platinumlist.net/ar/business-conferences"
        },
        {
            id: 11,
            name: "الملتقيات",
            href: "https://riyadh.platinumlist.net/ar/business-conventions"
        },
        {
            id: 12,
            name: "فعاليات قطاع الأعمال",
            href: "https://riyadh.platinumlist.net/ar/business-events"
        },
        {
            id: 13,
            name: "المهرجانات",
            href: "https://riyadh.platinumlist.net/ar/festival"
        },
        {
            id: 14,
            name: "AFT_r Concerts",
            href: "https://riyadh.platinumlist.net/ar/aft_r"
        },
        {
            id: 15,
            name: "المعارض",
            href: "https://riyadh.platinumlist.net/ar/business-exhibitions"
        },
        {
            id: 16,
            name: "أفضل الأماكن السياحية تقييمًا",
            href: "https://riyadh.platinumlist.net/ar/attraction/attractions"
        },
        {
            id: 17,
            name: "المتاحف",
            href: "https://riyadh.platinumlist.net/ar/attraction/museums"
        },
        {
            id: 18,
            name: "الجولات والمعالم السياحية",
            href: "https://riyadh.platinumlist.net/ar/attraction/sightseeing-and-tours"
        },
        {
            id: 19,
            name: "أنشطة في الهواء الطلق",
            href: "https://riyadh.platinumlist.net/ar/attraction/outdoor"
        },
        {
            id: 20,
            name: "الفعاليات الرياضية",
            href: "https://riyadh.platinumlist.net/ar/sport"
        },
        {
            id: 21,
            name: "العروض المميزة للمعالم السياحية",
            href: "https://riyadh.platinumlist.net/ar/attraction/special-offers"
        },
        {
            id: 22,
            name: "الوجهات السياحية والمعالم التاريخية",
            href: "https://riyadh.platinumlist.net/ar/attraction/landmarks-and-monuments"
        },
        {
            id: 23,
            name: "أماكن مناسبة لالتقاط صور للإنستغرام",
            href: "https://riyadh.platinumlist.net/ar/instagrammable-places-and-photography-spots"
        }
    ];

    // Function to render a single category item
    const renderCategoryItem = (category) => (
        <li key={category.id} className="other-links__item">
            <a className="other-links__btn" href={category.href}>
                {category.name}
            </a>
        </li>
    );

    return (
        <div className="section other-links">
            <div className="container2 padded">
                <h2 className="other-links__title">الفئات الأخرى</h2>
                <ul className="other-links__list">
                    {categoriesData.map(category => renderCategoryItem(category))}
                </ul>
            </div>
        </div>
    );
};

export default Categories;