import { z } from 'zod';

const schemaMateriaPrimaIngresos = z.object({
    cantidad: z.string({ invalid_type_error: "Ingresar cantidad total de materia prima" })
        .min(1, { message: "Ingresar cantidad total de materia prima" })
        .refine(val => val !== "0", { message: "Ingresar cantidad válida" })
    ,

    // costo_materia_prima: z.string({ invalid_type_error: "Ingresar el costo de materia prima" })
    //     .min(1, { message: "Ingresar el costo de materia prima" })
    //     .refine(val => val !== "0", { message: "Ingresar cantidad válida" }),

    fecha_emision: z.string()

        .min(1, { message: "Ingresar fecha de emisión" })
        .refine(val => !isNaN(Date.parse(val)), { message: "Ingresar fecha válida" })
        .nullable(),


    fecha_ingreso: z.string({ invalid_type_error: "Ingresar fecha de ingreso" })
        .min(1, { message: "Ingresar fecha de ingreso" })
        .refine(val => !isNaN(Date.parse(val)), { message: "Ingresar fecha válida" })
        .superRefine((data, ctx) => {

            if (new Date(data.fecha_ingreso) > new Date(data.fecha_emision)) {
                ctx.addIssue({
                    path: ["fecha_ingreso"], // Especifica el campo que tiene el error
                    message: "La fecha de ingreso no puede ser menor que la fecha de emisión.",
                });
            }
        }),

    fecha_vencimiento: z.string({ invalid_type_error: "Ingresar fecha de vencimiento" })

        .min(1, { message: "Ingresar fecha de vencimiento" })
        .refine(val => !isNaN(Date.parse(val)), { message: "Ingresar fecha válida" })
        .superRefine((data, ctx) => {
            if (data.fecha_vencimiento && new Date(data.fecha_emision) >= new Date(data.fecha_vencimiento)) {
                ctx.addIssue({
                    path: ["fecha_vencimiento"], // Especifica el campo que tiene el error
                    message: "La fecha de vencimiento no puede ser menor que la fecha de emisión.",
                });
            }
        })
        .nullable()
    ,

    lote_interno: z.string({invalid_type_error:"Ingresar lote interno"})
        .min(1, { message: "Ingresar lote interno" })
        .refine(val => val.trim() !== "", { message: "Ingresar un lote valido" })
    ,

    lote_produccion: z.string({invalid_type_error:"Ingresar Lote producción"})
        .min(1, { message: "Ingresar lote de producción" })
        .refine(val => val.trim() !== "", { message: "Ingresar un lote valido" })
    ,
    question_one:z.string({invalid_type_error:"Seleccionar"
    }),
    question_two:z.string({invalid_type_error:"Seleccionar"
    }),
});

export default schemaMateriaPrimaIngresos;
