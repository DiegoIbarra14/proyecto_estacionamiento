import { Chart } from 'primereact/chart';
import React, { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";
import './AnalisisPorProductos.css';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import axios from '../../../http-common';

export const AnalisisPorProducto = () => {
  const toast = useRef(null);
  //START ANALISIS POR CLIENTE
  const [datesProducto, setDatesProducto] = useState(null)

  //datos para enviar en un apeticion post
  const [fechaInicioFinalProducto, setFechaInicioFinalProducto] = useState('');
  const [analisisPorProductosProductos, setAnalisisPorProductosProductos] = useState([]);
  const [analisisPorProductosClientes, setAnalisisPorProductosClientes] = useState([]);

  const getAllAnalisisProductos = async () => {
    const analisis_productos = await axios.http.get("/productos/get");
    const options = analisis_productos.data.data.map(materia => ({
      name: materia.nombre,
      code: materia.id,
      nombre: materia.nombre,
      id: materia.id
    }));
    setAnalisisPorProductosProductos(options);
  };

  const getAllAnalisisClientes = async () => {
    const analisis_clientes = await axios.http.get("/clientes/get")
    const options = analisis_clientes.data.data.map(materia => ({
      name: materia.razon_social,
      code: materia.id,
      correo: materia.correo,
      id: materia.id,
      locales: materia.locales,
      numero_documento: materia.numero_documento,
      razon_social: materia.razon_social,
      telefono: materia.telefono,
      tipo_documento: materia.tipo_documento,
      tipo_documento_id: materia.tipo_documento_id

    }));
    setAnalisisPorProductosClientes(options);
  };

  useEffect(() => {
    getAllAnalisisProductos();
    getAllAnalisisClientes();
  }, [setAnalisisPorProductosProductos, setAnalisisPorProductosClientes]);

  const handleDateChange = (e) => {
    const selectedDates = e.value;
    
    if (selectedDates) {
      const formattedDates = {};
  
      if (selectedDates[0]) {
        const startDate = selectedDates[0];
        const formattedStartDate = startDate.toISOString().split('T')[0];
        formattedDates.fechaInicio = formattedStartDate;
      }
  
      if (selectedDates[1]) {
        const endDate = selectedDates[1];
        const formattedEndDate = endDate.toISOString().split('T')[0];
        formattedDates.fechaFinal = formattedEndDate;
      }
  
      if (Object.keys(formattedDates).length > 0) {
        setFechaInicioFinalProducto(formattedDates);
      }
    }
    
    setDatesProducto(e.value);
  };

  //END ANALISIS POR PRODUCTO
  const [selectedCities, setSelectedCities] = useState(null);

  //datos para enviar por la peticon post
  const [selectedProductos, setSelectedProductos] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);

  const [chartDataBarras, setChartDataBarras] = useState({});
  const [chartOptionsBarras, setChartOptionsBarras] = useState({});
  //RESPUESTA CLIENTES PARA LA GRAFICA

  const [analisisPorProductoNombre, setAnalisisPorProductoNombre] = useState([]);
  const [analisisPorProductoCantidad, setAnalisisPorProductoCantidad] = useState([]);


  const generateChartDataAnalisisPorProducto = (nombres, cantidades) => {

    const generateRandomColorRGBA = () => {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgba(${r}, ${g}, ${b}, 0.3)`; // Opacidad del 80%
    };

    // Generar colores aleatorios basados en la cantidad de productos
    const randomColors = cantidades.map(() => generateRandomColorRGBA());
    const borderColors = randomColors.map(color => color.replace('0.3', '0.6'));

    const data = {
      labels: nombres,
      datasets: [
        {
          labels: 'sales',
          data: cantidades,
          backgroundColor: randomColors,
          borderColor: borderColors,
          borderWidth: 3,
          borderRadius: 10
        }
      ]
    };
    const options = {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    setChartDataBarras(data);
    setChartOptionsBarras(options);

  }

  const envioDatosAnalisisPorProducto = async () => {
    if (!fechaInicioFinalProducto.fechaInicio) {
      showToast("error", "Acceso Denegado", "Ingrese el filtro de Fecha Inicio");
      return;
    }
    if (!fechaInicioFinalProducto.fechaFinal) {
      showToast("error", "Acceso Denegado", "Ingrese el filtro de Fecha Final");
      return;
    }
    if (!selectedCliente) {
      showToast("error", "Acceso Denegado", "Ingrese el filtro de Cliente");
      return;
    }
    if (!selectedProductos) {
      showToast("error", "Acceso Denegado", "Ingrese el filtro de Prodcuto");
      return;
    }
    const datos_envio = {
      cliente: selectedCliente,
      fechaFinal: fechaInicioFinalProducto.fechaFinal,
      fechaInicio: fechaInicioFinalProducto.fechaFinal,
      producto: selectedProductos,
      producto_nombre: selectedProductos.nombre,
      producto_id: selectedProductos.id
    }
    try {
      const response = await axios.http.post("/estadistica/bars", datos_envio);
      const estadistica_analisis_por_producto_labels = response.data.datasets.map(element => element.label);
      const estadistica_analisis_por_producto_data = response.data.datasets.map(element => element.data[0]);
      setAnalisisPorProductoNombre(estadistica_analisis_por_producto_labels);
      setAnalisisPorProductoCantidad(estadistica_analisis_por_producto_data);

    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    generateChartDataAnalisisPorProducto(analisisPorProductoNombre, analisisPorProductoCantidad);
  }, [analisisPorProductoNombre, analisisPorProductoCantidad]);

  const showToast = (tipo, titulo, detalle) => {
    toast.current.show({
      severity: tipo,
      summary: titulo,
      detail: detalle,
      life: 3000,
    });
  };

  const limpiarInputs = () => {
    setFechaInicioFinalProducto('');
    setSelectedCliente(null);
    setSelectedProductos([]); 
    setDatesProducto([])
  };
  return (
    <>
      <div className="analisis__por__producto">
        <div className="analisis__por__producto__sub__producto">
          <div className="analisis__por__producto__descripcion">
            <p className='analisis__por__producto__texto'>Analísis por Producto</p>
          </div>
          <div className="analisis__por__producto__contenedor__productos">
            <div className="analisis__por__producto__contenedor__productos__comun analisis__por__producto__fecha">
              <Calendar
                value={datesProducto}
                onChange={handleDateChange}
                selectionMode="range"
                readOnlyInput
                hideOnRangeSelection
                placeholder='00/00/0000 - 00/00/0000'
                dateFormat="dd-mm-yy"
              />
            </div>
            <div className="analisis__por__producto__contenedor__productos__comun analisis__por__producto__cliente">
              <Dropdown value={selectedProductos} onChange={(e) => setSelectedProductos(e.value)} options={analisisPorProductosProductos} optionLabel="name"
                placeholder="Selecciona Producto" className="w-full md:w-14rem" />
            </div>
            <div className="analisis__por__producto__contenedor__productos__comun analisis__por__producto__producto">
              <MultiSelect value={selectedCliente} onChange={(e) => setSelectedCliente(e.value)} options={analisisPorProductosClientes} optionLabel="name" display="chip"
                placeholder="Selecciona Clientes" maxSelectedLabels={3} />
            </div>

            <div className="analisis__por__producto__contenedor__productos__comun analisis__por__producto__button__1">
              <Button onClick={envioDatosAnalisisPorProducto} label="Graficar" severity="success" style={{ backgroundColor: '#06749E', border: 'none' }} />

            </div>
            <div className="analisis__por__producto__contenedor__productos__comun analisis__por__producto__button__2">
              <Button onClick={limpiarInputs} label="Limpiar" severity="info" style={{ backgroundColor: '#06749E', border: 'none' }} />
            </div>
          </div>
          <Chart type="bar" data={chartDataBarras} options={chartOptionsBarras} />
        </div>
      </div>
      <Toast ref={toast} />
    </>
  )
}
