import Container from '../../Components/Container/Container';
import { TabView, TabPanel } from 'primereact/tabview';
import PageEstadistica from './PageEstadistica';
import PageEstadistica2 from './PageEstadistica2';
import PageEstadistica3 from './PageEstadistica3';
import { Cards } from './Cards/Cards';
import React, { useState, useRef } from 'react';
import { AnalisisPorCliente } from '../Estaditics/EstadisticaCliente/AnalisisPorCliente';
import { AnalisisPorProducto } from './EstadisticasProducto/AnalisisPorProducto';
import { SelectButton } from 'primereact/selectbutton';
import { Calendar } from 'primereact/calendar';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import calendarIcon from '../../Imagenes/calendar-icon.svg';
import './pageTabs.css';

const CustomIcon = () => {
    return (
        <div className="custom-icon-wrapper">
            <img src={calendarIcon} alt="Calendar" className="custom-calendar-icon" />
        </div>
    );
};

function PageTabs() {
    const [activeComponentTop, setActiveComponentTop] = useState('TabViewTop');
    const [activeComponentBottom, setActiveComponentBottom] = useState('TabViewBottom');
    const [activeButton, setActiveButton] = useState('');
    const [dateRange, setDateRange] = useState(null);
    const [value, setValue] = useState(1);
    const optionsClientesProductos = [
        { name: 'Cliente', value: 1 },
        { name: 'Producto', value: 2 }
    ];

    const lastSelectedValue = useRef(value);
    const handleSelectButtonChange = (e) => {
        const newValue = e.value !== null ? e.value : lastSelectedValue.current;
        setValue(newValue);
        lastSelectedValue.current = newValue;
    };

    return (
        <div style={{ marginTop: 0, position: 'relative' }}>
            <Container url="estadistica" style={{ margin: '0px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h1 style={{ margin: '0px', zIndex: 200, top: '-30px', color: '#05749E' }}>Estadísticas</h1>
                    <div className="custom-calendar-container" style={{display:'none'}}>
                        <CustomIcon />
                        <Calendar
                            value={dateRange}
                            onChange={(e) => setDateRange(e.value)}
                            selectionMode="range"
                            readOnlyInput
                            placeholder="00/00/0000 - 00/00/0000"
                            panelClassName="custom-calendar-panel"
                            inputClassName="custom-calendar-input"
                        />
                    </div>
                </div>
                <style jsx>{`
                    .custom-calendar-container {
                        position: relative;
                        width: 210px;
                        background-color: white;
                        align-content: center;
                        border-radius: 5px;
                    }
                    .custom-calendar-container:hover,
                    .custom-calendar-input:hover,
                    .custom-icon-wrapper:hover,
                    .p-datepicker-trigger:hover {
                        cursor: pointer;
                    }
                    .custom-calendar-input {
                        background-color: white !important;
                        border: none !important;
                        border-radius: 8px !important;
                        padding: 0.5rem 0.5rem 0.5rem 2.5rem !important;
                        font-size: 14px !important;
                        color: #6c757d !important;
                        width: 100% !important;
                    }
                    .custom-calendar-input:enabled:focus {
                        box-shadow: none !important;
                    }
                    .custom-icon-wrapper {
                        position: absolute !important;
                        left: 0.75rem !important;
                        top: 50% !important;
                        transform: translateY(-50%) !important;
                        z-index: 2 !important;
                        pointer-events: none !important;
                    }
                    .custom-calendar-icon {
                        width: 21px !important;
                        height: 21px !important;
                    }
                    .p-datepicker-trigger {
                        display: none !important;
                    }
                    .custom-calendar-panel {
                        border: none !important;
                        border-radius: 8px !important;
                        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1) !important;
                    }
                `}</style>
                <Cards />
                <div className="card">
                    <PageEstadistica></PageEstadistica>
                    {/* <PageEstadistica2></PageEstadistica2>
                    <PageEstadistica3></PageEstadistica3> */}
                </div>
                {/* Componentes de Estadistica cliente / Estadistica producto */}
                <div className="button-container">
                    <SelectButton
                        className='cliente__producto__button__comun'
                        value={value}
                        onChange={handleSelectButtonChange}
                        options={optionsClientesProductos}
                        optionLabel="name"
                        multiple={false} // Ensures only one can be selected at a time
                    />
                </div>
                {value === 1 && (
                    <AnalisisPorCliente />
                )}
                {value === 2 && (
                    <AnalisisPorProducto />
                )}
            </Container>
        </div>
    )
}
export default PageTabs