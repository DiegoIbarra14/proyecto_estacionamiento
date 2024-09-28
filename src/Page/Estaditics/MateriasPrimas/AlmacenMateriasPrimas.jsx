import React, { useState, useEffect } from "react";
import { Chart } from 'primereact/chart';
import axios from '../../../http-common';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import './AlmacenMateriaPrima.css';

export const AlmacenMateriasPrimas = ({ titulo }) => {
    const [visibleMateriasPrimas, setVisibleMateriasPrimas] = useState(false);
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [selectedMateriasPrimas, setMateriasPrimas] = useState(null);
    const [estadisticaMateriaPrimaNombre, setEstadisticaMateriaPrimaNombre] = useState([]);
    const [estadisticaMateriaPrimaCantidad, setEstadisticaMateriaPrimaCantidad] = useState([]);
    const [estadisticaMateriaPrima, setEstadisticaMateriaPrima] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleClickOpenMateriasPrimas = () => {
        setVisibleMateriasPrimas(true);
    };

    const handleCloseMateriasPrimas = () => {
        setVisibleMateriasPrimas(false);
    };

    const generateChartDataMateriaPrima = (nombres, cantidades) => {
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
       
        };

        setChartData(data);
        setChartOptions(options);
    };

    useEffect(() => {
        getEstadisticaMateriaPrima();
    }, []);

    useEffect(() => {
        if (estadisticaMateriaPrimaNombre.length > 0 && estadisticaMateriaPrimaCantidad.length > 0) {
            generateChartDataMateriaPrima(estadisticaMateriaPrimaNombre, estadisticaMateriaPrimaCantidad);
            setLoading(false);
        }
    }, [estadisticaMateriaPrimaNombre, estadisticaMateriaPrimaCantidad]);

    const getEstadisticaMateriaPrima = async () => {
        try {
            const estadistica_materia_prima = await axios.http.get("/estadistica/raw-materials");
            const options = estadistica_materia_prima.data.data.map(materia => ({
                code: materia.id,
                name: materia.nombre_materia,
                cantidad: materia.cantidad,
            }));

            setEstadisticaMateriaPrima(options);

            const estadistica_materia_prima_nombre = estadistica_materia_prima.data.data.map(element => element.nombre_materia);
            const estadistica_materia_prima_cantidad = estadistica_materia_prima.data.data.map(element => element.cantidad);
            setEstadisticaMateriaPrimaNombre(estadistica_materia_prima_nombre);
            setEstadisticaMateriaPrimaCantidad(estadistica_materia_prima_cantidad);
        } catch (error) {
            console.error("Error al obtener los datos de materia prima:", error);
        }
    };

    const almacenMateriasPrimas = () => {
        const nombre = selectedMateriasPrimas.map((element) => element.name);
        const cantidad = selectedMateriasPrimas.map((element) => element.cantidad);
        if (cantidad.length === 0) {
            getEstadisticaMateriaPrima();
        }
        setEstadisticaMateriaPrimaNombre(nombre);
        setEstadisticaMateriaPrimaCantidad(cantidad);
        handleCloseMateriasPrimas();

    };

    useEffect(() => {
        generateChartDataMateriaPrima(estadisticaMateriaPrimaNombre, estadisticaMateriaPrimaCantidad);
    }, [estadisticaMateriaPrimaNombre, estadisticaMateriaPrimaCantidad]);


    return (
        <>
            <div className="card_general-estadistica-input" style={{ position: 'absolute', top: 0, right: 0, display: 'flex', zIndex: 200 }}>
                <Button icon="pi pi-ellipsis-h" onClick={handleClickOpenMateriasPrimas} style={{ padding: '0.30rem 0.4rem', fontSize: '0.9rem', backgroundColor: 'white', borderColor: '#D9D9D9', color: '#D9D9D9' }} />
            </div>

            <div className=" h-full ">
                {loading ? (
                    <p>No hay estadísticas disponibles en este momento.</p>
                ) : (
                    <div className="container-chart">
                        <p className="chart-title text-bold text-center">{titulo}</p>
                        <div className="body-chart">
                            <Chart type="doughnut" data={chartData} options={chartOptions} className="chart-alm-materias" />
                        </div>
                    </div>

                )}
            </div>
            <Dialog
                visible={visibleMateriasPrimas}
                modal
                onHide={handleCloseMateriasPrimas}
                style={{ width: '400px', height: '300px' }}
            >
                <div>
                    <div className="field" style={{ marginBottom: '50px' }}>
                        <label htmlFor="startDate" className="block">
                            Selecciona los primeros Datos*
                        </label>
                        <MultiSelect value={selectedMateriasPrimas} onChange={(e) => setMateriasPrimas(e.value)} options={estadisticaMateriaPrima} optionLabel="name" filter placeholder="Selecciona producto" maxSelectedLabels={3} className="w-full md:w-20rem" />
                    </div>
                    <div className="field" style={{ display: 'flex', gap: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <Button label="Cancelar" icon="pi pi-align-center" style={{ backgroundColor: 'orange', border: 'none' }} onClick={handleCloseMateriasPrimas} />
                        <Button label="Aplicar" icon="pi pi-align-center" style={{ backgroundColor: '#04638A', border: 'none' }} onClick={almacenMateriasPrimas} />
                    </div>
                </div>
            </Dialog>
        </>
    );
};
