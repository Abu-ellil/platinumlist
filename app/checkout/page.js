'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NewPaymentForm from '@/components/checkout/NewPaymentForm';
import PaymentSuccess from '@/components/checkout/PaymentSuccess';
import Header from '@/components/tickets/Header';

const CheckoutPage = () => {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [orderData, setOrderData] = useState(null);

    useEffect(() => {
        // Add the stylesheet link if it doesn't exist
        const existingLink = document.querySelector('link[href="/styles/front.css"]');
        if (!existingLink) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/styles/front.css';
            document.head.appendChild(link);
        }

        // Add meta tag to prevent mobile zoom
        const existingViewport = document.querySelector('meta[name="viewport"]');
        if (existingViewport) {
            existingViewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
        } else {
            const metaViewport = document.createElement('meta');
            metaViewport.name = 'viewport';
            metaViewport.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
            document.head.appendChild(metaViewport);
        }
    }, []);

    useEffect(() => {
        // Load data from localStorage
        const savedUserData = localStorage.getItem('userData');
        const savedSeats = localStorage.getItem('selectedSeats');
        const userSession = localStorage.getItem('userSession');

        if (!savedUserData || !savedSeats) {
            // No data found, redirect to home
            router.push('/');
            return;
        }

        try {
            setUserData(JSON.parse(savedUserData));
            setSelectedSeats(JSON.parse(savedSeats));
        } catch (error) {
            console.error('Error parsing localStorage data:', error);
            router.push('/');
            return;
        }

        setLoading(false);
    }, [router]);



    const handlePaymentSubmit = async (paymentFormData) => {
        setProcessing(true);

        try {
            // Get event data from localStorage
            const savedEventData = localStorage.getItem('eventData');
            let eventData = {};
            
            if (savedEventData) {
                try {
                    eventData = JSON.parse(savedEventData);
                } catch (error) {
                    console.error('Error parsing event data:', error);
                }
            }

            // Prepare payment request
            const paymentRequest = {
                paymentData: paymentFormData,
                services: paymentFormData.services,
                consent: paymentFormData.consent,
                termsAccepted: paymentFormData.termsAccepted,
                total: paymentFormData.total,
                userData,
                selectedSeats,
                eventData
            };

            console.log('Submitting payment:', paymentRequest);

            // Submit to API endpoint
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentRequest)
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Payment failed');
            }

            console.log('Payment successful:', result);

            // Set order data and show success component
            setOrderData(result.order);
            setShowSuccess(true);
        } catch (error) {
            console.error('Payment error:', error);
            alert(`حدث خطأ في عملية الدفع: ${error.message}\nحاول مرة أخرى.`);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div>Loading checkout...</div>
            </div>
        );
    }

    return (
        <>
            <Header />
            <NewPaymentForm
                selectedSeats={selectedSeats}
                userData={userData}
                onPaymentSubmit={handlePaymentSubmit}
            />
            {showSuccess && orderData && (
                <PaymentSuccess 
                    orderData={orderData}
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </>
    );
};

export default CheckoutPage; 