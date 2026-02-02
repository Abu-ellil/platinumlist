'use client';
import { useState, useEffect } from 'react';

const TicketFooter = ({ selectedSeats, onCheckout, hideNextButton = false, isPaymentMode = false, total, currency = 'SAR', processing = false, disabled = false }) => {
    const [timeLeft, setTimeLeft] = useState(6 * 60);
    
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        
        return () => clearInterval(timer);
    }, []);
    
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    const getTotalPrice = () => {
        if (isPaymentMode && total !== undefined) {
            return total;
        }
        return selectedSeats.reduce((total, seat) => total + seat.price, 0);
    };
    
    if (!isPaymentMode && selectedSeats.length === 0) {
        return null;
    }
    
    return (
        <div className="smart-footer" data-smart-footer='{"basket":{"mode":"edit","stage":"hall-map","data":[]},"GTM":{"hintResaleShown":{"event_name":"hint_shown","item":null,"type":"resale","hierarchy":null,"id":99136,"id_name":"Event","interface_location":"page","status":null,"meta":null,"comment":null}}}'>
            <div className="smart-footer__content container2" data-smart-footer-content="">
                <div className="smart-footer-details">
                    <div className="smart-footer-details__basket smart-footer-details__basket--desktop" data-smart-footer-basket-app="desktop" data-v-app="">
                        <div className="__toggle__ZQpvRr8Kkp">
                            <button className="__button__66-WN-5jVq" type="button">
                                <div className="__tickets__slUsBxSD5c">
                                    <div className="__tickets__pAPI8SOdAA">
                                        <div className="__ticket__Qi-fNrnS4H __ticketThird__jd80MQ4Vrh __ticketHidden__vhqJM3yuqd">
                                            <TicketSVG />
                                        </div>
                                        <div className="__ticket__Qi-fNrnS4H __ticketSecond__ml-WHhQAxi __ticketHidden__vhqJM3yuqd">
                                            <TicketSVG />
                                        </div>
                                        <div className="__ticket__Qi-fNrnS4H __ticketFirst__3zlXAnexsw">
                                            <TicketSVG />
                                        </div>
                                        <div className="__counter__tNpqyOFlZq">
                                            <span className="__ticketIcon__4cVRhelgB9">
                                                <svg className="icon-24-kit-ticket icon">
                                                    <use xlinkHref="#svg-icon-24-kit-ticket"></use>
                                                </svg>
                                            </span>
                                            <span className="__counterX__kzuHgAMPtx" role="presentation">x</span>
                                            <span className="__counterNumber__7697iuNoE-">{selectedSeats?.length || 0}</span>
                                        </div>
                                        <div className="__counter__tNpqyOFlZq __counterPrev__JdGffabdVF"></div>
                                    </div>
                                </div>
                                <div className="__content__sEODF9j730">
                                    <div className="__inner__4x5NO7ZmLh">
                                        <span className="__text__znvqt3vtl2">تفاصيل الطلب</span>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                    
                    <div className="smart-footer-countdown-desktop no-mobile" data-smart-footer-timer="">
                        <div className="smart-footer-countdown-desktop__inner">
                            <div className="smart-footer-countdown-desktop__title">الوقت المتبقي</div>
                            <div className="smart-footer-countdown-desktop__time smart-footer-countdown-desktop__time--alert" data-count-down="0" data-count-down-format="mm:ss" data-count-down-alert-time="300" data-order-countdown="" data-smart-footer-countdown="" style={{display: 'flex'}}>
                                {formatTime(timeLeft)}
                            </div>
                        </div>
                    </div>
                    
                    <div className="smart-footer-details__group">
                        <div className="smart-footer-details__group-item">
                            <div className="smart-footer-details__info mobile">
                                <div className="smart-footer-details__details-ticket">
                                    <svg className="icon icon-16-kit-ticket">
                                        <use xlinkHref="#svg-icon-16-kit-ticket"></use>
                                    </svg>
                                </div>
                                <div className="smart-footer-details__details-counter">
                                    x<span data-smart-footer-items-count="">{selectedSeats?.length || 0}</span>
                                </div>
                                <div className="smart-footer-details__details-text">التفاصيل</div>
                                <div className="smart-footer-details__details-icon">
                                    <span className="smart-footer-details__details-icon-active" data-smart-footer-detail-icon-active="">
                                        <svg className="icon icon-16-kit-question-filled">
                                            <use xlinkHref="#svg-icon-16-kit-question-filled"></use>
                                        </svg>
                                    </span>
                                    <span className="smart-footer-details__details-icon-inactive" data-smart-footer-detail-icon-inactive="">
                                        <svg className="icon icon-16-kit-question">
                                            <use xlinkHref="#svg-icon-16-kit-question"></use>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="smart-footer-details__total">
                            <span className="smart-footer-details__total-title smart-footer-details__total-title--light mobile">الإجمالي:</span>
                            <span className="smart-footer-details__total-amount" data-ticket-office-total="">
                                {getTotalPrice().toLocaleString()}
                            </span>
                            <span className="smart-footer-details__total-amount">{currency}</span>
                        </div>
                    </div>
                    
                    <div className="smart-footer-details__basket smart-footer-details__basket--mobile" data-smart-footer-basket-app="mobile" data-v-app="">
                        <div className="v-basket-toggle">
                            <button style={{position: 'absolute', top: '0px', left: '0px', width: '100%', height: '100%', opacity: 0}}></button>
                        </div>
                    </div>
                </div>
                
                {!hideNextButton && (
                    <button 
                        className={`smart-footer-next-button button-green ${(processing || disabled) ? 'smart-footer-next-button--disabled' : ''}`} 
                        data-smart-footer-checkout-disable-class="smart-footer-next-button--disabled" 
                        data-smart-footer-btn="" 
                        data-hall-map-ticket-office-checkout="" 
                        onClick={onCheckout}
                        disabled={processing || disabled}
                        type={isPaymentMode ? "submit" : "button"}
                    >
                        <span className="smart-footer-next-button__text">
                            {processing ? 'جاري المعالجة...' : (isPaymentMode ? 'دفع' : 'التالي')}
                        </span>
                        <span className="mobile smart-footer-next-button__countdown" data-count-down="0" data-count-down-format="mm:ss" data-order-countdown="" data-smart-footer-countdown="" style={{display: 'block'}}>
                            {formatTime(timeLeft)}
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
};

// Exact SVG from your HTML
const TicketSVG = () => (
    <svg width="80" height="56" viewBox="0 0 80 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.5 8C0.5 3.85786 3.85786 0.5 8 0.5H72C76.1421 0.5 79.5 3.85786 79.5 8V18.2958C79.5 19.0339 78.93 19.7084 78.1161 20.0019C74.8419 21.1827 72.5 24.3172 72.5 28C72.5 31.6828 74.8419 34.8173 78.1161 35.9981C78.93 36.2916 79.5 36.9661 79.5 37.7042V48C79.5 52.1421 76.1421 55.5 72 55.5H8C3.85787 55.5 0.5 52.1421 0.5 48V37.7042C0.5 36.9661 1.07003 36.2916 1.88394 35.9981C5.15814 34.8173 7.5 31.6828 7.5 28C7.5 24.3172 5.15814 21.1827 1.88395 20.0019C1.07003 19.7084 0.5 19.0339 0.5 18.2958V8Z" fill="white" />
        <path d="M0.5 8C0.5 3.85786 3.85786 0.5 8 0.5H72C76.1421 0.5 79.5 3.85786 79.5 8V18.2958C79.5 19.0339 78.93 19.7084 78.1161 20.0019C74.8419 21.1827 72.5 24.3172 72.5 28C72.5 31.6828 74.8419 34.8173 78.1161 35.9981C78.93 36.2916 79.5 36.9661 79.5 37.7042V48C79.5 52.1421 76.1421 55.5 72 55.5H8C3.85787 55.5 0.5 52.1421 0.5 48V37.7042C0.5 36.9661 1.07003 36.2916 1.88394 35.9981C5.15814 34.8173 7.5 31.6828 7.5 28C7.5 24.3172 5.15814 21.1827 1.88395 20.0019C1.07003 19.7084 0.5 19.0339 0.5 18.2958V8Z" fill="url(#paint0_linear_17576_42504)" />
        <path d="M0.5 8C0.5 3.85786 3.85786 0.5 8 0.5H72C76.1421 0.5 79.5 3.85786 79.5 8V18.2958C79.5 19.0339 78.93 19.7084 78.1161 20.0019C74.8419 21.1827 72.5 24.3172 72.5 28C72.5 31.6828 74.8419 34.8173 78.1161 35.9981C78.93 36.2916 79.5 36.9661 79.5 37.7042V48C79.5 52.1421 76.1421 55.5 72 55.5H8C3.85787 55.5 0.5 52.1421 0.5 48V37.7042C0.5 36.9661 1.07003 36.2916 1.88394 35.9981C5.15814 34.8173 7.5 31.6828 7.5 28C7.5 24.3172 5.15814 21.1827 1.88395 20.0019C1.07003 19.7084 0.5 19.0339 0.5 18.2958V8Z" stroke="url(#paint1_linear_17576_42504)" />
        <defs>
            <linearGradient id="paint0_linear_17576_42504" x1="40" y1="0" x2="40" y2="56" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0D3D75" stopOpacity="0.06" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="paint1_linear_17576_42504" x1="42.4423" y1="0" x2="42.4423" y2="56" gradientUnits="userSpaceOnUse">
                <stop offset="0.133508" stopColor="white" />
                <stop offset="0.326397" stopColor="white" stopOpacity="0.4" />
                <stop offset="0.404599" stopColor="#05558F" stopOpacity="0.1" />
                <stop offset="0.532416" stopColor="white" stopOpacity="0.1" />
                <stop offset="0.626854" stopColor="white" />
                <stop offset="0.889013" stopColor="white" stopOpacity="0.3" />
                <stop offset="1" stopColor="#05558F" stopOpacity="0.1" />
            </linearGradient>
        </defs>
    </svg>
);

export default TicketFooter; 