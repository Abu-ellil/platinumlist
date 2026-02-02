import { useState, useRef, useEffect } from 'react';

const CountryField = ({ value, onChange, selectedCountryName, onCountrySelect, error }) => {
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);

    const countryOptions = [
        { id: '254', flag: 'ae', name: 'الامارات العربية المتحدة' },
        { id: '138', flag: 'lb', name: 'لبنان' },
        { id: '21', flag: 'bh', name: 'البحرين' },
        { id: '186', flag: 'om', name: 'سلطنة عمان' },
        { id: '215', flag: 'sa', name: 'المملكة العربية السعودية' },
        { id: '71', flag: 'eg', name: 'مصر' },
        { id: '201', flag: 'qa', name: 'قطر' },
        { id: '134', flag: 'kw', name: 'الكويت' },
        { id: '126', flag: 'jo', name: 'الأردن' },
        { id: '114', flag: 'ir', name: 'إيران' },
        { id: '115', flag: 'iq', name: 'العراق' },
        { id: '271', flag: 'ps', name: 'فلسطين' }
    ];

    // Handle clicks outside dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setShowCountryDropdown(false);
            }
        };

        if (showCountryDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showCountryDropdown]);

    const handleCountrySelect = (country) => {
        onCountrySelect(country.id, country.name);
        setShowCountryDropdown(false);
    };

    const handleButtonClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowCountryDropdown(!showCountryDropdown);
    };

    // Get button position for dropdown positioning
    const getDropdownPosition = () => {
        if (!buttonRef.current) return { top: 0, left: 0 };
        const rect = buttonRef.current.getBoundingClientRect();
        return {
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
            width: Math.max(rect.width, 320) // Minimum 320px width for mobile
        };
    };

    return (
        <>
            <div className={`pl-kit-form-country pl-kit-form-country--big ${error ? 'pl-kit-form-country--invalid' : ''}`} data-validate-container="">
                <div className="pl-kit-form-country__content" data-pl-kit-form-country-content="">
                    <div className="pl-kit-form-country__name">
                        <input type="hidden" data-pl-kit-country-input-hidden="" name="id_country" value={value} />
                        <label className="pl-kit-form-country__view">
                            <input 
                                type="text" 
                                data-pl-kit-form-country="" 
                                tabIndex="-1" 
                                value={selectedCountryName}
                                className="pl-kit-form-country__input" 
                                placeholder=" " 
                                data-pl-kit-country-input="" 
                                readOnly
                                id="Form_QuickOrder_StepTwo-id_country"
                            />
                        </label>
                    </div>
                    <div className="pl-kit-form-country__country-list">
                        <button 
                            ref={buttonRef}
                            className="pl-kit-form-country-list pl-kit-form-country-list--big" 
                            type="button"
                            onClick={handleButtonClick}
                        >
                            <svg className="icon-24-kit-arrowhead-down pl-kit-form-country-list__arrow icon">
                                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    <label htmlFor="Form_QuickOrder_StepTwo-id_country" className="pl-kit-form-country__label required">
                        بلد الهوية
                    </label>
                </div>
                {error && (
                    <ul data-validate-messages="" className="pl-kit-form-country__errors">
                        <li>{error}</li>
                    </ul>
                )}
            </div>

            {/* Fixed positioned dropdown */}
            {showCountryDropdown && (
                <div 
                    ref={dropdownRef}
                    style={{
                        position: 'fixed',
                        top: getDropdownPosition().top + 'px',
                        left: getDropdownPosition().left + 'px',
                        width: getDropdownPosition().width + 'px',
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        zIndex: 9999,
                        maxHeight: '300px',
                        overflowY: 'auto'
                    }}
                >
                    {countryOptions.map(country => (
                        <button
                            key={country.id}
                            type="button"
                            onClick={() => handleCountrySelect(country)}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: 'none',
                                backgroundColor: 'white',
                                textAlign: 'right',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                gap: '12px',
                                direction: 'rtl',
                                borderBottom: '1px solid #eee'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                        >
                            <img 
                                src={`https://cdn.platinumlist.net/dist/v800/img/flags/4x3/${country.flag}.svg`} 
                                alt="flag" 
                                style={{ width: '24px', height: '18px' }}
                            />
                            <span>{country.name}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Overlay to close dropdown */}
            {showCountryDropdown && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 9998,
                        backgroundColor: 'transparent'
                    }}
                    onClick={() => setShowCountryDropdown(false)}
                />
            )}
        </>
    );
};

export default CountryField; 