import { useState, useRef, useEffect } from 'react';

const PhoneField = ({ value, onChange, countryCode, onCountryCodeChange, error }) => {
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);

    const countryOptions = [
        { id: '254', flag: 'ae', code: '+971', name: 'الامارات العربية المتحدة' },
        { id: '138', flag: 'lb', code: '+961', name: 'لبنان' },
        { id: '21', flag: 'bh', code: '+973', name: 'البحرين' },
        { id: '186', flag: 'om', code: '+968', name: 'سلطنة عمان' },
        { id: '215', flag: 'sa', code: '+966', name: 'المملكة العربية السعودية' },
        { id: '71', flag: 'eg', code: '+20', name: 'مصر' },
        { id: '201', flag: 'qa', code: '+974', name: 'قطر' },
        { id: '134', flag: 'kw', code: '+965', name: 'الكويت' },
        { id: '126', flag: 'jo', code: '+962', name: 'الأردن' },
        { id: '114', flag: 'ir', code: '+98', name: 'إيران' },
        { id: '115', flag: 'iq', code: '+964', name: 'العراق' },
        { id: '271', flag: 'ps', code: '+970', name: 'فلسطين' },
        { id: '146', flag: 'ma', code: '+212', name: 'المغرب' },
        { id: '4', flag: 'dz', code: '+213', name: 'الجزائر' },
        { id: '246', flag: 'tn', code: '+216', name: 'تونس' },
        { id: '139', flag: 'ly', code: '+218', name: 'ليبيا' },
        { id: '228', flag: 'sd', code: '+249', name: 'السودان' },
        { id: '231', flag: 'sy', code: '+963', name: 'سوريا' },
        { id: '265', flag: 'ye', code: '+967', name: 'اليمن' },
        { id: '49', flag: 'so', code: '+252', name: 'الصومال' },
        { id: '47', flag: 'dj', code: '+253', name: 'جيبوتي' },
        { id: '1', flag: 'km', code: '+269', name: 'جزر القمر' }
    ];

    const selectedCountry = countryOptions.find(country => country.code === countryCode) || countryOptions[0];

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

    // Only allow numbers in phone input
    const handlePhoneChange = (e) => {
        const numericValue = e.target.value.replace(/[^0-9]/g, '');
        onChange(numericValue);
    };

    const handleCountrySelect = (country) => {
        onCountryCodeChange(country.code);
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
            <div className={`pl-kit-form-phone pl-kit-form-phone--big ${error ? 'pl-kit-form-phone--invalid' : ''}`} data-validate-container="">
                <div className="pl-kit-form-phone__content" data-pl-kit-form-phone-content="">
                    <div className="pl-kit-form-phone__country-code">
                        <button 
                            ref={buttonRef}
                            type="button" 
                            className="pl-kit-form-country-code pl-kit-form-country-code--big"
                            onClick={handleButtonClick}
                        >
                            <img 
                                src={`https://cdn.platinumlist.net/dist/v800/img/flags/4x3/${selectedCountry.flag}.svg`} 
                                alt="flag" 
                                className="pl-kit-form-country-code__flag" 
                            />
                            <span style={{ margin: '0 8px' }}>{selectedCountry.code}</span>
                            <svg className="icon-16-kit-arrowhead-down-short pl-kit-form-country-code__arrow icon">
                                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    <div className="pl-kit-form-phone__number">
                        <input type="hidden" data-pl-kit-phone-input-hidden="" name="phone" value={`${countryCode}${value}`} />
                        <input 
                            type="tel" 
                            data-pl-kit-form-phone="" 
                            value={value}
                            onChange={handlePhoneChange}
                            className="pl-kit-form-phone__input" 
                            placeholder=" " 
                            data-pl-kit-phone-input=""
                            id="Form_QuickOrder_StepTwo-phone"
                        />
                        <span className="pl-kit-form-phone__plus">+</span>
                    </div>
                    <label htmlFor="Form_QuickOrder_StepTwo-phone" className="pl-kit-form-phone__label required">
                        الهاتف
                    </label>
                </div>
                {error && (
                    <ul data-validate-messages="" className="pl-kit-form-phone__errors">
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
                        maxHeight: '200px',
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
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                borderBottom: '1px solid #eee'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                        >
                            <img 
                                src={`https://cdn.platinumlist.net/dist/v800/img/flags/4x3/${country.flag}.svg`} 
                                alt="flag" 
                                style={{ width: '20px', height: '15px' }}
                            />
                            <span style={{ fontWeight: '500' }}>{country.code}</span>
                            <span style={{ fontSize: '12px', color: '#666' }}>{country.name}</span>
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

export default PhoneField; 