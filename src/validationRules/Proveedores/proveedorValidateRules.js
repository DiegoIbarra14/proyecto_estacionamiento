import { ListValidate } from "../../helpers/ValidateData";

export const proveedorValidationRules = (documentLength) => (
    {
        tipo_documento_id: [
            { validate: ListValidate.isNotEmpty, message: '"Debe seleccionar un tipo de documento"' }

        ],
        numero_documento: [
            { validate: ListValidate.isNotEmpty, message: '"Debe ingresar un numero de documento"' },
            { validate: ListValidate.ValidateLenghtValue, message: `El documento debe contener ${documentLength} digitos`, argumentsToValidate: { length: documentLength } }
        ],
        razon_social: [
            { validate: ListValidate.isNotEmpty, message: '"Debe ingresar una razon social"' }

        ],
        direccion: [
            { validate: ListValidate.isNotEmpty, message: '"Debe ingresar una direccion"' }

        ]

    }
);
