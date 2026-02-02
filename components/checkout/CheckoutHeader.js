'use client';
import { useRouter } from 'next/navigation';

const CheckoutHeader = ({ backUrl = '/' }) => {
    const router = useRouter();

    const handleBack = () => {
        router.push(backUrl);
    };

    return (
        <div className="clearfix">
            <div className="checkout-header">
                <a className="checkout-back" href="javascript:void(0)" onClick={handleBack}>
                    <svg className="icon icon-arrow-left-rounded">
                        <use xlinkHref="#svg-icon-arrow-left-rounded"></use>
                    </svg>
                </a>
                <div className="checkout-header-title">الدفع</div>
            </div>
        </div>
    );
};

export default CheckoutHeader; 