import React, { useState, useEffect } from "react";
import { Chart } from 'primereact/chart';
import axios from '../../../http-common';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { Title } from "chart.js";
import "./MermasGeneradas.css"

export const MermaGenerada = ({ titulo }) => {
    const [visibleMermasGeneradas, setVisibleMermaGenerada] = useState(false);
    const [chartDataMermaGenerada, setChartDataMermaGenerada] = useState({});
    const [chartOptionsMermaGenerada, setChartOptionsMermaGenerada] = useState({});
    const [selectedMermasGeneradas, setMermasGeneradas] = useState(null);
    const [estadisticaMermaGeneradaNombre, setEstadisticaMermaGeneradaNombre] = useState([]);
    const [estadisticaMermaGeneradaCantidad, setEstadisticaMermaGeneradaCantidad] = useState([]);
    const [estadisticaMermaGenerada, setEstadisticaMermaGenerada] = useState([]);

    const [loading, setLoading] = useState(true);

    const handleClickOpenMermaGenerada = () => {
        setVisibleMermaGenerada(true);
    };

    const handleCloseMermaGenerada = () => {
        setVisibleMermaGenerada(false);
    };

    const generateChartDataMermaGenerada = (nombres, cantidades) => {
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

        setChartDataMermaGenerada(data);
        setChartOptionsMermaGenerada(options);
    };

    useEffect(() => {
        getEstadisticaMermaGenerada();
    }, []);

    useEffect(() => {
        if (estadisticaMermaGeneradaNombre.length > 0 && estadisticaMermaGeneradaCantidad.length > 0) {
            generateChartDataMermaGenerada(estadisticaMermaGeneradaNombre, estadisticaMermaGeneradaCantidad);
            setLoading(false);
        }
    }, [estadisticaMermaGeneradaNombre, estadisticaMermaGeneradaCantidad]);

    const getEstadisticaMermaGenerada = async () => {
        try {
            const estadistica_merma_generada = await axios.http.get("/estadistica/get");

            const produccionMerma = estadistica_merma_generada.data.produccion_merma;

            const produccion_merma_organizada = Object.keys(produccionMerma).map(key => ({
                name: key,
                code: produccionMerma[key].cantidad_merma,    
            }));
            
            const options = produccion_merma_organizada.map(materia => ({
                code: materia.code,
                name: materia.name,
            }));

            setEstadisticaMermaGenerada(options);

            const estadistica_merma_generada_nombre = produccion_merma_organizada.map(element => element.name);
            const estadistica_merma_generada_cantidad = produccion_merma_organizada.map(element => element.code);
            setEstadisticaMermaGeneradaNombre(estadistica_merma_generada_nombre);
            setEstadisticaMermaGeneradaCantidad(estadistica_merma_generada_cantidad);
        } catch (error) {
            console.error("Error al obtener los datos de materia prima:", error);
        }
    };

    const almacenMermasGeneradas = () => {
        const nombre = selectedMermasGeneradas.map((element) => element.name);
        const cantidad = selectedMermasGeneradas.map((element) => element.code);
        setEstadisticaMermaGeneradaNombre(nombre);
        setEstadisticaMermaGeneradaCantidad(cantidad);
        handleCloseMermaGenerada();
    };

    useEffect(() => {
        generateChartDataMermaGenerada(estadisticaMermaGeneradaNombre, estadisticaMermaGeneradaCantidad);
    }, [estadisticaMermaGeneradaNombre, estadisticaMermaGeneradaCantidad]);

    return (
        <>
            <div className="card_general-estadistica-input" style={{ position: 'absolute', top: 0, right: 0, display: 'flex', zIndex: 200 }}>
                <Button icon="pi pi-ellipsis-h" onClick={handleClickOpenMermaGenerada} style={{ padding: '0.30rem 0.4rem', fontSize: '0.9rem', backgroundColor: 'white', borderColor: '#D9D9D9', color: '#D9D9D9' }} />
            </div>
            <div className="h-full">
                {loading ? (
                    <p>No hay estadísticas disponibles en este momento.</p>
                ) : (
                    <div className="container-chart">
                        <p className="chart-title text-bold text-center">{titulo}</p>
                        <div className="body-chart">
                            <Chart type="pie" data={chartDataMermaGenerada} options={chartOptionsMermaGenerada} className="chart-alm-materias" />
                        </div>
                    </div>  
                )}
            </div>
            <Dialog
                visible={visibleMermasGeneradas}
                modal
                onHide={handleCloseMermaGenerada}
                style={{ width: '400px', height: '300px' }}
            >
                <div>
                    <div className="field" style={{ marginBottom: '50px' }}>
                        <label htmlFor="startDate" className="block">
                            Selecciona los primeros Datos*
                        </label>
                        <MultiSelect value={selectedMermasGeneradas} onChange={(e) => setMermasGeneradas(e.value)} options={estadisticaMermaGenerada} optionLabel="name" filter placeholder="Selecciona producto" maxSelectedLabels={3} className="w-full md:w-20rem" />
                    </div>
                    <div className="field" style={{ display: 'flex', gap: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <Button label="Cancelar" icon="pi pi-align-center" style={{ backgroundColor: 'orange', border: 'none' }} onClick={handleCloseMermaGenerada} />
                        <Button label="Aplicar" icon="pi pi-align-center" style={{ backgroundColor: '#04638A', border: 'none' }} onClick={almacenMermasGeneradas} />
                    </div>
                </div>
            </Dialog>
        </>
    );
};
