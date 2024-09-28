import { Chart } from 'primereact/chart';
import React, { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";
import './AnalisisCliente.css';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import axios from '../../../http-common';

export const AnalisisPorCliente = () => {
  const toast = useRef(null);
  //START ANALISIS POR CLIENTE
  const [dates, setDates] = useState(null)

  //datos para enviar en un apeticion post
  const [fechaInicioFinalCliente, setFechaInicioFinalCliente] = useState('');
  const [analisisPorClienteProductos, setAnalisisPorClienteProductos] = useState([]);
  const [analisisPorClientesClientes, setAnalisisPorClientesClientes] = useState([]);

  const getAllAnalisisProductos = async () => {
    const analisis_productos = await axios.http.get("/productos/get");
    const options = analisis_productos.data.data.map(materia => ({
      name: materia.nombre,
      code: materia.id,
      id: materia.id,
      nombre: materia.nombre,
    }));
    setAnalisisPorClienteProductos(options);
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
    setAnalisisPorClientesClientes(options);
  };

  useEffect(() => {
    getAllAnalisisProductos();
    getAllAnalisisClientes();
  }, [setAnalisisPorClienteProductos, setAnalisisPorClientesClientes]);

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
        setFechaInicioFinalCliente(formattedDates);
      }
    }
    
    setDates(e.value);
  };
  

  //END ANALISIS POR CLIENTE
  //datos para enviar por la peticon post
  const [selectedProductos, setSelectedProductos] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);

  const [chartDataBarras, setChartDataBarras] = useState({});
  const [chartOptionsBarras, setChartOptionsBarras] = useState({});

  const [analisisPorClienteNombre, setAnalisisPorClienteNombre] = useState([]);
  const [analisisPorClienteCantidad, setAnalisisPorClienteCantidad] = useState([]);

  const generateChartDataAnalisisPorCliente = (nombres, cantidades) => {
    const generateRandomColorRGBA = () => {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgba(${r}, ${g}, ${b}, 0.3)`; // Opacidad del 80%
    };

    // Generar colores aleatorios basados en la cantidad de productos
    const randomColors = cantidades.map(() => generateRandomColorRGBA());
    const borderColors = randomColors.map(color => color.replace('0.3', '0.5'));

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

  const envioDatosAnalisisPorCliente = async () => {
    if (!fechaInicioFinalCliente.fechaInicio) {
      showToast("error", "Acceso Denegado", "Ingrese el filtro de Fecha Inicio");
      return;
    }
    if (!fechaInicioFinalCliente.fechaFinal) {
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
      cliente_id: selectedCliente.id,
      cliente_nombre: selectedCliente.name,
      fechaFinal: fechaInicioFinalCliente.fechaFinal,
      fechaInicio: fechaInicioFinalCliente.fechaInicio,
      producto: selectedProductos,
    }
    try {
      const response = await axios.http.post("/estadistica/bars2", datos_envio);
      const estadistica_analisis_por_cliente_labels = response.data.datasets.map(element => element.label);
      const estadistica_analisis_por_cliente_data = response.data.datasets.map(element => element.data[0]);
      setAnalisisPorClienteNombre(estadistica_analisis_por_cliente_labels);
      setAnalisisPorClienteCantidad(estadistica_analisis_por_cliente_data);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    generateChartDataAnalisisPorCliente(analisisPorClienteNombre, analisisPorClienteCantidad);
  }, [analisisPorClienteNombre, analisisPorClienteCantidad]);

  const showToast = (tipo, titulo, detalle) => {
    toast.current.show({
      severity: tipo,
      summary: titulo,
      detail: detalle,
      life: 3000,
    });
  };

  const limpiarInputs = () => {
    setFechaInicioFinalCliente('');
    setSelectedCliente(null);
    setSelectedProductos([]); 
    setDates([])
  };
  return (
    <>
      <div className="analisis__por__cliente">
      <div className="analisis__por__cliente__descripcion">
            <p className='analisis__por__cliente__texto'>Analísis por cliente</p>
          </div>
        <div className="analisis__por__cliente__contenedor__clientes">
          <div className="analisis__por__cliente__contenedor__clientes__comun analisis__por__cliente__fecha">
            <Calendar
              value={dates}
              onChange={handleDateChange}
              selectionMode="range"
              readOnlyInput
              hideOnRangeSelection
              placeholder='00/00/0000 - 00/00/0000'
            />
          </div>
          <div className="analisis__por__cliente__contenedor__clientes__comun analisis__por__cliente__cliente">
            <Dropdown value={selectedCliente} onChange={(e) => setSelectedCliente(e.value)} options={analisisPorClientesClientes} optionLabel="name"
              placeholder="Selecciona cliente" className="w-full md:w-14rem" />
          </div>
          <div className="analisis__por__cliente__contenedor__clientes__comun analisis__por__cliente__producto">
            <MultiSelect value={selectedProductos} onChange={(e) => setSelectedProductos(e.value)} options={analisisPorClienteProductos} optionLabel="name" display="chip"
              placeholder="Selecciona Productos" maxSelectedLabels={3} className="" />

          </div>
          <div className="analisis__por__cliente__contenedor__clientes__comun analisis__por__cliente__button__1">
            <Button onClick={envioDatosAnalisisPorCliente} label="Graficar" severity="success" style={{ backgroundColor: '#06749E', border: 'none' }} />
          </div>
          <div className="analisis__por__cliente__contenedor__clientes__comun analisis__por__cliente__button__2">
            <Button onClick={limpiarInputs} label="Limpiar" severity="info" style={{ backgroundColor: '#06749E', border: 'none' }} />
          </div>
        </div>
        <Chart type="bar" data={chartDataBarras} options={chartOptionsBarras} />
      </div>
      <Toast ref={toast} />
    </>
  )
}