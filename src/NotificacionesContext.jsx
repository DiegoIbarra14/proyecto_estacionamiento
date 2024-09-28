/* Control de notificaciones - Prueba/Temporal*/
import { Button } from 'primereact/button';
import React, { createContext, useContext, useState } from 'react';

const NotificacionesContext = createContext();

export const useNotificaciones = () => {
    return useContext(NotificacionesContext);
};

export const NotificacionesProvider = ({ children }) => {

    const [dataUsuario, setDataUsuario] = useState(null);
    const [perfil, setPerfil] = useState(null);
    const [notificaciones, setNotificaciones] = useState([]);

    const generarNotificacion = (mensaje, urlRedireccion) => {
    const nuevaNotificacion = {
        mensaje,
        urlRedireccion,
        fecha: new Date()
    };
    setNotificaciones([...notificaciones, nuevaNotificacion]);
    };

    return (
    <NotificacionesContext.Provider value={{ notificaciones, generarNotificacion, perfil, setPerfil, dataUsuario, setDataUsuario }}>
        {children}
    </NotificacionesContext.Provider>
    );
};