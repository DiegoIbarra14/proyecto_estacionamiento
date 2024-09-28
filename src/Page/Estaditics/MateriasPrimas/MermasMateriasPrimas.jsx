import React, { useState, useEffect } from "react";
import { Chart } from 'primereact/chart';
import "./MermaMateriaPrima.css";
import axios from '../../../http-common';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { MultiSelect } from 'primereact/multiselect';

export const MermasMateriasPrimas = ({ titulo }) => {

    //START LOGICA PARA MANEJAR EL NODAL
    const [visibleMermaMateriasPrimas, setVisibleMermaMateriasPrimas] = useState(false);

    const handleClickOpenMermaMateriasPrimas = () => {
        setVisibleMermaMateriasPrimas(true);
    };

    const handleCloseMermaMateriasPrimas = () => {
        setVisibleMermaMateriasPrimas(false);
    };

    //maneja al amomento de seleccionar
    const [selectedMermaMateriasPrimas, setMermaMateriasPrimas] = useState(null);

    //maneja los selects de los inputs
    const [estadisticaMermaMateriaPrima, setEstadisticaMermaMateriaPrima] = useState([]);
    //END LOGICA PARA MANEJAR EL MODAL

    const [chartDataMermaMatariaPrima, setChartDataMermaMatariaPrima] = useState({});
    const [chartOptionsMermaMateriaPrima, setChartOptionsMermaMateriaPrima] = useState({});

    const [mermaMateriasPrimasNombre, setMermaMateriasPrimasNombre] = useState([]);
    const [mermaMateriasPrimasCantidad, setMermaMateriasPrimasCantidad] = useState([]);

    const getMermasMateriasPrimas = async () => {
        const merma_materias_primas = await axios.http.get('estadistica/get');

        const options = merma_materias_primas.data.materias_primas.map(merma => ({
            code: merma.cantidad_merma,
            name: merma.materia_prima,
        }));

        setEstadisticaMermaMateriaPrima(options)

        const merma_materia_prima_nombre = merma_materias_primas.data.materias_primas
        .map(element => element.materia_prima);
        const merma_materia_prima_cantidad = merma_materias_primas.data.materias_primas
        .map(element => element.cantidad_merma);
        setMermaMateriasPrimasNombre(merma_materia_prima_nombre);
        setMermaMateriasPrimasCantidad(merma_materia_prima_cantidad);
    }

    useEffect(() => {
        getMermasMateriasPrimas()
    }, []);

    const mermaMateriasPrimas = () => {
        const nombre = selectedMermaMateriasPrimas.map((element) => element.name);
        const cantidad = selectedMermaMateriasPrimas.map((element) => element.code);
        if (cantidad.length === 0) {
            getMermasMateriasPrimas();
        }
        setMermaMateriasPrimasNombre(nombre);
        setMermaMateriasPrimasCantidad(cantidad);
        handleCloseMermaMateriasPrimas();
    };

    const generateChartDataMermaMateriasPrimas = (nombre, cantidad) => {
        const generateRandomColorRGBA = () => {
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            return `rgba(${r}, ${g}, ${b}, 0.3)`; // Opacidad del 80%
        };

        const randomColors = nombre.map(() => generateRandomColorRGBA());
        const borderColors = randomColors.map(color => color.replace('0.3', '0.6'));

        const data = {
            labels: nombre,
            datasets: [
                {
                    label: 'Valor',
                    data: cantidad,
                    backgroundColor: randomColors,
                    borderColor: borderColors, // Bordes más oscuros
                    borderWidth: 3, // Ancho del borde
                    borderRadius: 10 // Radio de borde para esquinas superiores
                }
            ]
        };
        const options = {
            plugins: {
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
            // scales: {
            //     y: {
            //         beginAtZero: true
            //     }
            // },
            legend: {
                display: false // Oculta la leyenda
            },
            layout: {
                padding: {
                    bottom: 20 // Espacio para el label debajo del gráfico
                }
            }

        };
        setChartDataMermaMatariaPrima(data);
        setChartOptionsMermaMateriaPrima(options);
    }

    useEffect(() => {
        generateChartDataMermaMateriasPrimas(mermaMateriasPrimasNombre, mermaMateriasPrimasCantidad)
    }, [mermaMateriasPrimasNombre, mermaMateriasPrimasCantidad]);

    return (
        <>
            <div className="caja__estadistica__root__sub__cajita__dos__sub" style={{ position: 'absolute', top: 5, right: 5, display: 'flex' }}>
                <Button onClick={handleClickOpenMermaMateriasPrimas} icon="pi pi-ellipsis-h" style={{ padding: '0.30rem 0.4rem', fontSize: '0.9rem', backgroundColor: 'white', borderColor: '#D9D9D9', color: '#D9D9D9' }} />
            </div>

            <div className="container-chart">
                <p className="chart-title text-center">{titulo}</p>
                <div className="chart-body">
                    <Chart type="bar" data={chartDataMermaMatariaPrima} options={chartOptionsMermaMateriaPrima} className="chart-merma-materia-prima" />
                </div>
            </div>
            <Dialog
                visible={visibleMermaMateriasPrimas}
                modal
                onHide={handleCloseMermaMateriasPrimas}
                style={{ width: '400px', height: '300px' }}
            >
                <div>
                    <div className="field" style={{ marginBottom: '50px' }}>
                        <label htmlFor="startDate" className="block">
                            Selecciona los primeros Datos*
                        </label>
                        <MultiSelect value={selectedMermaMateriasPrimas} onChange={(e) => setMermaMateriasPrimas(e.value)} options={estadisticaMermaMateriaPrima} optionLabel="name" filter placeholder="Selecciona producto" maxSelectedLabels={3} className="w-full md:w-20rem" />
                    </div>
                    <div className="field" style={{ display: 'flex', gap: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <Button label="Cancelar" icon="pi pi-align-center" style={{ backgroundColor: 'orange', border: 'none' }} onClick={handleCloseMermaMateriasPrimas} />
                        <Button onClick={mermaMateriasPrimas} label="Aplicar" icon="pi pi-align-center" style={{ backgroundColor: '#04638A', border: 'none' }}/>
                    </div>
                </div>
            </Dialog>
        </>
    );
};
