import React, { useState, useEffect, useRef } from "react";
import { Line } from 'react-chartjs-2';
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import axios from '../../http-common';
import { Toast } from "primereact/toast";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const GraficoControl = () => {
  const toast = useRef(null);

  //const mesesGraficoControl = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"];
  // const valoresObservados = [65, 59, 80, 81, 56, 55, 50, 45, 50, 55, 40, 55];
  // const limiteSuperiorGraficoControl = [80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80];
  // const limiteInferiorGraficoControl = [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50];
  // const mediaGraficoControl = [65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65];

  const [mesesGraficoControl, setMesesGraficoControl] = useState([]);
  const [valoresObservados, setValoresObservados] = useState([]);
  const [limiteSuperiorGraficoControl, setLimiteSuperiorGraficoControl] = useState([]);
  const [limiteInferiorGraficoControl, setLimiteInferiorGraficoControl] = useState([]);
  const [mediaGraficoControl, setMediaGraficoControl] = useState([]);

  useEffect(() => {
    getProductosGraficoControl();

  }, []);
  // Datos de ejemplo


  const data = {
    labels: mesesGraficoControl,
    datasets: [
      {
        label: 'Valores Observados',
        data: valoresObservados,
        fill: false,
        borderColor: '#03A5D1',
        tension: 0.1
      },
      {
        label: 'Límite Superior de Control (UCL)',
        data: limiteSuperiorGraficoControl,
        fill: false,
        borderColor: '#ED6B6E',
        borderDash: [5, 5],
        tension: 0.1
      },
      {
        label: 'Límite Inferior de Control (LCL)',
        data: limiteInferiorGraficoControl,
        fill: false,
        borderColor: '#ED6B6E',
        borderDash: [5, 5],
        tension: 0.1
      },
      {
        label: 'Media',
        data: mediaGraficoControl,
        fill: false,
        borderColor: '#03A5D1',
        borderDash: [5, 5],
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      },

    }
  };


  //logica para el drpdouw
  const [selectedGraficoControlProducto, setSelectedGraficoControlProducto] = useState(null);
  const [optionGraficoControlProductos, setOptionSelectedGraficoControlProductos] = useState([]);

  //logica para el inputText
  const [textLimiteSuperior, setTextLimiteSuperior] = useState('');
  const [textLimiteInferior, setTextLimiteInferior] = useState('');

  const getProductosGraficoControl = async () => {
    try {
      const grafico_control_producto = await axios.http.get("/estadistica/products-finished");
      const options = grafico_control_producto.data.data
        .filter(materia => materia.stock !== 0)
        .map(materia => ({
          name: materia.nombre,
          code: materia.id,
          cantidad: materia.stock,
        }));
      setOptionSelectedGraficoControlProductos(options);
    } catch (error) {
      console.error("Error al obtener los datos de materia prima:", error);
    }
  }

  const getDatosGraficoControl = async () => {

    if (!selectedGraficoControlProducto) {
      showToast("error", "Acceso Denegado", "Ingrese el filtro de un producto.");
      return;
    }

    if (!textLimiteSuperior) {
      showToast("error", "Acceso Denegado", "Ingrese el filtro del límite superior.");
      return;
    }

    if (!textLimiteInferior) {
      showToast("error", "Acceso Denegado", "Ingrese el filtro del límite inferior.");
      return;
    }

    if (parseInt(textLimiteInferior) > parseInt(textLimiteSuperior)) {
      showToast("error", "Acceso Denegado", "El LCS no puede se mayor que LCI.");
      return;
    }

    const id_producto = selectedGraficoControlProducto.code;
    try {
      const respuesta_grafico_control = await axios.http.get(`estadistica/produccion/merma/anual/${id_producto}`);

      console.log(respuesta_grafico_control)

      const meses = Object.keys(respuesta_grafico_control.data);

      const codigo_productos = meses.map(mes => respuesta_grafico_control.data[mes].cod_prod);

      const cantidadesMerma = meses.map(mes => respuesta_grafico_control.data[mes].cant_merma);

      const sumaMerma = cantidadesMerma.reduce((total, cantidad) => total + cantidad, 0);

      const promedioMerma = sumaMerma / cantidadesMerma.length;

      const promedioArray = new Array(meses.length).fill((parseInt(textLimiteSuperior, 10) + parseInt(textLimiteInferior, 10)) / 2);

      const limite_superior = new Array(meses.length).fill(parseInt(textLimiteSuperior, 10));

      const limite_inferior = new Array(meses.length).fill(parseInt(textLimiteInferior, 10));

      setMesesGraficoControl(codigo_productos);
      setValoresObservados(cantidadesMerma);
      setLimiteSuperiorGraficoControl(limite_superior);
      setLimiteInferiorGraficoControl(limite_inferior);
      setMediaGraficoControl(promedioArray);
      limpiarInput();
    } catch (error) {
      console.log(error);
    }

  }
  const showToast = (tipo, titulo, detalle) => {
    toast.current.show({
      severity: tipo,
      summary: titulo,
      detail: detalle,
      life: 3000,
    });
  };

  const limpiarInput = () => {
    setTextLimiteSuperior('');
    setTextLimiteInferior('');
  }

  return (
    <>
      <Toast ref={toast} />
      <div className="chart-control__header">
        <p className="chart__title">Gráfico de Control</p>
        <div className="chart-control__filter">
          <div className="">
            <span className="mr-2 text-700 font-medium">Producto</span>
            <Dropdown value={selectedGraficoControlProducto}
              onChange={(e) => setSelectedGraficoControlProducto(e.value)}
              options={optionGraficoControlProductos} optionLabel="name"
              placeholder="Selecciona un producto"
              className="w-full md:w-14rem mr-2" checkmark={true} highlightOnSelect={false} />
          </div>
          <div className="md:full ">
            <span className="mr-2 text-700 font-medium ">LCS</span>
            <InputText value={textLimiteSuperior}
              onChange={(e) => setTextLimiteSuperior(e.target.value)}
              placeholder="0" className="chart-control__filter__input"
              keyfilter="int" 
              style={{ width: '100px' }}
              />
          </div>
          <div>
            <span className="mx-2 text-700 font-medium">LCI</span>
            <InputText value={textLimiteInferior}
              onChange={(e) => setTextLimiteInferior(e.target.value)}
              placeholder="0" className="chart-control__filter__input" keyfilter="int"
              style={{ width: '100px' }} />
          </div>



          <Button onClick={getDatosGraficoControl} label="Analizar" className="btn chart-control__filter__btn-filter" />
          
        </div>
      </div>
      <Line data={data} options={options} />
    </>
  );
};
