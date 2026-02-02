'use client';
import { useState } from 'react';

const RangeFilter = ({ selectedSeats, onRangeSelect, eventPricing }) => {
    const [selectedRange, setSelectedRange] = useState(null);

    console.log(eventPricing);
    // Get currency from event pricing
    const currency = eventPricing?.current?.pricing_currency || 'SAR';

    // Price ranges data - now dynamic based on event pricing
    const priceRanges = [
        {
            id: '6865caa7cfbd4',
            color: '#4EBAF7',
            price: eventPricing?.current?.silver_price || `200 ${currency}`,
            name: 'Silver'
        },
        {
            id: '6865caa7cfbd0',
            color: '#5c90f7',
            price: eventPricing?.current?.gold_price || `400 ${currency}`,
            name: 'Gold'
        },
        {
            id: '6865caa7cfbcc',
            color: '#7c71f2',
            price: eventPricing?.current?.platinum_price || `600 ${currency}`,
            name: 'Platinum'
        },
        {
            id: '6865caa7cfbd7',
            color: '#d678f5',
            price: eventPricing?.current?.diamond_price || `800 ${currency}`,
            name: 'Diamond'
        },
        {
            id: '6865caa7cfbc5',
            color: '#ef6565',
            price: eventPricing?.current?.vip_price || `1000 ${currency}`,
            name: 'VIP'
        }
    ].filter(range => {
        // Only show ranges that have pricing data
        if (eventPricing) {
            if (range.id === '6865caa7cfbd4') return eventPricing.current?.silver_price;
            if (range.id === '6865caa7cfbd0') return eventPricing.current?.gold_price;
            if (range.id === '6865caa7cfbcc') return eventPricing.current?.platinum_price;
            if (range.id === '6865caa7cfbd7') return eventPricing.current?.diamond_price;
            if (range.id === '6865caa7cfbc5') return eventPricing.current?.vip_price;
        }
        return true; // Show fallback ranges if no event pricing
    });

    const handleRangeClick = (rangeId, color) => {
        // Toggle selection
        setSelectedRange(prevRange => {
            const newRange = prevRange === rangeId ? null : rangeId;
            
            // Reset all sections opacity first
            document.querySelectorAll('[class*="range-6865"]').forEach(section => {
                section.style.transition = 'opacity 0.3s ease';
                if (newRange === null) {
                    // If deselecting, restore full opacity to all sections
                    section.style.opacity = '1';
                } else {
                    // If selecting, set all to half opacity initially
                    section.style.opacity = '0.5';
                }
            });

            if (newRange !== null) {
                // Find all sections with this range class and set them to full opacity
                document.querySelectorAll(`.range-${rangeId}`).forEach(section => {
                    section.style.opacity = '1';
                });

                // Get first section for scrolling (we only need to scroll to one)
                const firstSection = document.querySelector(`.range-${rangeId}`);
                if (firstSection) {
                    // Get the section's position
                    const rect = firstSection.getBoundingClientRect();
                    const scrollX = window.scrollX + rect.left - (window.innerWidth / 2) + (rect.width / 2);
                    const scrollY = window.scrollY + rect.top - (window.innerHeight / 2) + (rect.height / 2);

                    // Smooth scroll to the section
                    window.scrollTo({
                        left: scrollX,
                        top: scrollY,
                        behavior: 'smooth'
                    });
                }
            }

            if (onRangeSelect) {
                onRangeSelect(newRange);
            }

            return newRange;
        });
    };

    return (
        <div className="range-filter range-filter-mobile mobile range-filter-mobile-transparency ready" data-range-filter="">
            <div className="preview scrollable" data-scrollbar="" tabIndex="-1">
                <div className="scroll-bar vertical">
                    <div className="thumb"></div>
                </div>
                <div className="viewport" style={{ minHeight: '50px' }}>
                    <div className="overview" style={{overflowX: 'auto', width: '100vw'}}>
                        <ul className="preview-list preview-list-mobile">
                            {priceRanges.map((range) => (
                                <li key={range.id} className="list-item">
                                    <button
                                        className={`btn-range ${selectedRange === range.id ? 'selected' : ''}`}
                                        data-range={range.id}
                                        data-range-mobile=""
                                        data-color={range.color}
                                        onClick={() => handleRangeClick(range.id, range.color)}
                                        style={{
                                            border: selectedRange === range.id ? `1px solid ${range.color}` : 'none',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <span
                                            className="color"
                                            style={{ backgroundColor: range.color }}
                                        ></span>
                                        <span className="label">{range.price}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="scroll-bar horizontal">
                    <div className="thumb"></div>
                </div>
            </div>
        </div>
    );
};

export default RangeFilter; 