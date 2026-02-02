'use client'

import React, { useState, useEffect } from 'react';
import Nearby from './Nearby';
import NearbyMobile from './NearbyMobile';

const NearbyWrapper = ({ citiesData }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // Set isClient to true once component mounts on client
        setIsClient(true);
        
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 760);
        };

        // Check on mount
        checkScreenSize();

        // Add event listener for resize
        window.addEventListener('resize', checkScreenSize);

        // Cleanup
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Prevent hydration mismatch by not rendering until client-side
    if (!isClient) {
        return (
            <div className="section ">
                <div className="no-overflow">
                    <div className="container2 padded clearfix">
                        <div className="section__header">
                            <h2 className="section__title ">المدن القريبة مع الفعاليات المقامة حاليًا</h2>
                        </div>
                        <div className="section__content">
                            <div style={{ 
                                textAlign: 'center', 
                                padding: '2rem', 
                                color: '#666',
                                fontSize: '0.9rem'
                            }}>
                                جاري التحميل...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {isMobile ? (
                <NearbyMobile citiesData={citiesData} />
            ) : (
                <Nearby citiesData={citiesData} />
            )}
        </>
    );
};

export default NearbyWrapper; 