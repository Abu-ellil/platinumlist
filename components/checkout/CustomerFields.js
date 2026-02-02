'use client';
import { useState } from 'react';

const CustomerFields = ({ onConsentChange }) => {
    const [consentChecked, setConsentChecked] = useState(false);

    const handleConsentChange = (e) => {
        const checked = e.target.checked;
        setConsentChecked(checked);
        onConsentChange && onConsentChange(checked);
    };

    return (
        <div data-cf-before-purchase-form="">
            <div className="form_element form_element-disclaimer filled" data-validate-container="">
                <div className="form_element-content">
                    <label className="form_element-option">
                        <input
                            type="checkbox"
                            name="field_28528[]"
                            id="field_28528-checked"
                            value="checked"
                            className="form_element-checkbox filled"
                            data-customer-field="28528"
                            size="1"
                            extended="1"
                            form="checkout_form"
                            checked={consentChecked}
                            onChange={handleConsentChange}
                            data-validate='{"invalidClass":"invalid","validClass":"valid","filters":[],"validators":[]}'
                        />
                    </label>
                    <ul data-validate-messages="" className="errors" style={{ marginTop: '10px' }}>
                        <li></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CustomerFields; 