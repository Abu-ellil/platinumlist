'use client'

import React, { useState, useEffect } from 'react';
import Header from './Header';
import HeaderMobile from './HeaderMobile';

const HeaderWrapper = ({ navigationData, cityData, currentCityName }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 760);
        };

        // Initial check
        checkScreenSize();
        setIsLoading(false);

        // Add event listener for window resize
        window.addEventListener('resize', checkScreenSize);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    // Show loading state during initial client-side hydration
    if (isLoading) {
        return <div style={{ height: '80px' }}></div>;
    }

    // Extract citySlug from cityData
    const citySlug = cityData?.data?.slug || 'riyadh';
    const extractedCurrentCityName = currentCityName || cityData?.data?.currentCityName || 'الرياض';
    const extractedNavigationData = navigationData || cityData?.data?.headerNavigation || { mainLinks: [], dropdowns: {} };

    return isMobile ? (
        <HeaderMobile 
            navigationData={extractedNavigationData} 
            cityData={cityData} 
            currentCityName={extractedCurrentCityName} 
        />
    ) : (
        <Header 
            navigationData={extractedNavigationData} 
            citySlug={citySlug} 
            currentCityName={extractedCurrentCityName} 
        />
    );
};

export default HeaderWrapper; 