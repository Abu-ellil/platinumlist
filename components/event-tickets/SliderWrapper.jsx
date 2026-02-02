'use client'

import React, { useState, useEffect } from 'react';
import Slider from './Slider';
import SliderMobile from './SliderMobile';

const SliderWrapper = ({ sliderData }) => {
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
        return <div style={{ height: '450px' }}></div>;
    }

    return isMobile ? (
        <SliderMobile sliderData={sliderData} />
    ) : (
        <Slider sliderData={sliderData} />
    );
};

export default SliderWrapper; 