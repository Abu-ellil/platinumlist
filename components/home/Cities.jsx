'use client'
import Link from 'next/link';
import { useState, useEffect } from 'react';

const Cities = () => {
    const [citiesData, setCitiesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [sectionTitle, setSectionTitle] = useState('اختر مدينتك');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMorePages, setHasMorePages] = useState(true);

    // Fetch cities data from API
    useEffect(() => {
        const fetchCities = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/home');
                const result = await response.json();

                if (result.success) {
                    setCitiesData(result.data.cities);
                    setSectionTitle(result.data.sectionTitle || 'اختر مدينتك');
                } else {
                    throw new Error(result.error || 'Failed to fetch cities');
                }
            } catch (err) {
                console.error('Error fetching cities:', err);
                setError(err.message);
                // Fallback to default cities if API fails
                setCitiesData([
                    {
                        id: 'cairo',
                        name: 'القاهرة',
                        href: '/cairo',
                        image: 'https://cdn.platinumlist.net/upload/city/368_upload6495b8538b7a1_1687533651-01687533656.jpeg',
                        flag: 'https://cdn.platinumlist.net/dist/v799/img/flags/4x3/eg.svg',
                        flagAlt: 'Egypt'
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchCities();
    }, []);

    // Load more cities using Puppeteer to click the button
    const handleLoadMore = async (e) => {
        e.preventDefault();
        if (loadingMore || !hasMorePages) return;
        
        try {
            setLoadingMore(true);
            const nextPage = currentPage + 1;
            
            const response = await fetch(`/api/home/load-more?page=${nextPage}`);
            const result = await response.json();
            
            if (result.success && result.data.html) {
                // Use raw HTML and append it to the container
                const container = document.querySelector('.world-wide-city__card-container');
                if (container && result.data.html) {
                    // Create a temporary div to parse the HTML
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = result.data.html;
                    
                    // Process the HTML to fix URLs and image attributes
                    const allLinks = tempDiv.querySelectorAll('.world-wide-city__link');
                    allLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href) {
                            link.setAttribute('href', href.replace('platinumlist.net/ar', 'plateniemlist.net'));
                        }
                    });
                    
                    // Fix image src/data-src attributes - swap them so actual image shows
                    const allImages = tempDiv.querySelectorAll('img.world-wide-city__image');
                    allImages.forEach(img => {
                        const dataSrc = img.getAttribute('data-src');
                        if (dataSrc) {
                            // Set src to the actual image URL so it shows immediately
                            img.setAttribute('src', dataSrc);
                            // Set data-src to placeholder for consistency
                            img.setAttribute('data-src', 'data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%20558%20324\'%20width=\'558\'%20height=\'324\'%3E%3C/svg%3E');
                        }
                    });
                    
                    // Extract city cards from the processed HTML
                    const newCityCards = tempDiv.querySelectorAll('.world-wide-city__card-wrap');
                    
                    if (newCityCards.length > 0) {
                        // Append each new city card to the container
                        newCityCards.forEach(card => {
                            container.appendChild(card.cloneNode(true));
                        });
                        
                        setCurrentPage(nextPage);
                        
                        // Update the state with parsed cities for tracking
                        const newCities = [];
                        newCityCards.forEach((card, index) => {
                            const cityLink = card.querySelector('.world-wide-city__link');
                            const cityName = card.querySelector('.world-wide-city__name').textContent.trim();
                            const cityHref = cityLink?.getAttribute('href');
                            
                                                         if (cityHref && cityName) {
                                const cityId = cityHref.match(/https?:\/\/([^.]+)\.plateniemlist\.net/)?.[1] || cityHref.match(/https?:\/\/([^.]+)\.platinumlist\.net/)?.[1];
                                if (cityId) {
                                    newCities.push({
                                        id: cityId,
                                        name: cityName,
                                        href: cityHref
                                    });
                                }
                            }
                        });
                        
                        if (newCities.length > 0) {
                            setCitiesData(prev => [...prev, ...newCities]);
                        }
                    } else {
                        setHasMorePages(false);
                    }
                } else {
                    setHasMorePages(false);
                }
            } else {
                setHasMorePages(false);
            }
        } catch (err) {
            console.error('Error loading more cities:', err);
        } finally {
            setLoadingMore(false);
        }
    };

    return (
        <section className="world-wide-city">
            <div className="container2 padded world-wide-city__container">
                <p className="world-wide-city__title">{sectionTitle}</p>
                <div className="world-wide-city__card-container">
                    {citiesData.map((city) => (
                        <div key={city.id} className="world-wide-city__card-wrap">
                            <div className="world-wide-city__card">
                                <Link href={city.href} className="world-wide-city__link">
                                    <picture>
                                        <img 
                                            className="world-wide-city__image ls-is-cached lazyloaded" 
                                            title={city.name} 
                                            alt={city.name} 
                                            data-src={city.image} 
                                            src={city.image} 
                                        />
                                    </picture>
                                </Link>
                                <Link href={city.href} className="world-wide-city__name">
                                    <span className="flag-circle">
                                        <img 
                                            src={city.flag} 
                                            alt={city.flagAlt} 
                                            className="world-wide-city__name-flag" 
                                        />
                                    </span>
                                    {city.name}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="world-wide-wrap" data-city-grid="">
                    {!loading && hasMorePages && (
                        <button 
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="show-more-btn show-more__btn btn btn--outline-blue" 
                            data-ajax-block='{"method":"GET","mode":"replace","target":"[data-city-grid]"}'
                        >
                            {loadingMore ? 'جاري التحميل...' : 'أظهر المزيد'}
                        </button>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Cities;