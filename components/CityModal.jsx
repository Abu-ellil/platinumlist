'use client'

import React, { useState, useEffect } from 'react';

const CityModal = ({ isOpen, onClose, citySlug }) => {
    const [citiesHtml, setCitiesHtml] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Handle search functionality
    const handleSearch = (searchTerm) => {
        const cityItems = document.querySelectorAll('.city-switcher__city-list li');
        const countryItems = document.querySelectorAll('.city-switcher__item');
        
        if (!searchTerm) {
            // Show all items
            cityItems.forEach(item => item.style.display = 'block');
            countryItems.forEach(item => item.style.display = 'block');
            return;
        }

        // Hide all country sections first
        countryItems.forEach(item => item.style.display = 'none');

        cityItems.forEach(item => {
            const cityName = item.querySelector('.city-switcher__city-name');
            if (cityName && cityName.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
                item.style.display = 'block';
                // Show the parent country section
                const parentCountry = item.closest('.city-switcher__item');
                if (parentCountry) {
                    parentCountry.style.display = 'block';
                }
            } else {
                item.style.display = 'none';
            }
        });
    };

    // Handle backdrop click
    const handleModalClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const fetchCitiesData = async () => {
        if (!isOpen || !citySlug) return;
        
        setIsLoading(true);
        try {
            const response = await fetch(`/api/cities?city=${citySlug}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.data.html) {
                setCitiesHtml(data.data.html);
            } else {
                console.error('API returned error:', data.error || 'Unknown error');
                setCitiesHtml('<div style="text-align: center; padding: 20px;">خطأ في تحميل المدن</div>');
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
            setCitiesHtml('<div style="text-align: center; padding: 20px;">خطأ في الاتصال بالخادم</div>');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchCitiesData();
        }
    }, [isOpen, citySlug]);

    useEffect(() => {
        if (isOpen) {
            // Store original overflow value and prevent body scroll
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            // Add escape key listener
            const handleEscapeKey = (e) => {
                if (e.key === 'Escape') {
                    onClose();
                }
            };
            document.addEventListener('keydown', handleEscapeKey);

            // Cleanup function
            return () => {
                document.body.style.overflow = originalOverflow;
                document.removeEventListener('keydown', handleEscapeKey);
            };
        }
    }, [isOpen, onClose]);

    // Set up search functionality and fix hrefs after content loads
    useEffect(() => {
        if (citiesHtml && !isLoading) {
            // Wait a bit for DOM to be ready
            setTimeout(() => {
                // Fix all city links to use relative paths
                const cityLinks = document.querySelectorAll('.city-switcher__city-name');
                cityLinks.forEach(link => {
                    const href = link.getAttribute('href').replaceAll('platinumlist.net', 'plateniemlist.net');
                    link.setAttribute('href', href);
                });

                // Set up search functionality
                const searchInput = document.querySelector('.city-switcher__input');
                if (searchInput) {
                    const handleSearchInput = (e) => {
                        handleSearch(e.target.value);
                    };

                    searchInput.addEventListener('input', handleSearchInput);
                    searchInput.addEventListener('keyup', handleSearchInput);

                    // Cleanup
                    return () => {
                        searchInput.removeEventListener('input', handleSearchInput);
                        searchInput.removeEventListener('keyup', handleSearchInput);
                    };
                }
            }, 100);
        }
    }, [citiesHtml, isLoading]);

    if (!isOpen) return null;

    return (
        <div 
            className="modal fade mobile-swipe user-menu-settings-popup location in" 
            id="modal" 
            tabIndex="-1" 
            role="dialog" 
            aria-hidden="false" 
            onClick={handleModalClick}
            style={{ 
                touchAction: 'pan-x', 
                userSelect: 'none', 
                WebkitUserDrag: 'none', 
                WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', 
                display: 'block', 
                paddingRight: '15px',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 1050,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                direction: 'rtl'
            }}
        >
            <div 
                className="modal-dialog mobile-swipe user-menu-settings-popup location__modal-dialog"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content mobile-swipe user-menu-settings-popup location__modal-content">
                    <div className="modal-body mobile-swipe user-menu-settings-popup location__modal-body" data-modal-body="">
                        {isLoading ? (
                            <div className="popup-content">
                                <div className="popup-content__head mobile">
                                    <div className="popup-content__title">اختر المدينة</div>
                                    <a className="popup-content__close" href="javascript:void(0)" data-dismiss="modal" onClick={onClose}>إغلاق</a>
                                </div>
                                <div className="popup-content__body">
                                    <div className="city-switcher">
                                        <div className="city-switcher__search-wrapper clearfix">
                                            <div className="city-switcher__search">
                                                <svg className="icon icon-search">
                                                    <use xlinkHref="#svg-icon-search"></use>
                                                </svg>
                                                <input 
                                                    type="text" 
                                                    className="city-switcher__input" 
                                                    data-city-search-input=""
                                                    placeholder="ابحث عن المدينة"
                                                    onChange={(e) => handleSearch(e.target.value)}
                                                    onKeyUp={(e) => handleSearch(e.target.value)}
                                                />
                                                <span className="city-switcher__geolocation mobile" title="Find the nearest accessible city" data-city-switcher-geolocation="">
                                                    <svg className="icon icon-24-kit-geolocation">
                                                        <use xlinkHref="#svg-icon-24-kit-geolocation"></use>
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                        <ul id="city-item-list" className="city-switcher__list">
                                            <li style={{ textAlign: 'center', padding: '20px' }}>جاري التحميل...</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div 
                                dangerouslySetInnerHTML={{ __html: citiesHtml }}
                                onClick={(e) => {
                                    // Handle close button clicks in the injected HTML
                                    if (e.target.classList.contains('popup-content__close') || 
                                        e.target.closest('.popup-content__close') ||
                                        e.target.getAttribute('data-dismiss') === 'modal') {
                                        onClose();
                                        return;
                                    }

                                    // Handle city link clicks
                                    const cityLink = e.target.closest('.city-switcher__city-name');
                                    if (cityLink && cityLink.href) {
                                        // Links are already fixed to relative paths
                                        onClose();
                                        // Let the default navigation work
                                    }
                                }}
                            />
                        )}
                    </div>
                    <a 
                        href="javascript:void(0)" 
                        data-dismiss="modal"
                        onClick={onClose}
                        className="modal-close mobile-swipe user-menu-settings-popup location__modal-close"
                    >
                        <svg className="icon icon-close-thin">
                            <use xlinkHref="#svg-icon-close-thin"></use>
                        </svg>
                    </a>
                    <div 
                        className="modal-loader mobile-swipe user-menu-settings-popup location__modal-loader" 
                        data-modal-loader="" 
                        style={{ display: isLoading ? 'block' : 'none' }}
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            xmlnsXlink="http://www.w3.org/1999/xlink" 
                            style={{ margin: 'auto', display: 'block' }} 
                            width="50" 
                            height="50" 
                            viewBox="0 0 100 100" 
                            preserveAspectRatio="xMidYMid"
                        >
                            <circle cx="50" cy="50" r="30" stroke="#eeeeee" strokeWidth="10" fill="none"></circle>
                            <circle cx="50" cy="50" r="30" stroke="#37a7f8" strokeWidth="8" strokeLinecap="round" fill="none">
                                <animateTransform 
                                    attributeName="transform" 
                                    type="rotate" 
                                    repeatCount="indefinite" 
                                    dur="1s" 
                                    values="0 50 50;180 50 50;720 50 50" 
                                    keyTimes="0;0.5;1"
                                ></animateTransform>
                                <animate 
                                    attributeName="stroke-dasharray" 
                                    repeatCount="indefinite" 
                                    dur="1s" 
                                    values="18.84955592153876 169.64600329384882;94.2477796076938 94.24777960769377;18.84955592153876 169.64600329384882" 
                                    keyTimes="0;0.5;1"
                                ></animate>
                            </circle>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CityModal; 