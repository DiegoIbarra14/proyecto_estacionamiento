import { InputText } from 'primereact/inputtext';
import React from 'react'

const InputDecimal = ({ style, className, name, value, onChange, keyfilter, autoComplete, maxLength, minLength, valueError, placeholder, containerClass }) => {

    const validateValue = (value) => {
        const regex = /^(?!0\d)(\d+(\.\d{0,2})?|0?\.\d{0,2})?$/

        return regex.test(value);
    };

    const removeLeadingZero = (value) => {
        return value.length > 1 && value.startsWith('0') ? value.substring(1) : value;
    };

    const createNewEvent = (originalEvent, newValue) => {
        return { ...originalEvent, target: { ...originalEvent.target, value: newValue } };
    };

    const handleChange = (e) => {
        let value = e.target.value;

        value = removeLeadingZero(value);
        if (validateValue(value)) {
            console.log("va",value)
            const newEvent = createNewEvent(e, value);
            onChange(newEvent);
        }
    };
    return (
        <div className={`${containerClass} relative`} >
            <InputText style={style} placeholder={placeholder}
                name={name} value={value} onChange={handleChange} keyfilter={keyfilter}
                autoComplete={autoComplete} maxLength={maxLength} className={`${className}`} minLength={minLength}
            />
            {/* {valueError && <span className='block' style={{ color: "red" }}>{valueError}</span>} */}
            {valueError != null && <p className='block' style={{ color: "#e24c4c", position: "absolute", bottom: "-35px" }}>{valueError}</p>}



        </div>
    )
}

export default InputDecimal
