'use client';
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import './style/hall-new.css'
import TicketFooter from './TicketFooter';
import RangeFilter from './RangeFilter';

const Hall = ({ onSeatSelect }) => {
    const [svgContent, setSvgContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
    const eventPricing = useRef(null);
    const hallContainerRef = useRef(null);
    const svgRef = useRef(null);
    const pathname = usePathname();

    // UI state
    const [isDragging, setIsDragging] = useState(false);

    // Refs for vanilla JS manipulation
    const isDraggingRef = useRef(false);
    const dragStartRef = useRef({ x: 0, y: 0 });

    // Timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) {
                    clearInterval(timer);
                    // Optionally handle timer expiration (e.g., redirect or show message)
                    alert('Time expired! Please start over.');
                    window.location.href = '/';
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Format time function
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Fetch event pricing data
    useEffect(() => {
        const fetchEventPricing = async () => {
            try {
                // Get city from subdomain
                const hostname = window.location.hostname;
                const citySlug = hostname.split('.')[0]; // Extract subdomain as city
                
                // Extract event slug from pathname
                const pathParts = pathname.split('/');
                const ticketsIndex = pathParts.findIndex(part => part === 'tickets');
                if (ticketsIndex !== -1 && ticketsIndex + 1 < pathParts.length) {
                    const eventSlug = pathParts.slice(ticketsIndex + 1).join('/');
                    console.log('Fetching pricing for city:', citySlug, 'event slug:', eventSlug);
                    
                    const response = await fetch(`/api/events?slug=${encodeURIComponent(eventSlug)}&city=${encodeURIComponent(citySlug)}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.success && data.data) {
                            eventPricing.current = data.data.pricing;
                            console.log('Fetched event pricing:', data.data.pricing);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching event pricing:', error);
            }
        };

        fetchEventPricing();
    }, [pathname]);

    // Fetch SVG content from public/hall.svg
    useEffect(() => {
        const loadHallSvg = async () => {
            try {
                setLoading(true);
                const response = await fetch('/hall.svg');
                if (!response.ok) {
                    throw new Error('Failed to load hall SVG');
                }
                const svgText = await response.text();
                setSvgContent(svgText);
            } catch (error) {
                console.error('Error loading hall SVG:', error);
                setSvgContent('<svg><text x="50%" y="50%" text-anchor="middle">Failed to load hall map</text></svg>');
            } finally {
                setLoading(false);
            }
        };

        loadHallSvg();
    }, []);



    // Setup SVG and event listeners with pure vanilla JS
    useEffect(() => {
        if (!svgContent || !hallContainerRef.current) return;

        // Insert SVG content manually without React
        hallContainerRef.current.innerHTML = svgContent;

        const svgElement = hallContainerRef.current.querySelector('svg');
        if (!svgElement) return;

        svgRef.current = svgElement;

        // Get the container group that has the transform
        const containerGroup = svgElement.querySelector('g.container.seats-are-visible');
        if (!containerGroup) return;

        if (window.innerWidth < 700) {
            containerGroup.setAttribute('transform', 'translate(-120.8465966796876, 102.50242431640618) scale(0.5120000000000001)')
        }
                // Get initial transform values and set up
        const initializeTransform = () => {
            const current = getCurrentTransform();
            
            // Update zoom display directly without React state
            const zoomDisplay = document.querySelector('.zoom-info');
            if (zoomDisplay) {
                zoomDisplay.textContent = `Zoom: ${Math.round(current.scale * 100)}%`;
            }
        };

        // Make only 40% of seats available
        const makeSeatsUnavailable = () => {
            const allAvailableSeats = svgElement.querySelectorAll('path.s.available');
            const totalSeats = allAvailableSeats.length;
            const seatsToKeepAvailable = Math.floor(totalSeats * 0.5); // Keep 40% available
            
            // Convert NodeList to array and shuffle it
            const shuffledSeats = Array.from(allAvailableSeats).sort(() => Math.random() - 0.5);
            
            // Remove 'available' class from 60% of seats (make them unavailable)
            for (let i = seatsToKeepAvailable; i < shuffledSeats.length; i++) {
                shuffledSeats[i].classList.remove('available');
            }
            
        };

        // Initialize with current values and update seat availability
        setTimeout(() => {
            initializeTransform();
            makeSeatsUnavailable();
        }, 100);

        // Add click handlers for seats and interactive elements
        const handleSvgClick = (event) => {
            if (isDraggingRef.current) return; // Don't select seats while dragging

            const target = event.target;

            // Check if clicked element is a seat (path with seat classes) and is available
            if (target.tagName === 'path' &&
                (target.classList.contains('s') || target.classList.contains('seat')) &&
                target.classList.contains('available')) {
                // Check if element already has a unique ID stored
                let seatId = target.getAttribute('data-seat-id');

                if (!seatId) {
                    // Create unique seat ID using DOM position as fallback
                    const row = target.getAttribute('r') || '';
                    const position = target.getAttribute('p') || target.getAttribute('sp') || '';
                    const rowPosition = target.getAttribute('rp') || '';

                    // Get all path elements to find index
                    const allPaths = svgElement.querySelectorAll('path.s');
                    const pathIndex = Array.from(allPaths).indexOf(target);

                    seatId = target.getAttribute('id') ||
                        `${row}-${position}-${rowPosition}-${pathIndex}`;

                    // Store the unique seatId on the element
                    target.setAttribute('data-seat-id', seatId);
                }
                handleSeatClick(seatId, target);
            } else if (target.tagName === 'path' &&
                (target.classList.contains('s') || target.classList.contains('seat')) &&
                !target.classList.contains('available')) {
                // Seat is not available
            }
        };

        // Mouse wheel zoom
        const handleWheel = (event) => {
            event.preventDefault();
            const delta = event.deltaY > 0 ? 0.9 : 1.1;

            // Get current values from SVG
            const current = getCurrentTransform();
            const newScale = Math.max(0.1, Math.min(3, current.scale * delta));
            const scaleFactor = newScale / current.scale;

            // Zoom towards mouse position
            const rect = hallContainerRef.current.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            const newX = mouseX - (mouseX - current.x) * scaleFactor;
            const newY = mouseY - (mouseY - current.y) * scaleFactor;

            // Update SVG directly
            updateSVGTransform(newX, newY, newScale);
        };

        // Mouse drag start
        const handleMouseDown = (event) => {
            isDraggingRef.current = true;
            setIsDragging(true);

            // Get current SVG values
            const current = getCurrentTransform();
            dragStartRef.current = {
                x: event.clientX - current.x,
                y: event.clientY - current.y
            };
        };

        // Mouse drag
        const handleMouseMove = (event) => {
            if (!isDraggingRef.current) return;

            // Get current scale from SVG
            const current = getCurrentTransform();
            const newX = event.clientX - dragStartRef.current.x;
            const newY = event.clientY - dragStartRef.current.y;

            // Update SVG directly
            updateSVGTransform(newX, newY, current.scale);
        };

        // Mouse drag end
        const handleMouseUp = () => {
            isDraggingRef.current = false;
            setIsDragging(false);
        };

        // Touch events for mobile
        let initialDistance = 0;
        let initialScale = 1;

        const handleTouchStart = (event) => {
            if (event.touches.length === 1) {
                // Single touch for dragging
                const touch = event.touches[0];
                isDraggingRef.current = true;
                setIsDragging(true);

                // Get current SVG values
                const current = getCurrentTransform();
                dragStartRef.current = {
                    x: touch.clientX - current.x,
                    y: touch.clientY - current.y
                };
            } else if (event.touches.length === 2) {
                // Two finger pinch for zooming
                event.preventDefault();
                isDraggingRef.current = false;
                setIsDragging(false);
                const touch1 = event.touches[0];
                const touch2 = event.touches[1];
                initialDistance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );

                // Get current scale from SVG
                const current = getCurrentTransform();
                initialScale = current.scale;
            }
        };

        const handleTouchMove = (event) => {
            if (event.touches.length === 1 && isDraggingRef.current) {
                // Single touch dragging
                event.preventDefault();
                const touch = event.touches[0];

                // Get current scale from SVG
                const current = getCurrentTransform();
                const newX = touch.clientX - dragStartRef.current.x;
                const newY = touch.clientY - dragStartRef.current.y;

                // Update SVG directly
                updateSVGTransform(newX, newY, current.scale);
            } else if (event.touches.length === 2) {
                // Two finger pinch zooming
                event.preventDefault();
                const touch1 = event.touches[0];
                const touch2 = event.touches[1];
                const currentDistance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );

                if (initialDistance > 0) {
                    const newScale = Math.max(0.1, Math.min(3, (currentDistance / initialDistance) * initialScale));

                    // Get current values from SVG
                    const current = getCurrentTransform();
                    const scaleFactor = newScale / current.scale;

                    // Get center point between two touches
                    const centerX = (touch1.clientX + touch2.clientX) / 2;
                    const centerY = (touch1.clientY + touch2.clientY) / 2;

                    // Convert to container coordinates
                    const rect = hallContainerRef.current.getBoundingClientRect();
                    const localCenterX = centerX - rect.left;
                    const localCenterY = centerY - rect.top;

                    const newX = localCenterX - (localCenterX - current.x) * scaleFactor;
                    const newY = localCenterY - (localCenterY - current.y) * scaleFactor;

                    // Update SVG directly
                    updateSVGTransform(newX, newY, newScale);
                }
            }
        };

        const handleTouchEnd = () => {
            isDraggingRef.current = false;
            setIsDragging(false);
            initialDistance = 0;
        };

        // Add hover effects
        const handleSvgMouseOver = (event) => {
            const target = event.target;
            if (target.classList.contains('seat') || target.tagName === 'path') {
                target.style.opacity = '0.7';
                target.style.cursor = isDraggingRef.current ? 'grabbing' : 'pointer';
            }
        };

        const handleSvgMouseOut = (event) => {
            const target = event.target;
            if (target.classList.contains('seat') || target.tagName === 'path') {
                target.style.opacity = '1';
                target.style.cursor = 'default';
            }
        };

        // Add event listeners
        const container = hallContainerRef.current;
        container.addEventListener('wheel', handleWheel, { passive: false });
        container.addEventListener('mousedown', handleMouseDown);
        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseup', handleMouseUp);
        container.addEventListener('touchstart', handleTouchStart);
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd);
        svgElement.addEventListener('click', handleSvgClick);
        svgElement.addEventListener('mouseover', handleSvgMouseOver);
        svgElement.addEventListener('mouseout', handleSvgMouseOut);

        return () => {
            // Clean up event listeners
            container.removeEventListener('wheel', handleWheel);
            container.removeEventListener('mousedown', handleMouseDown);
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseup', handleMouseUp);
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleTouchEnd);
            if (svgElement) {
                svgElement.removeEventListener('click', handleSvgClick);
                svgElement.removeEventListener('mouseover', handleSvgMouseOver);
                svgElement.removeEventListener('mouseout', handleSvgMouseOut);
            }

            // Clear container content
            if (hallContainerRef.current) {
                hallContainerRef.current.innerHTML = '';
            }
        };
    }, [svgContent]); // Only depend on svgContent to avoid infinite loops

    // Parse current transform values from SVG
    const getCurrentTransform = () => {
        const element = document.querySelector('svg g.container.seats-are-visible');
        if (!element) return { x: 0, y: 0, scale: 1 };

        const transform = element.getAttribute('transform') || '';

        // Parse translate(x, y)
        const translateMatch = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
        const x = translateMatch ? parseFloat(translateMatch[1]) : 0;
        const y = translateMatch ? parseFloat(translateMatch[2]) : 0;

        // Parse scale(s)
        const scaleMatch = transform.match(/scale\(([^)]+)\)/);
        const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;

        return { x, y, scale };
    };

    // Apply transform directly to SVG element  
    const updateSVGTransform = (x, y, scale) => {
        const element = document.querySelector('svg g.container.seats-are-visible');
        if (element) {
            const newTransform = `translate(${x}, ${y}) scale(${scale})`;
            element.setAttribute('transform', newTransform);

            // Update zoom display directly without React state
            const zoomDisplay = document.querySelector('.zoom-info');
            if (zoomDisplay) {
                zoomDisplay.textContent = `Zoom: ${Math.round(scale * 100)}%`;
            }
        }
    };

    const handleSeatClick = (seatId, element) => {
        // Check selection state directly from the DOM element
        const isSelected = element.getAttribute('data-selected') === 'true';

        console.log(`Seat ${seatId} clicked. Currently selected: ${isSelected}`);

        if (isSelected) {
            // UNSELECT: Remove from selection
            element.setAttribute('data-selected', 'false');

            // Reset visual style
            element.style.fill = '';
            element.style.stroke = '';
            element.style.strokeWidth = '';
            element.classList.remove('selected');

            // Update React state
            setSelectedSeats(prev => prev.filter(seat => seat.id !== seatId));

            console.log(`UNSELECTED seat: ${seatId}`);

        } else {
            // SELECT: Add to selection
            element.setAttribute('data-selected', 'true');

            // Apply selected visual style
            element.style.fill = '#4F46E5';
            element.style.stroke = '#312E81';
            element.style.strokeWidth = '2';
            element.classList.add('selected');

            // Detect section and set pricing
            let price = 0; // Default price
            let sectionName = 'General';
            const seatCurrency = eventPricing.current?.pricing_currency || 'SAR';
            
            // Find the section class for this seat
            let sectionElement = element.closest('.zone');
            if (sectionElement && eventPricing.current) {
                // Helper function to extract numeric price from string
                const extractPrice = (priceStr) => {
                    if (!priceStr) return 0;
                    // Extract just the numeric part, ignoring currency
                    const numericStr = priceStr.split(' ')[0].replace(/[^0-9.]/g, '');
                    return parseFloat(numericStr) || 0;
                };

                if (sectionElement.closest('.zone').classList.contains('range-6865caa7cfbd4')) {
                    // Silver section
                    price = extractPrice(eventPricing.current.silver_price);
                    sectionName = 'Silver';
                } else if (sectionElement.closest('.zone').classList.contains('range-6865caa7cfbd0')) {
                    // Gold section  
                    price = extractPrice(eventPricing.current.gold_price);
                    sectionName = 'Gold';
                } else if (sectionElement.closest('.zone').classList.contains('range-6865caa7cfbcc')) {
                    // Platinum section
                    price = extractPrice(eventPricing.current.platinum_price);
                    sectionName = 'Platinum';
                } else if (sectionElement.closest('.zone').classList.contains('range-6865caa7cfbd7')) {
                    // Diamond section
                    price = extractPrice(eventPricing.current.diamond_price);
                    sectionName = 'Diamond';
                } else if (sectionElement.closest('.zone').classList.contains('range-6865caa7cfbc5')) {
                    // VIP section
                    price = extractPrice(eventPricing.current.vip_price);
                    sectionName = 'VIP';
                } else {
                    // Global price for other sections
                    price = extractPrice(eventPricing.current.global_price);
                    sectionName = 'General';
                }
            }

            // Create seat object for React state
            const row = element.getAttribute('r') || '';
            const position = element.getAttribute('p') || element.getAttribute('sp') || '';

            const newSeat = {
                id: seatId,
                element: element,
                price: price,
                currency: seatCurrency,
                section: sectionName,
                row: row,
                position: position
            };

            // Update React state
            setSelectedSeats(prev => [...prev, newSeat]);

            // Get currency from event data
            console.log(`SELECTED seat: ${seatId}, Section: ${sectionName}, Price: ${price} ${seatCurrency}`);
        }

        if (onSeatSelect) {
            onSeatSelect(seatId, !isSelected);
        }
    };

    // Add this new function
    const zoomToSection = (rangeId) => {
        const section = document.querySelector(`.range-${rangeId}`);
        if (section && hallContainerRef.current) {
            // Get current transform values
            const current = getCurrentTransform();
            
            // Only zoom if we're zoomed out
            if (current.scale < 1.5) {
                // Get section and container bounds
                const sectionRect = section.getBoundingClientRect();
                const containerRect = hallContainerRef.current.getBoundingClientRect();
                
                // Calculate center point of the section relative to the container
                const centerX = sectionRect.left + (sectionRect.width / 2) - containerRect.left;
                const centerY = sectionRect.top + (sectionRect.height / 2) - containerRect.top;
                
                // Calculate new transform values
                const newScale = 1.0;
                const scaleFactor = newScale / current.scale;
                
                // Calculate new position to center the section
                const newX = centerX - (centerX - current.x) * scaleFactor;
                const newY = centerY - (centerY - current.y) * scaleFactor;
                
                // Update SVG transform with animation
                const element = document.querySelector('svg g.container.seats-are-visible');
                if (element) {
                    element.style.transition = 'transform 0.5s ease';
                    updateSVGTransform(newX, newY, newScale);
                    
                    // Add highlight effect to the section
                    section.style.transition = 'all 0.3s ease';
                    section.style.filter = 'brightness(1.2)';
                    
                    // Remove highlight after animation
                    setTimeout(() => {
                        section.style.filter = '';
                        element.style.transition = '';
                    }, 1500);
                }
            }
        }
    };

    const zoomIn = () => {
        // Get current values from SVG
        const current = getCurrentTransform();
        const newScale = Math.min(3, current.scale * 1.2);
        const scaleFactor = newScale / current.scale;

        if (hallContainerRef.current) {
            const containerRect = hallContainerRef.current.getBoundingClientRect();
            const centerX = containerRect.width / 2;
            const centerY = containerRect.height / 2;

            const newX = centerX - (centerX - current.x) * scaleFactor;
            const newY = centerY - (centerY - current.y) * scaleFactor;

            // Update SVG directly
            updateSVGTransform(newX, newY, newScale);
        }
    };

    const zoomOut = () => {
        // Get current values from SVG
        const current = getCurrentTransform();
        const newScale = Math.max(0.1, current.scale * 0.8);
        const scaleFactor = newScale / current.scale;

        if (hallContainerRef.current) {
            const containerRect = hallContainerRef.current.getBoundingClientRect();
            const centerX = containerRect.width / 2;
            const centerY = containerRect.height / 2;

            const newX = centerX - (centerX - current.x) * scaleFactor;
            const newY = centerY - (centerY - current.y) * scaleFactor;

            // Update SVG directly
            updateSVGTransform(newX, newY, newScale);
        }
    };


    if (loading) {
        return (
            <div className="hall-loading">
                <div className="loading-spinner">
                    <svg className="main-slider-spinner" width="30" height="28" viewBox="0 0 30 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M27.5005 6.38885L25.7058 7.56105C23.524 4.41549 20.0528 2.42183 16.1824 2.09124L16.3721 1.95767e-05C20.8962 0.386322 24.9522 2.71505 27.5005 6.38885Z" fill="currentColor"></path>
                        <path d="M26.5002 19.1499C27.2222 17.5683 27.5882 15.8801 27.5882 14.1325C27.5882 12.3849 27.2222 10.6968 26.5002 9.11519L28.4783 8.26504C29.3233 10.1161 29.7517 12.0901 29.7517 14.1325C29.7517 16.1749 29.3233 18.149 28.4783 20L26.5002 19.1499Z" fill="currentColor"></path>
                        <path d="M16.5 28L16.3103 25.9088C20.1808 25.5782 23.652 23.5845 25.8338 20.439L27.6284 21.6112C25.0801 25.285 21.0241 27.6136 16.5 28Z" fill="currentColor"></path>
                        <path d="M3.03551 21.6112L4.83017 20.439C7.01195 23.5845 10.4831 25.5782 14.3536 25.9088L14.1639 28C9.63983 27.6137 5.58377 25.285 3.03551 21.6112Z" fill="currentColor"></path>
                        <path d="M4.00009 9.1017C3.27807 10.6833 2.912 12.3714 2.912 14.119C2.912 15.8666 3.27807 17.5547 4.00009 19.1363L2.02196 19.9865C1.17691 18.1355 0.748535 16.1614 0.748535 14.119C0.748535 12.0767 1.17691 10.1026 2.02196 8.25156L4.00009 9.1017Z" fill="currentColor"></path>
                        <path d="M14.1287 -3.79799e-06L14.3184 2.09121C10.4479 2.42181 6.97673 4.41547 4.79495 7.56104L3.00028 6.38883C5.54855 2.71503 9.60461 0.386439 14.1287 -3.79799e-06Z" fill="currentColor"></path>
                    </svg>
                </div>
                <p>Loading hall map...</p>
            </div>
        );
    }

    return (
        <div className="hall-component colored-hall-map">
            {/* Fixed Timer */}
            <div className="fixed-timer" style={{
                position: 'fixed',
                top: '100px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000,
                background: 'rgba(75, 85, 99, 0.9)',
                color: timeLeft <= 60 ? '#ff4444' : '#ffffff',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ marginRight: '4px' }}>
                    <path d="M10 4V10L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
                </svg>
                {formatTime(timeLeft)}
            </div>

            {/* Hall Map Section */}
            <div className="hall-map-container">
                <div
                    ref={hallContainerRef}
                    className="hall-svg-container"
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                />

                {/* Floating Zoom Controls */}
                <div className="zoom-controls">
                    <button
                        className="zoom-btn zoom-in"
                        onClick={zoomIn}
                        title="Zoom in"
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                    <button
                        className="zoom-btn zoom-out"
                        onClick={zoomOut}
                        title="Zoom out"
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* Instructions */}
                <div className="hall-instructions">
                    <span>Touch to zoom • Drag to move • Tap elements to select</span>
                </div>
            </div>

            {/* Update RangeFilter props */}
            <RangeFilter 
                selectedSeats={selectedSeats}
                eventPricing={eventPricing}
                onRangeSelect={(rangeId) => {
                    zoomToSection(rangeId);
                }}
            />

            {/* Ticket Footer */}
            <TicketFooter 
                selectedSeats={selectedSeats} 
                currency={eventPricing.current?.pricing_currency || 'SAR'}
                onCheckout={() => {
                    if (selectedSeats.length === 0) {
                        alert('Please select at least one seat');
                        return;
                    }
                    
                    // Get existing event data and merge with seat data
                    const existingEventData = localStorage.getItem('eventData');
                    let eventData = {};
                    
                    if (existingEventData) {
                        try {
                            eventData = JSON.parse(existingEventData);
                        } catch (error) {
                            console.error('Error parsing existing event data:', error);
                        }
                    }
                    
                    // Format seats for checkout
                    const seatsForCheckout = selectedSeats.map(seat => ({
                        id: seat.id,
                        category: seat.section,
                        row: seat.row || 'Unknown',
                        number: seat.position || seat.id,
                        price: seat.price,
                        currency: seat.currency
                    }));
                    
                    // Calculate total price
                    const totalPrice = selectedSeats.reduce((total, seat) => total + (seat.price || 0), 0);
                    
                    // Update event data with seat information
                    eventData.selectedSeats = seatsForCheckout;
                    eventData.totalPrice = totalPrice;
                    eventData.currency = eventPricing.current?.pricing_currency;
                    eventData.pricing_currency = eventPricing.current?.pricing_currency; // Add both for consistency
                    
                    // Save updated data to localStorage
                    localStorage.setItem('eventData', JSON.stringify(eventData));
                    localStorage.setItem('selectedSeats', JSON.stringify(seatsForCheckout));
                    localStorage.setItem('orderStep', 'seat_selection_completed');
                    
                    console.log('Proceeding to checkout with seats:', seatsForCheckout);
                    console.log('Updated event data:', eventData);
                    
                    // Navigate to login page
                    window.location.href = '/login';
                }}
            />
        </div>
    );
};

export default Hall;