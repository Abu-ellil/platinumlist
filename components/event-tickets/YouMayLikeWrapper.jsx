'use client'

import React, { useState, useEffect } from 'react';
import YouMayLike from './YouMayLike';
import YouMayLikeMobile from './YouMayLikeMobile';

const YouMayLikeWrapper = ({ data }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 760);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    // During SSR and initial client render, don't render anything to prevent hydration mismatch
    if (!isClient) {
        return null;
    }

    return isMobile ? <YouMayLikeMobile data={data} /> : <YouMayLike data={data} />;
};

export default YouMayLikeWrapper; 