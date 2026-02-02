'use client';

const OrderSummary = ({ eventData, selectedSeats }) => {
    // Format price with currency
    const formatPrice = (price, currency) => {
        return `${price.toFixed(2)} ${currency}`;
    };

    return (
        <div className="order-summary-block open" data-order-summary="">
            <div className="event-thumb-img">
                <img
                    src={eventData?.image || '/default-event.jpg'}
                    width="960"
                    height="540"
                    alt={eventData?.name || 'Event'}
                    title={eventData?.name || 'Event'}
                />
            </div>
            <div className="event-info">
                <div className="event-summary">
                    <div className="item">
                        <p className="event-name" alt={eventData?.name}>
                            {eventData?.name || 'Event Name'}
                        </p>
                    </div>
                    <p className="item venue">{eventData?.venue || 'Venue'}</p>
                    <div className="item show-datetime">
                        <p className="show-date">
                            <span className="calendar-icon-block">
                                <svg className="icon icon-calendar-order-summary">
                                    <use xlinkHref="#svg-icon-calendar-order-summary"></use>
                                </svg>
                            </span>
                            <span>{eventData?.date || 'Date'}</span>
                            <span className="show-time">
                                <svg className="icon icon-clock-order-summary">
                                    <use xlinkHref="#svg-icon-clock-order-summary"></use>
                                </svg>
                                <span>{eventData?.time || 'Time'}</span>
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="order-info open order-info--no-toggle" data-order-summary-order-info="">
                <div data-order-summary-order-info-inner="">
                    <div>
                        <ul className="item-list">
                            {selectedSeats?.map((seat, index) => (
                                <li key={index} className="item">
                                    <span className="item-icon">
                                        <svg className="icon icon-ticket-order-summary">
                                            <use xlinkHref="#svg-icon-ticket-order-summary"></use>
                                        </svg>
                                    </span>
                                    <div className="item-content">
                                        <div className="item-name-line">
                                            <p className="item-text">
                                                <span>{seat.category}</span>
                                                <span className="item-price">
                                                    {formatPrice(seat.price, seat.currency || eventData?.pricing_currency || 'SAR')}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="item-details-line">
                                            <div className="item-seating-details">
                                                <p><span>صف:&nbsp;</span>{seat.row}</p>
                                                <p className="item-seating">
                                                    <span>المقعد:&nbsp;</span>{seat.number}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="order-summary-total">
                            <p className="total-text">
                                المجموع: {formatPrice(
                                    selectedSeats?.reduce((total, seat) => total + (seat.price || 0), 0),
                                    eventData?.pricing_currency || 'SAR'
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary; 