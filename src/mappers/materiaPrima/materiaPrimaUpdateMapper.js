import { convertToFormData } from "../../helpers/ConverteToFormData"



const materiaPrimaSubmitMapper = (materiaPrima) => {
    let data = {
        "unidad_medida": materiaPrima.unidad_medida,
        "nombre_materia": materiaPrima.nombre_materia,
        "unidad_medida_id": materiaPrima.unidad_medida_id,
        "presentacion_id": materiaPrima.presentacion_id,
        "cantidad": materiaPrima.cantidad,
        "cantidad_minima": materiaPrima.cantidad_minima,
        "documento_calidad":materiaPrima.documento_calidad,
    }

    return convertToFormData(data)


}
export default materiaPrimaSubmitMapper
