'use client';
import { useState, useEffect } from 'react';
import CheckoutHeader from './CheckoutHeader';
import OrderSummary from './OrderSummary';
import TicketDelivery from './TicketDelivery';
import CustomerFields from './CustomerFields';
import Terms from './Terms';
import PaymentMethods from './PaymentMethods';
import PricingSummary from './PricingSummary';
import TotalBlock from './TotalBlock';
import TicketFooter from '../tickets/TicketFooter';

const NewPaymentForm = ({ 
    selectedSeats, 
    userData, 
    onPaymentSubmit 
}) => {
    const [formState, setFormState] = useState({
        consent: false,
        termsAccepted: true,
        paymentData: {},
        paymentValid: false,
        services: {
            refundGuarantee: true,
            whatsappNotifications: true
        }
    });

    const [processing, setProcessing] = useState(false);
    const [eventData, setEventData] = useState({
        name: 'Event Name',
        venue: 'Venue',
        date: 'Event Date',
        time: '21:00',
        image: '/default-event.jpg',
        pricing_currency: 'SAR'
    });

    // Load event data from localStorage
    useEffect(() => {
        const savedEventData = localStorage.getItem('eventData');
        if (savedEventData) {
            try {
                const parsedEventData = JSON.parse(savedEventData);
                setEventData(parsedEventData);

                // Update pricing configuration based on event data
                const selectedSeatsTotal = selectedSeats.reduce((total, seat) => total + (seat.price || 0), 0);
                const currency = parsedEventData.pricing_currency || parsedEventData.currency || 'SAR';
                
                // Calculate fees based on total
                const serviceFeePercentage = 0.05; // 5%
                const serviceFee = selectedSeatsTotal * serviceFeePercentage;
                const refundGuaranteePercentage = 0.10; // 10%
                const refundGuarantee = selectedSeatsTotal * refundGuaranteePercentage;
                
                setPricing({
                    ticketPrice: selectedSeatsTotal,
                    refundGuarantee: refundGuarantee,
                    whatsappService: 10, // Fixed fee
                    serviceFee: serviceFee,
                    vatRate: 5,
                    currency: currency
                });
            } catch (error) {
                console.error('Error parsing event data from localStorage:', error);
            }
        }
    }, [selectedSeats]);

    // Pricing configuration
    const [pricing, setPricing] = useState({
        ticketPrice: 0,
        refundGuarantee: 0,
        whatsappService: 10,
        serviceFee: 0,
        vatRate: 5,
        currency: 'SAR'
    });

    const calculateTotal = () => {
        let subtotal = pricing.ticketPrice + pricing.serviceFee;
        if (formState.services.refundGuarantee) subtotal += pricing.refundGuarantee;
        if (formState.services.whatsappNotifications) subtotal += pricing.whatsappService;
        const vatAmount = (subtotal * pricing.vatRate) / 100;
        const total = subtotal + vatAmount;
        return parseFloat(total.toFixed(2)); // Round to 2 decimal places
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formState.termsAccepted) {
            alert('يجب الموافقة على الشروط والأحكام');
            return;
        }

        if (!formState.paymentValid) {
            alert('يرجى التحقق من بيانات البطاقة الائتمانية');
            return;
        }

        setProcessing(true);

        try {
            const paymentFormData = {
                ...formState.paymentData,
                services: formState.services,
                consent: formState.consent,
                termsAccepted: formState.termsAccepted,
                total: calculateTotal(),
                currency: pricing.currency,
                ticketPrice: pricing.ticketPrice,
                serviceFee: pricing.serviceFee,
                refundGuarantee: formState.services.refundGuarantee ? pricing.refundGuarantee : 0,
                whatsappService: formState.services.whatsappNotifications ? pricing.whatsappService : 0,
                vatRate: pricing.vatRate,
                vatAmount: (calculateTotal() * pricing.vatRate) / 100
            };

            await onPaymentSubmit(paymentFormData);
        } catch (error) {
            console.error('Payment submission error:', error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="container2 padded order checkout material">
            <CheckoutHeader />
            
            <div className="checkout-block-wrapper clearfix">
                <div className="checkout-block">
                    {/* Order Summary */}
                    <div className="checkout-block-header no-mobile">
                        <span>ملخص الطلب</span>
                    </div>
                    <OrderSummary 
                        eventData={eventData} 
                        selectedSeats={selectedSeats} 
                    />

                    {/* Ticket Delivery */}
                    <TicketDelivery email={userData?.email} />

                    {/* Customer Fields */}
                    <CustomerFields 
                        onConsentChange={(consent) => 
                            setFormState(prev => ({ ...prev, consent }))
                        } 
                    />

                    {/* Terms */}
                    <Terms 
                        onTermsChange={(termsAccepted) => 
                            setFormState(prev => ({ ...prev, termsAccepted }))
                        } 
                    />

                    <div className="checkout-block-delimiter mobile"></div>
                </div>

                <div className="checkout-block">
                    {/* Payment Form */}
                    <form 
                        id="checkout_form" 
                        name="checkout_form" 
                        encType="application/x-www-form-urlencoded" 
                        method="post"
                        className="form" 
                        onSubmit={handleSubmit}
                    >
                        <PaymentMethods 
                            onPaymentDataChange={(paymentData) =>
                                setFormState(prev => ({ 
                                    ...prev, 
                                    paymentData,
                                    paymentValid: paymentData.isValid || false
                                }))
                            }
                        />

                        <PricingSummary 
                            {...pricing}
                            services={{
                                ...formState.services,
                                onChange: (newServices) => {
                                    setFormState(prev => ({
                                        ...prev,
                                        services: newServices
                                    }));
                                }
                            }}
                        />

                        <input 
                            type="hidden" 
                            name="total" 
                            value={calculateTotal()} 
                            data-order-checkout-total={pricing.ticketPrice} 
                            id="total" 
                        />


                        <TicketFooter
                            selectedSeats={selectedSeats}
                            total={calculateTotal()} 
                            currency={pricing.currency}
                            isPaymentMode={true}
                            processing={processing}
                            disabled={!formState.termsAccepted || !formState.paymentValid}
                            onCheckout={handleSubmit}
                        />  
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewPaymentForm; 