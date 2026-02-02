'use client'
import './style/header.css'
import { useEffect, useState } from 'react'

const Header = () => {
    const [currency, setCurrency] = useState('SAR');

    useEffect(() => {
        // Get currency based on city from subdomain
        if (typeof window !== 'undefined') {
            const hostname = window.location.hostname;
            const citySlug = hostname.split('.')[0]; // Extract subdomain as city
            
            // Map cities to their default currencies
            const cityToCurrency = {
                'cairo': 'EGP',
                'istanbul': 'TRY', 
                'riyadh': 'SAR',
                'jeddah': 'SAR',
                'khobar': 'SAR',
                'dubai': 'AED',
                'abu-dhabi': 'AED',
                'doha': 'QAR',
                'kuwait': 'KWD',
                'manama': 'BHD',
                'muscat': 'OMR'
            };
            
            setCurrency(cityToCurrency[citySlug] || 'SAR');
        }
    }, []);

    return (
        <div className="wrapper-loa">
            <div className="container-sl6 header-2re" style={{direction: 'rtl'}}>
                <div className="header-dj3"><img src="https://cdn.platinumlist.net/dist/v816/img/main/logo-template/pl-logo-desktop-ar.svg" className="logo-bos" /></div>
                <div className="container-593">
                    <div className="toggle-aoq"><button className="__localizationSwitcherToggle__k2ZmG4ZBc-wbo"><span className="item-bxo"><span className="item-x4y"><svg className="icon-16-kit-planet icon">
                        <use xlinkHref="#svg-icon-16-kit-planet"></use>
                    </svg></span> AR</span> <span className="__d-28w"><svg className="icon-divider icon">
                        <use xlinkHref="#svg-icon-divider"></use>
                    </svg></span> <span className="item-bxo">{currency}</span></button></div>
                </div>
            </div>
        </div>
    )
}
export default Header