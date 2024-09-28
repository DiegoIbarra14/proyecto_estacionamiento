const materiaPrimaMapper = {
    toViewModel(materiaPrimaDataAPI) {
      const cantAlarma = materiaPrimaDataAPI.cantidad - materiaPrimaDataAPI.cantidad_minima;
      const alarm = cantAlarma <= 0;
      return {
        id:materiaPrimaDataAPI?.id,
        nombre: materiaPrimaDataAPI?.nombre_materia,
        cantidad: materiaPrimaDataAPI?.cantidad?materiaPrimaDataAPI.cantidad.toString():"",
        cantidad_minima: materiaPrimaDataAPI?.cantidad_minima.toString(), // Convertir a string
        cantAlarma: cantAlarma,
        alarm: alarm,
        documento_calidad: materiaPrimaDataAPI?.documento_calidad, // Corregido: Usar documento_calidad
        nombre_materia: materiaPrimaDataAPI?.nombre_materia, // Nombre de materia prima
        presentacion: materiaPrimaDataAPI?.presentacion , // Corregido: Acceder a la propiedad correcta
        presentacion_id: materiaPrimaDataAPI?.presentacion_id, // ID de presentación
        unidad_medida: materiaPrimaDataAPI?.unidad_medida , // Corregido: Acceder a la propiedad correcta
        unidad_medida_id: materiaPrimaDataAPI?.unidad_medida_id // ID de unidad de medida
      };
    }
  };
  
  export default materiaPrimaMapper;