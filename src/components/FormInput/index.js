import classNames from 'classnames/bind';
import { useState } from 'react';
import styles from './FormInput.module.scss';

const cx = classNames.bind(styles);

function FormInput({ label, errorMessage, onChange, ...inputProps }) {
    const [focused, setFocused] = useState(false);
    const handleFocus = () => {
        setFocused(true);
    };
    const handleBlur = () => {
        setFocused(false);
    };

    // const inputInvalid = document.querySelector(
    //     'input:invalid[focused="true"]',
    // );

    // console.log(inputInvalid);

    // console.log('input');

    return (
        <div className={cx('form_group')}>
            <label>{label}</label>
            <input
                {...inputProps}
                onChange={onChange}
                focused={focused.toString()}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
            {errorMessage && (
                <>
                    <span className={cx('error_message')}>{errorMessage}</span>
                </>
            )}
        </div>
    );
}

export default FormInput;
