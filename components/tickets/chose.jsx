"use client";

import { useState, useEffect } from 'react';

const Choose = () => {
    const [quantity, setQuantity] = useState(1);
    const [timeLeft, setTimeLeft] = useState(355); // 5:55 in seconds
    const pricePerTicket = 1466.55;
    const totalPrice = (quantity * pricePerTicket).toFixed(2);

    // Timer countdown effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Format time display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1 && newQuantity <= 10) {
            setQuantity(newQuantity);
        }
    };

    const incrementQuantity = () => {
        handleQuantityChange(quantity + 1);
    };

    const decrementQuantity = () => {
        handleQuantityChange(quantity - 1);
    };

    const handleInputChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        handleQuantityChange(value);
    };

    return (
        <div>
            <div className="header-5ts container-mto pad-pnj">
                <a className="header-god" href="https://istanbul.platinumlist.net/ar/event-tickets/hagia-sophia-highlights-guided-tour-audio-guide">
                    <svg className="icon-arrow-left-rounded icon">
                        <use xlinkHref="#svg-icon-arrow-left-rounded"></use>
                    </svg>
                </a>
                <div className="title-qrc">
                    <h1 id="0_d-br6" className="title-6gv style-HzP7Q">تذكرة تخطي الطابور في آيا صوفيا مع دليل صوتي</h1>
                    <p className="select-5vd">
                        <span className="select-o31">
                            <svg className="icon-16-kit-clock icon">
                                <use xlinkHref="#svg-icon-16-kit-clock"></use>
                            </svg>
                            <span> خميس 03 يوليو, 14:00–15:00 </span>
                        </span>
                        <span className="select-svb">
                            <svg className="icon-16-kit-geo-mark icon">
                                <use xlinkHref="#svg-icon-16-kit-geo-mark"></use>
                            </svg>
                            <span className="select-tgp">آيا صوفيا</span>
                        </span>
                    </p>
                </div>
                <div className="__p-x2c"></div>
            </div>

            <div className="content-aob container-mto pad-pnj content-eks">
                <div className="__timeOptions__slF3X7-t2c">
                    <div className="option-741">
                        <button className="__u-8mk">
                            <span className="__unitedOptionItemBtnCalendar__Xfd-2hj">
                                <svg className="icon-24-kit-calendar icon">
                                    <use xlinkHref="#svg-icon-24-kit-calendar"></use>
                                </svg>
                            </span>
                            <span className="__u-nmh"> خميس 03 يوليو, 14:00–15:00 </span>
                            <span className="row-o5g">
                                <svg className="icon-16-kit-arrowhead-down icon">
                                    <use xlinkHref="#svg-icon-16-kit-arrowhead-down"></use>
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>

                <div className="__offerTree__XCdH-eta">
                    <div>
                        <div className="content-a57 style-CvpBf" id="style-CvpBf">
                            <div className="content-xpf">
                                <div className="__g-j9b">
                                    <div className="__h-85a">
                                        <div className="__n-nqr">Hagia Sophia Skip-the-Line Ticket and Audio Guide</div>
                                        <div className="__c-r7f">
                                            <button className="button-g8f">
                                                <svg className="icon-i-circled-3 icon">
                                                    <use xlinkHref="#svg-icon-i-circled-3"></use>
                                                </svg>
                                                المزيد من المعلومات
                                            </button>
                                        </div>
                                    </div>
                                    <div className="__o-ns9">
                                        <div className="__o-bkr">
                                            <div className="info-76c">
                                                <div className="__s-lh7">
                                                    <div className="__name__L-t2s">
                                                        <div className="__clampedText__iMuESrsE-o7o">Adult/Child</div>
                                                    </div>
                                                </div>
                                                <div className="__s-lh7">
                                                    <div className="__acceleratorBlock__M1MlRzQ-oee">
                                                        <div className="__p-3o8">{pricePerTicket} EGP</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="__c-5mo">
                                                <div className="__c-jbd __md__g-8r3">
                                                    <div className="toggle-ztr">
                                                        <div className="panel-qk4">
                                                            <div className="panel-reh"></div>
                                                            <div className="panel-thx">
                                                                <button 
                                                                    className="__a-mt8 __d-chy select-iwf casual-offer-8on casual-offer-control__action--b7g"
                                                                    onClick={decrementQuantity}
                                                                    disabled={quantity <= 1}
                                                                >
                                                                    <svg className="icon-minus-medium icon">
                                                                        <use xlinkHref="#svg-icon-minus-medium"></use>
                                                                    </svg>
                                                                </button>
                                                                <div className="input-xqm">
                                                                    <input 
                                                                        className="input-e3l" 
                                                                        type="number" 
                                                                        value={quantity}
                                                                        onChange={handleInputChange}
                                                                        min="1"
                                                                        max="10"
                                                                    />
                                                                    <button className="__c-nzb" type="button">
                                                                        <svg className="icon-checkmark-medium icon">
                                                                            <use xlinkHref="#svg-icon-checkmark-medium"></use>
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                                <button 
                                                                    className="__a-mt8 __i-mom select-iwf casual-offer-8on casual-offer-control__action--lhi"
                                                                    onClick={incrementQuantity}
                                                                    disabled={quantity >= 10}
                                                                >
                                                                    <svg className="icon-plus-medium icon">
                                                                        <use xlinkHref="#svg-icon-plus-medium"></use>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="block-1ov"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-llp">
                <div className="footer-1he">
                    <div className="__inner__rpvy0zT-myw container-mto pad-pnj">
                        <div className="toggle-ztr">
                            <button className="button-5tn" type="button">
                                <div className="__t-krr">
                                    <div className="__t-hgs">
                                        <div className="__ticket__Qi-6sv __t-l7k __t-jv7">
                                            <svg width="80" height="56" viewBox="0 0 80 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M0.5 8C0.5 3.85786 3.85786 0.5 8 0.5H72C76.1421 0.5 79.5 3.85786 79.5 8V18.2958C79.5 19.0339 78.93 19.7084 78.1161 20.0019C74.8419 21.1827 72.5 24.3172 72.5 28C72.5 31.6828 74.8419 34.8173 78.1161 35.9981C78.93 36.2916 79.5 36.9661 79.5 37.7042V48C79.5 52.1421 76.1421 55.5 72 55.5H8C3.85787 55.5 0.5 52.1421 0.5 48V37.7042C0.5 36.9661 1.07003 36.2916 1.88394 35.9981C5.15814 34.8173 7.5 31.6828 7.5 28C7.5 24.3172 5.15814 21.1827 1.88395 20.0019C1.07003 19.7084 0.5 19.0339 0.5 18.2958V8Z" fill="white"></path>
                                                <path d="M0.5 8C0.5 3.85786 3.85786 0.5 8 0.5H72C76.1421 0.5 79.5 3.85786 79.5 8V18.2958C79.5 19.0339 78.93 19.7084 78.1161 20.0019C74.8419 21.1827 72.5 24.3172 72.5 28C72.5 31.6828 74.8419 34.8173 78.1161 35.9981C78.93 36.2916 79.5 36.9661 79.5 37.7042V48C79.5 52.1421 76.1421 55.5 72 55.5H8C3.85787 55.5 0.5 52.1421 0.5 48V37.7042C0.5 36.9661 1.07003 36.2916 1.88394 35.9981C5.15814 34.8173 7.5 31.6828 7.5 28C7.5 24.3172 5.15814 21.1827 1.88395 20.0019C1.07003 19.7084 0.5 19.0339 0.5 18.2958V8Z" fill="url(#paint0_linear_17576_42504)"></path>
                                                <path d="M0.5 8C0.5 3.85786 3.85786 0.5 8 0.5H72C76.1421 0.5 79.5 3.85786 79.5 8V18.2958C79.5 19.0339 78.93 19.7084 78.1161 20.0019C74.8419 21.1827 72.5 24.3172 72.5 28C72.5 31.6828 74.8419 34.8173 78.1161 35.9981C78.93 36.2916 79.5 36.9661 79.5 37.7042V48C79.5 52.1421 76.1421 55.5 72 55.5H8C3.85787 55.5 0.5 52.1421 0.5 48V37.7042C0.5 36.9661 1.07003 36.2916 1.88394 35.9981C5.15814 34.8173 7.5 31.6828 7.5 28C7.5 24.3172 5.15814 21.1827 1.88395 20.0019C1.07003 19.7084 0.5 19.0339 0.5 18.2958V8Z" stroke="url(#paint1_linear_17576_42504)"></path>
                                                <defs>
                                                    <linearGradient>
                                                        <stop></stop>
                                                        <stop></stop>
                                                    </linearGradient>
                                                    <linearGradient>
                                                        <stop></stop>
                                                        <stop></stop>
                                                        <stop></stop>
                                                        <stop></stop>
                                                        <stop></stop>
                                                        <stop></stop>
                                                        <stop></stop>
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                        </div>
                                        <div className="__ticket__Qi-6sv __ticketSecond__ml-697 __t-jv7">
                                            <svg width="80" height="56" viewBox="0 0 80 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M0.5 8C0.5 3.85786 3.85786 0.5 8 0.5H72C76.1421 0.5 79.5 3.85786 79.5 8V18.2958C79.5 19.0339 78.93 19.7084 78.1161 20.0019C74.8419 21.1827 72.5 24.3172 72.5 28C72.5 31.6828 74.8419 34.8173 78.1161 35.9981C78.93 36.2916 79.5 36.9661 79.5 37.7042V48C79.5 52.1421 76.1421 55.5 72 55.5H8C3.85787 55.5 0.5 52.1421 0.5 48V37.7042C0.5 36.9661 1.07003 36.2916 1.88394 35.9981C5.15814 34.8173 7.5 31.6828 7.5 28C7.5 24.3172 5.15814 21.1827 1.88395 20.0019C1.07003 19.7084 0.5 19.0339 0.5 18.2958V8Z" fill="white"></path>
                                                <path d="M0.5 8C0.5 3.85786 3.85786 0.5 8 0.5H72C76.1421 0.5 79.5 3.85786 79.5 8V18.2958C79.5 19.0339 78.93 19.7084 78.1161 20.0019C74.8419 21.1827 72.5 24.3172 72.5 28C72.5 31.6828 74.8419 34.8173 78.1161 35.9981C78.93 36.2916 79.5 36.9661 79.5 37.7042V48C79.5 52.1421 76.1421 55.5 72 55.5H8C3.85787 55.5 0.5 52.1421 0.5 48V37.7042C0.5 36.9661 1.07003 36.2916 1.88394 35.9981C5.15814 34.8173 7.5 31.6828 7.5 28C7.5 24.3172 5.15814 21.1827 1.88395 20.0019C1.07003 19.7084 0.5 19.0339 0.5 18.2958V8Z" fill="url(#paint0_linear_17576_42504)"></path>
                                                <path d="M0.5 8C0.5 3.85786 3.85786 0.5 8 0.5H72C76.1421 0.5 79.5 3.85786 79.5 8V18.2958C79.5 19.0339 78.93 19.7084 78.1161 20.0019C74.8419 21.1827 72.5 24.3172 72.5 28C72.5 31.6828 74.8419 34.8173 78.1161 35.9981C78.93 36.2916 79.5 36.9661 79.5 37.7042V48C79.5 52.1421 76.1421 55.5 72 55.5H8C3.85787 55.5 0.5 52.1421 0.5 48V37.7042C0.5 36.9661 1.07003 36.2916 1.88394 35.9981C5.15814 34.8173 7.5 31.6828 7.5 28C7.5 24.3172 5.15814 21.1827 1.88395 20.0019C1.07003 19.7084 0.5 19.0339 0.5 18.2958V8Z" stroke="url(#paint1_linear_17576_42504)"></path>
                                                <defs>
                                                    <linearGradient>
                                                        <stop></stop>
                                                        <stop></stop>
                                                    </linearGradient>
                                                    <linearGradient>
                                                        <stop></stop>
                                                        <stop></stop>
                                                        <stop></stop>
                                                        <stop></stop>
                                                        <stop></stop>
                                                        <stop></stop>
                                                        <stop></stop>
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                        </div>
                                        <div className="__ticket__Qi-6sv __t-2ss">
                                            <svg width="80" height="56" viewBox="0 0 80 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M0.5 8C0.5 3.85786 3.85786 0.5 8 0.5H72C76.1421 0.5 79.5 3.85786 79.5 8V18.2958C79.5 19.0339 78.93 19.7084 78.1161 20.0019C74.8419 21.1827 72.5 24.3172 72.5 28C72.5 31.6828 74.8419 34.8173 78.1161 35.9981C78.93 36.2916 79.5 36.9661 79.5 37.7042V48C79.5 52.1421 76.1421 55.5 72 55.5H8C3.85787 55.5 0.5 52.1421 0.5 48V37.7042C0.5 36.9661 1.07003 36.2916 1.88394 35.9981C5.15814 34.8173 7.5 31.6828 7.5 28C7.5 24.3172 5.15814 21.1827 1.88395 20.0019C1.07003 19.7084 0.5 19.0339 0.5 18.2958V8Z" fill="white"></path>
                                                <path d="M0.5 8C0.5 3.85786 3.85786 0.5 8 0.5H72C76.1421 0.5 79.5 3.85786 79.5 8V18.2958C79.5 19.0339 78.93 19.7084 78.1161 20.0019C74.8419 21.1827 72.5 24.3172 72.5 28C72.5 31.6828 74.8419 34.8173 78.1161 35.9981C78.93 36.2916 79.5 36.9661 79.5 37.7042V48C79.5 52.1421 76.1421 55.5 72 55.5H8C3.85787 55.5 0.5 52.1421 0.5 48V37.7042C0.5 36.9661 1.07003 36.2916 1.88394 35.9981C5.15814 34.8173 7.5 31.6828 7.5 28C7.5 24.3172 5.15814 21.1827 1.88395 20.0019C1.07003 19.7084 0.5 19.0339 0.5 18.2958V8Z" fill="url(#paint0_linear_17576_42504)"></path>
                                                <path d="M0.5 8C0.5 3.85786 3.85786 0.5 8 0.5H72C76.1421 0.5 79.5 3.85786 79.5 8V18.2958C79.5 19.0339 78.93 19.7084 78.1161 20.0019C74.8419 21.1827 72.5 24.3172 72.5 28C72.5 31.6828 74.8419 34.8173 78.1161 35.9981C78.93 36.2916 79.5 36.9661 79.5 37.7042V48C79.5 52.1421 76.1421 55.5 72 55.5H8C3.85787 55.5 0.5 52.1421 0.5 48V37.7042C0.5 36.9661 1.07003 36.2916 1.88394 35.9981C5.15814 34.8173 7.5 31.6828 7.5 28C7.5 24.3172 5.15814 21.1827 1.88395 20.0019C1.07003 19.7084 0.5 19.0339 0.5 18.2958V8Z" stroke="url(#paint1_linear_17576_42504)"></path>
                                                <defs>
                                                    <linearGradient>
                                                        <stop></stop>
                                                        <stop></stop>
                                                    </linearGradient>
                                                    <linearGradient>
                                                        <stop></stop>
                                                        <stop></stop>
                                                        <stop></stop>
                                                        <stop></stop>
                                                        <stop></stop>
                                                        <stop></stop>
                                                        <stop></stop>
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                        </div>
                                        <div className="__c-n5j">
                                            <span className="__t-j55">
                                                <svg className="icon-24-kit-ticket icon">
                                                    <use xlinkHref="#svg-icon-24-kit-ticket"></use>
                                                </svg>
                                            </span>
                                            <span className="__c-hfm">x</span>
                                            <span className="__counterNumber__7697iuNoE-6gt">{quantity}</span>
                                        </div>
                                        <div className="__c-n5j fa-8ao"></div>
                                    </div>
                                </div>
                                <div className="content-ncc">
                                    <div className="__i-chd">
                                        <span className="text-foo">تفاصيل الطلب</span>
                                    </div>
                                </div>
                            </button>
                        </div>
                        <div className="__timer__QgtyYrJ-11f">
                            <span>الوقت المتبقي</span>
                            <span className="__time__HJ-oqc">{formatTime(timeLeft)}</span>
                        </div>
                        <div className="__t-ffb">{totalPrice} EGP</div>
                        <button className="btn-1ed btn-io6 btn-t9f">
                            <span>الدفع</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Choose;