import React, { useState } from 'react'
import { ZodError } from 'zod';

const useValidation = (schema) => {
    const [errors, setErrors] = useState({});
    const validate = (data) => {
        try {
            schema.parse(data);
            setErrors({}); 
            return true;
        } catch (e) {
            if (e instanceof ZodError) {
                const newErrors = e.errors.reduce((acc, err) => {
                    acc[err.path[0]] = err.message;
                    return acc;
                }, {});
                setErrors(newErrors);
            } else {
                console.error("Error inesperado:", e);
            }
            return false;
        }
    };
    const clearFieldError = (field) => {
       setErrors(prevErrors => {
        if (prevErrors[field]) {
            const { [field]: removed, ...rest } = prevErrors;
            return rest;
        }
        return prevErrors;
    });
    };
    const clearAllFieldsError=()=>{
        setErrors({})
    }
   
    return { errors, validate, clearFieldError,clearAllFieldsError }; 
}

export default useValidation
