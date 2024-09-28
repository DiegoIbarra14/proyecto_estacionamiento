export const validateEmail = (email) => {
    // Expresión regular para validar correos electrónicos
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
};
export const ValidateLenghtValue = (value, { length }) => {
    console.log("valor",length,value)
    return value.length == length
}
const isNotEmpty = (value) => value !== '';
const validateOnlyCharacter = (text) => {
    const re = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/; // Permite letras (incluyendo acentuadas) y espacios
    return re.test(text);
};
export const ListValidate = {
    isNotEmpty: isNotEmpty,
    validateEmail: validateEmail,
    ValidateLenghtValue: ValidateLenghtValue,
    validateOnlyCharacter:validateOnlyCharacter
}

export const validateFields = (fields) => {
    console.log("fie",fields)
    const errors = {};
    for (const [field, { value, rules }] of Object.entries(fields)) {
        for (const rule of rules) {
            if (!rule.validate(value, rule.argumentsToValidate)) {
                errors[field] = rule.message;
                break;
              }
        }
    }
    console.log("sasas",errors)
    return Object.keys(errors).length > 0 ? errors : true;
};
