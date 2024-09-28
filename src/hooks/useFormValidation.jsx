import React, { useState } from 'react'
import { validateFields } from '../helpers/ValidateData'

const useFormValidation = (initialValues, validationRules) => {
    const [values, setValues] = useState(initialValues)
    const [errors, setErrors] = useState({})
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    const cleanValues = () => {
        setErrors({})
        setValues(initialValues)
    }

    const validate = () => {
        const fieldsToValidate = Object.keys(validationRules).reduce((acc, key) => {
            acc[key] = {
                value: values[key],
                rules: validationRules[key],
            };
            return acc;
        }, {});
        const error = validateFields(fieldsToValidate);
        if (error == true) {
            return true;
        } else if (error) {
            setErrors((prev) => ({ ...prev, ...error }));
            return false;
        }

    };
    return { values, handleChange, validate, errors, cleanValues, setErrors, setValues };

}

export default useFormValidation
