const ScrapedData = ({ cityData }) => {
    if (!cityData) return null;

    return (
        <div style={{ 
            padding: '20px', 
            margin: '20px', 
            border: '1px solid #ddd', 
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
        }}>
            <h2>بيانات {cityData.name} المستخرجة</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <h3>معلومات المدينة:</h3>
                <p><strong>الاسم:</strong> {cityData.name}</p>
                <p><strong>الرابط:</strong> {cityData.url}</p>
                <p><strong>تاريخ الاستخراج:</strong> {new Date().toLocaleString('ar-EG')}</p>
            </div>

            {cityData.events.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                    <h3>الفعاليات ({cityData.events.length}):</h3>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                        gap: '15px' 
                    }}>
                        {cityData.events.slice(0, 6).map((event, index) => (
                            <div key={index} style={{ 
                                border: '1px solid #ccc', 
                                padding: '10px', 
                                borderRadius: '5px',
                                backgroundColor: 'white'
                            }}>
                                {event.image && (
                                    <img 
                                        src={event.image} 
                                        alt={event.title}
                                        style={{ 
                                            width: '100%', 
                                            height: '150px', 
                                            objectFit: 'cover', 
                                            borderRadius: '5px',
                                            marginBottom: '10px'
                                        }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                )}
                                <h4 style={{ fontSize: '14px', margin: '5px 0' }}>{event.title}</h4>
                                {event.price && <p style={{ fontSize: '12px', color: '#666' }}>السعر: {event.price}</p>}
                                {event.date && <p style={{ fontSize: '12px', color: '#666' }}>التاريخ: {event.date}</p>}
                                {event.venue && <p style={{ fontSize: '12px', color: '#666' }}>المكان: {event.venue}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {cityData.categories.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                    <h3>الفئات ({cityData.categories.length}):</h3>
                    <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '10px' 
                    }}>
                        {cityData.categories.slice(0, 10).map((category, index) => (
                            <div key={index} style={{ 
                                border: '1px solid #ccc', 
                                padding: '8px 12px', 
                                borderRadius: '15px',
                                backgroundColor: 'white',
                                fontSize: '12px'
                            }}>
                                {category.name}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {cityData.sliderImages.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                    <h3>صور البانر ({cityData.sliderImages.length}):</h3>
                    <div style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        overflowX: 'auto',
                        padding: '10px 0'
                    }}>
                        {cityData.sliderImages.slice(0, 5).map((image, index) => (
                            <img 
                                key={index}
                                src={image.src} 
                                alt={image.alt}
                                style={{ 
                                    width: '200px', 
                                    height: '120px', 
                                    objectFit: 'cover', 
                                    borderRadius: '5px',
                                    flexShrink: 0
                                }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {cityData.featuredEvents.length > 0 && (
                <div>
                    <h3>الفعاليات المميزة ({cityData.featuredEvents.length}):</h3>
                    {cityData.featuredEvents.slice(0, 3).map((featured, index) => (
                        <div key={index} style={{ 
                            border: '1px solid #ccc', 
                            padding: '15px', 
                            marginBottom: '10px',
                            borderRadius: '5px',
                            backgroundColor: 'white'
                        }}>
                            <h4 style={{ fontSize: '16px', marginBottom: '10px' }}>{featured.title}</h4>
                            {featured.description && <p style={{ fontSize: '14px', color: '#666' }}>{featured.description}</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ScrapedData; 