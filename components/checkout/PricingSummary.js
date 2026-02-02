'use client';
import { useState, useEffect } from 'react';

const PricingSummary = ({ 
    ticketPrice = 4754.81, 
    refundGuarantee = 475.48, 
    whatsappService = 27.97, 
    serviceFee = 52.58, 
    vatRate = 5,
    currency = 'EGP',
    services = { refundGuarantee: true, whatsappNotifications: true }
}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [localServices, setLocalServices] = useState(services);

    // Update local state when props change
    useEffect(() => {
        setLocalServices(services);
    }, [services]);

    const handleServiceChange = (service) => {
        const newServices = {
            ...localServices,
            [service]: !localServices[service]
        };
        setLocalServices(newServices);
        // Notify parent component of changes if needed
        if (typeof services.onChange === 'function') {
            services.onChange(newServices);
        }
    };

    const calculateSubtotal = () => {
        let subtotal = ticketPrice + serviceFee;
        if (localServices.refundGuarantee) subtotal += refundGuarantee;
        if (localServices.whatsappNotifications) subtotal += whatsappService;
        return subtotal;
    };

    const subtotal = calculateSubtotal();
    const vatAmount = (subtotal * vatRate) / 100;
    const total = subtotal + vatAmount;

    return (
        <div className="summary-block" data-summary-block-container="">
            <div className="summary-block-header">
                الملخص{' '}
                <button
                    type="button"
                    className="summary-block-toggle"
                    onClick={() => setIsExpanded(!isExpanded)}
                    data-toggle-summary-button=""
                >
                    <span
                        data-toggle-summary-button-close=""
                        className={isExpanded ? 'hidden' : ''}
                    >
                        <svg className="icon icon-arrowhead-down">
                            <use xlinkHref="#svg-icon-arrowhead-down"></use>
                        </svg>
                    </span>
                    <span
                        data-toggle-summary-button-open=""
                        className={!isExpanded ? 'hidden' : ''}
                    >
                        <svg className="icon icon-arrowhead-up">
                            <use xlinkHref="#svg-icon-arrowhead-up"></use>
                        </svg>
                    </span>
                </button>
            </div>
            
            {isExpanded && (
                <>
                    <table data-summary-block-content="">
                        <tbody>
                            <tr>
                                <td>التذاكر</td>
                                <td>{ticketPrice.toLocaleString()} {currency}</td>
                            </tr>
                            <tr data-order-checkout-selected-service="50815">
                                <td>
                                    <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={localServices.refundGuarantee}
                                            onChange={() => handleServiceChange('refundGuarantee')}
                                            style={{ cursor: 'pointer' }}
                                        />
                                        ضمان استرجاع المبلغ
                                    </label>
                                </td>
                                <td>{refundGuarantee.toLocaleString()} {currency}</td>
                            </tr>
                            <tr data-order-checkout-selected-service="50818">
                                <td>
                                    <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={localServices.whatsappNotifications}
                                            onChange={() => handleServiceChange('whatsappNotifications')}
                                            style={{ cursor: 'pointer' }}
                                        />
                                        ارسال الرسائل عبر الواتس اب
                                    </label>
                                </td>
                                <td>{whatsappService.toLocaleString()} {currency}</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <table data-order-amount-fee-content="">
                        <tbody>
                            <tr>
                                <td>Service Fee</td>
                                <td>{serviceFee.toLocaleString()} {currency}</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <table data-payment-gateway-fee-content=""></table>
                    
                    <table data-summary-block-content="">
                        <tbody>
                            <tr>
                                <td>الإجمالي بدون ضريبة القيمة المضافة</td>
                                <td data-order-checkout-total-before-vat="">
                                    {subtotal.toLocaleString()} {currency}
                                </td>
                            </tr>
                            <tr>
                                <td>ضريبة القيمة المضافة {vatRate}%</td>
                                <td data-order-checkout-vat="">
                                    {vatAmount.toLocaleString()} {currency}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </>
            )}
            
            <div className="summary-block-end-content"></div>
        </div>
    );
};

export default PricingSummary; 