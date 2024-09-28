import React, { useState, useEffect } from "react";
import { Chart } from 'primereact/chart';
import axios from '../../../http-common';
import { Dialog } from 'primereact/dialog';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';

export const MermaProductosTerminados = ({ titulo }) => {
    //START LOGICA PARA MANEJAR EL NODAL
    const [visibleMermaProductosTerminados, setVisibleMermaProductosTerminados] = useState(false);

    const handleClickOpenMermaProductosTerminados = () => {
        setVisibleMermaProductosTerminados(true);
    };

    const handleCloseMermaProductosTerminados = () => {
        setVisibleMermaProductosTerminados(false);
    };

    //maneja al amomento de seleccionar
    const [selectedMermaProductosTerminados, setMermaProductosTerminados] = useState(null);

    //maneja los selects de los inputs
    const [estadisticaMermaProductosTerminados, setEstadisticaMermaProductosTerminados] = useState([]);
    //END LOGICA PARA MANEJAR EL MODAL

    const [chartDataMermaProductosTerminados, setChartDataMermaProductosTerminados] = useState({});
    const [chartOptionsMermaProductosTerminados, setChartOptionsMermaProductosTerminados] = useState({});

    const [mermaProductosTerminadosNombre, setMermaProductosTerminadosNombre] = useState([]);
    const [mermaProductosTerminadosCantidad, setMermaProductosTerminadosCantidad] = useState([]);

    const getMermasProductosTermindos = async () => {
        const merma_productos_terminados = await axios.http.get('estadistica/get');

        const options = merma_productos_terminados.data.productos_terminados.map(merma => ({
            code: merma.cantidad_merma,
            name: merma.producto,
        }));

        setEstadisticaMermaProductosTerminados(options)


        const merma_productos_terminados_nombre = merma_productos_terminados.data.productos_terminados
            .map(element => element.producto);
        const merma_productos_terminados_cantidad = merma_productos_terminados.data.productos_terminados
            .map(element => element.cantidad_merma);

        setMermaProductosTerminadosNombre(merma_productos_terminados_nombre);
        setMermaProductosTerminadosCantidad(merma_productos_terminados_cantidad);
    }

    useEffect(() => {
        getMermasProductosTermindos()
    }, []);

    const mermaProductosTerminados = () => {
        const nombre = selectedMermaProductosTerminados.map((element) => element.name);
        const cantidad = selectedMermaProductosTerminados.map((element) => element.code);
        if (cantidad.length === 0) {
            getMermasProductosTermindos();
        }
        setMermaProductosTerminadosNombre(nombre);
        setMermaProductosTerminadosCantidad(cantidad);
        handleCloseMermaProductosTerminados();
    };

    const generateChartDataMermaProductosTerminados = (nombre, cantidad) => {
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
        setChartDataMermaProductosTerminados(data);
        setChartOptionsMermaProductosTerminados(options);
    }

    useEffect(() => {
        generateChartDataMermaProductosTerminados(mermaProductosTerminadosNombre, mermaProductosTerminadosCantidad)
    }, [mermaProductosTerminadosNombre, mermaProductosTerminadosCantidad]);

    return (
        <>
            <div className="" style={{ position: 'absolute', top: 5, right: 5, display: 'flex' }}>
                <Button onClick={handleClickOpenMermaProductosTerminados} icon="pi pi-ellipsis-h" style={{ padding: '0.30rem 0.4rem', fontSize: '0.9rem', backgroundColor: 'white', borderColor: '#D9D9D9', color: '#D9D9D9' }} />
            </div>
            <div className="container-chart">
                <p className="chart-title text-center">{titulo}</p>
                <div className="chart-body">
                    <Chart type="bar" data={chartDataMermaProductosTerminados} options={chartOptionsMermaProductosTerminados} className="chart-merma-materia-prima" />
                </div>
            </div>
            <Dialog
                visible={visibleMermaProductosTerminados}
                modal
                onHide={handleCloseMermaProductosTerminados}
                style={{ width: '400px', height: '300px' }}
            >
                <div>
                    <div className="field" style={{ marginBottom: '50px' }}>
                        <label htmlFor="startDate" className="block">
                            Selecciona los primeros Datos*
                        </label>
                        <MultiSelect value={selectedMermaProductosTerminados} onChange={(e) => setMermaProductosTerminados(e.value)} options={estadisticaMermaProductosTerminados} optionLabel="name" filter placeholder="Selecciona producto" maxSelectedLabels={3} className="w-full md:w-20rem" />
                    </div>
                    <div className="field" style={{ display: 'flex', gap: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <Button label="Cancelar" icon="pi pi-align-center" style={{ backgroundColor: 'orange', border: 'none' }} onClick={handleCloseMermaProductosTerminados} />
                        <Button onClick={mermaProductosTerminados} label="Aplicar" icon="pi pi-align-center" style={{ backgroundColor: '#04638A', border: 'none' }}/>
                    </div>
                </div>
            </Dialog>
        </>
    );
};
