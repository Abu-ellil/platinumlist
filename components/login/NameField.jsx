const NameField = ({ value, onChange, error }) => {
    return (
        <div className={`pl-kit-form-text pl-kit-form-text--big ${error ? 'pl-kit-form-text--invalid' : ''}`} data-validate-container="">
            <div className="pl-kit-form-text__content" data-pl-kit-text-content="">
                <div className="pl-kit-form-text__content-inner">
                    <input 
                        type="text" 
                        name="name_full" 
                        id="Form_QuickOrder_StepTwo-name_full" 
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="pl-kit-form-text__input" 
                        placeholder=" " 
                        data-pl-kit-text-input=""
                        data-autofocus=""
                    />
                    <label htmlFor="Form_QuickOrder_StepTwo-name_full" className="pl-kit-form-text__label required">
                        الاسم بالكامل
                    </label>
                </div>
            </div>
            {error && (
                <ul data-validate-messages="" className="pl-kit-form-text__errors">
                    <li>{error}</li>
                </ul>
            )}
        </div>
    );
};

export default NameField; 