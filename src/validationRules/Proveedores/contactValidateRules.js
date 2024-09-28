import { ListValidate } from "../../helpers/ValidateData";

export const contactValidationRules = {
    contacto: [
        { validate: ListValidate.isNotEmpty, message: 'Debe ingresar el nombre del contacto' },
        { validate: ListValidate.validateOnlyCharacter, message: 'El nombre del contacto solo debe contener letras' },
    ],
    telefono: [
        { validate: ListValidate.isNotEmpty, message: 'Debe ingresar el número de teléfono' },
        {
            validate: ListValidate.ValidateLenghtValue, message: 'El telefono debe contener 9 digitos'
            , argumentsToValidate: { length: 9 }
        }

    ],
    correo: [
        { validate: ListValidate.validateEmail, message: 'Debe ingresar un correo correcto' },
    ],
    comentario: [
        { validate: ListValidate.isNotEmpty, message: 'Debe ingresar un comentario' },
    ],
};