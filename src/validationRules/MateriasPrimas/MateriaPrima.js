import { z } from "zod"
const schemaMateriaPrima = z.object({
    nombre_materia: z.string().min(1, "Ingregar el nombre de la materia"),
    unidad_medida_id: z.number()
        .nullable()
        .refine(val => Number.isInteger(val), {
            message: "Seleccionar unidad de medida"
        })
        .refine(val => val !== 0, {
            message: "El número no puede ser cero.",
        }),
    presentacion_id: z.number().nullable()
        .refine(val => Number.isInteger(val), {
            message: "Seleccionar unidad una presentación"
        }),
    cantidad_minima: z.string().min(1, "Ingresar cantidad minimi de materia")
})


export default schemaMateriaPrima