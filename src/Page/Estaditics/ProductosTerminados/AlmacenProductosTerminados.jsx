import React, { useState, useEffect } from "react";
import { Chart } from 'primereact/chart';
import axios from '../../../http-common';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import "./AlmacenProductosTerminados.css"

export const AlmacenProductosTerminados = ({ titulo }) => {
    const [visibleProductosTerminados, setVisibleProductosTerminados] = useState(false);

    const [chartDataProductosTerminados, setChartDataProductosTerminados] = useState({});
    const [chartOptionsProductosTerminados, setChartOptionsProductosTerminados] = useState({});
    const [selectedProductosTerminados, setProductosTerminados] = useState(null);

    const [estadisticaProductosTerminadosNombre, setEstadisticaProductosTerminadosNombre] = useState([]);
    const [estadisticaProductosTerminadosCantidad, setEstadisticaProductosTerminadosCantidad] = useState([]);
    const [estadisticaProductoTerminado, setEstadisticaProductoTerminado] = useState([]);

    const [loading, setLoading] = useState(true);

    const handleClickProductosTerminados = () => {
        setVisibleProductosTerminados(true);
    };

    const handleCloseProductosTerminados = () => {
        setVisibleProductosTerminados(false);
    };

    const generateChartDataProductosTerminados = (nombres, cantidades) => {
        const generateRandomColorRGBA = () => {
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            return `rgba(${r}, ${g}, ${b}, 0.3)`; // Opacidad del 80%
        };

        const randomColors = cantidades.map(() => generateRandomColorRGBA());
        const borderColors = randomColors.map(color => color.replace('0.3', '0.6'));

        const data = {
            labels: nombres,
            datasets: [
                {
                    data: cantidades,
                    backgroundColor: randomColors,
                    hoverBackgroundColor: borderColors,
                    borderColor: borderColors,
                }
            ]
        };

        const options = {
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                // title: {
                //     display: true,
                //     text: titulo,
                //     color: '#006389',
                //     font: {
                //         size: 20
                //     },
                //     padding: {
                //         top: 10,
                //         bottom: 30
                //     }
                // }
            },
            maintainAspectRatio: false,
            responsive: true
        };

        setChartDataProductosTerminados(data);
        setChartOptionsProductosTerminados(options);
    };

    useEffect(() => {
        getEstadisticaProductosTerminados();
    }, []);

    useEffect(() => {
        if (estadisticaProductosTerminadosNombre.length > 0 && estadisticaProductosTerminadosCantidad.length > 0) {
            generateChartDataProductosTerminados(estadisticaProductosTerminadosNombre, estadisticaProductosTerminadosCantidad);
            setLoading(false);
        }
    }, [estadisticaProductosTerminadosNombre, estadisticaProductosTerminadosCantidad]);

    const getEstadisticaProductosTerminados = async () => {
        try {
            const estadistica_producto_terminado = await axios.http.get("/estadistica/products-finished");

            const options = estadistica_producto_terminado.data.data.map(materia => ({
                code: materia.id,
                name: materia.nombre,
                cantidad: materia.stock,
            }));
            setEstadisticaProductoTerminado(options);

            const estadistica_producto_terminado_nombre = estadistica_producto_terminado.data.data.map(element => element.nombre);
            const estadistica_producto_terminado_cantidad = estadistica_producto_terminado.data.data.map(element => element.stock);
            setEstadisticaProductosTerminadosNombre(estadistica_producto_terminado_nombre);
            setEstadisticaProductosTerminadosCantidad(estadistica_producto_terminado_cantidad);

        } catch (error) {
            console.error("Error al obtener los datos de materia prima:", error);
        }
    }

    const almacenMateriasPrimas = () => {
        const nombre = selectedProductosTerminados.map((element) => element.name);
        const cantidad = selectedProductosTerminados.map((element) => element.cantidad);
        if (cantidad.length === 0) {
            getEstadisticaProductosTerminados();
        }
        setEstadisticaProductosTerminadosNombre(nombre);
        setEstadisticaProductosTerminadosCantidad(cantidad);
        handleCloseProductosTerminados();

    };

    useEffect(() => {
        generateChartDataProductosTerminados(estadisticaProductosTerminadosNombre, estadisticaProductosTerminadosCantidad);
    }, [estadisticaProductosTerminadosNombre, estadisticaProductosTerminadosCantidad]);


    return (
        <>
            <div className="card_general-estadistica-input" style={{ position: 'absolute', top: 0, right: 0, display: 'flex', zIndex: 200 }}>
                <Button icon="pi pi-ellipsis-h" onClick={handleClickProductosTerminados} style={{ padding: '0.30rem 0.4rem', fontSize: '0.9rem', backgroundColor: 'white', borderColor: '#D9D9D9', color: '#D9D9D9' }} />
            </div>

            <div className="h-full">
                {loading ? (
                    <p>No hay estadísticas disponibles en este momento.</p>
                ) : (
                    <div className="chart-container ">
                        <p className="chart-title">{titulo}</p>
                        <div className="body-chart">
                            <Chart type="doughnut" data={chartDataProductosTerminados} options={chartOptionsProductosTerminados} className="chart-alm-prd-terminados" />
                        </div>


                    </div>

                )}
            </div>
            <Dialog
                visible={visibleProductosTerminados}
                modal
                onHide={handleCloseProductosTerminados}
                style={{ width: '400px', height: '300px' }}
            >
                <div>
                    <div className="field" style={{ marginBottom: '50px' }}>
                        <label htmlFor="startDate" className="block">
                            Selecciona los primeros Datos*
                        </label>
                        <MultiSelect value={selectedProductosTerminados} onChange={(e) => setProductosTerminados(e.value)} options={estadisticaProductoTerminado} optionLabel="name" filter placeholder="Selecciona producto" maxSelectedLabels={3} className="w-full md:w-20rem" />
                    </div>
                    <div className="field" style={{ display: 'flex', gap: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <Button label="Cancelar" icon="pi pi-align-center" style={{ backgroundColor: 'orange', border: 'none' }} onClick={handleCloseProductosTerminados} />
                        <Button label="Aplicar" icon="pi pi-align-center" style={{ backgroundColor: '#04638A', border: 'none' }} onClick={almacenMateriasPrimas} />
                    </div>
                </div>
            </Dialog>
        </>
    );
};
