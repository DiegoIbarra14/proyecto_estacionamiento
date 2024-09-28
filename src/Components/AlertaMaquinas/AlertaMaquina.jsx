import React, { useEffect, useState } from 'react';
import { Tooltip } from 'primereact/tooltip';
import campana from "../../Imagenes/campana.gif";
import './AlertMaquina.css';

export const AlertaMaquina = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [alertedMachines, setAlertedMachines] = useState([]);

    useEffect(() => {
        const alertDatesStr = localStorage.getItem('alertDates');
        if (!alertDatesStr) {
            //console.log('No hay fechas de alerta en localStorage.');
            return;
        }

        const alertDates = JSON.parse(alertDatesStr);
        const currentDate = new Date().toISOString().split('T')[0];

        const todaysAlerts = alertDates.filter(alert => alert.fecha_alerta.split('T')[0] === currentDate);
        if (todaysAlerts.length > 0) {
            setIsVisible(true);
            setAlertedMachines(todaysAlerts);
        }

        const interval = setInterval(() => {
            const updatedCurrentDate = new Date().toISOString().split('T')[0];
            const updatedAlerts = alertDates.filter(alert => alert.fecha_alerta.split('T')[0] === updatedCurrentDate);
            if (updatedAlerts.length > 0) {
                setIsVisible(true);
                setAlertedMachines(updatedAlerts);
            } else {
                setIsVisible(false);
                setAlertedMachines([]);
            }
        }, 1000 * 60);

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            {isVisible && <Spinner alertedMachines={alertedMachines} />}
        </div>
    );
};

const Spinner = ({ alertedMachines }) => (
    <div className="spinner-container">
        <div className="spinner logo">
            <img src={campana} alt="Campana" />
            <div className="confetti"></div>
            <div className="confetti"></div>
            <div className="confetti"></div>
            <div className="confetti"></div>
            <div className="confetti"></div>
            <div className="confetti"></div>
        </div>
        <Tooltip target=".logo" mouseTrack mouseTrackLeft={10}>
            <table className="alert-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Fecha de Mant.</th>
                    </tr>
                </thead>
                <tbody>
                    {alertedMachines.map((machine, index) => (
                        <tr key={index}>
                            <td>{machine.nombre}</td>
                            <td>{machine.fecha_mantenimiento}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Tooltip>
    </div>
);
