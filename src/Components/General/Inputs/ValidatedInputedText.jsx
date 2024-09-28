
import { InputText } from 'primereact/inputtext'
import React from 'react'


const ValidatedInputedText = ({ style, className, name, value, onChange, keyfilter, autoComplete, maxLength, minLength, valueError, placeholder,containerClass }) => {
    return (
      
            <div className={containerClass} >
                <InputText  style={style} placeholder={placeholder}
                    name={name} value={value} onChange={onChange} keyfilter={keyfilter}
                    autoComplete={autoComplete} maxLength={maxLength} className={`${className} ${valueError?"p-invalid":""}`} minLength={minLength}
                    
                    />

                {valueError && <span className='block' style={{ color: "red"}}>{valueError}</span>}

            </div>



    )
}

export default ValidatedInputedText
