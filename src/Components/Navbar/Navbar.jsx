import React, { useState, useRef, useEffect, useMemo } from "react";
import "./navbar.css";
import usuario from "../../Imagenes/usuario.png";
import config from "../../Imagenes/config.png";
import fondo_1 from "../../Imagenes/fondo_1.png";
import fondo_2 from "../../Imagenes/fondo_2.png";
import { SplitButton } from "primereact/splitbutton";

import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Badge } from 'primereact/badge';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Divider } from 'primereact/divider';
import { useNotificaciones } from '../../NotificacionesContext';
import { AlertaMaquina } from "../AlertaMaquinas/AlertaMaquina";
import { useSelector } from "react-redux";

const Navbar = (props) => {

  const { notificaciones, generarNotificacion, perfil } = useNotificaciones(); // Estado de las notificaciones
  const [user, setUser] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      console.log("aa", parsedUser);
    }
  }, []); 

  const overlayRef = useRef(null);
  const mostrarOverlay = (event) => {
    overlayRef.current.toggle(event);
  };

  const splitButtonRef = useRef(null);

  const handleClickSplitButton = () => {
    splitButtonRef.current.show();
  };


  return (
    <>
      <div className="usuario">
        {/* <div className="notification">
          <Button onClick={(e) =>  mostrarOverlay(e)} className="boton-notificaciones" >
            <i className="pi pi-bell p-overlay-badge" style={{ fontSize: '1.5rem', color: '#64748b'}}>
              <Badge value={notificaciones.length} severity="danger"></Badge>
            </i>
          </Button>

          <Button style={{ position: 'absolute', top: '0', right:'100px' }} onClick={() => generarNotificacion("Nueva notificación generada", "/#/getMaquinas")} >
            <i className="pi pi-bell p-overlay-badge" style={{ fontSize: '1.5rem', color: '#64748b'}}></i>
            Boton para generar notificaciones
          </Button>
        </div> */}
        <OverlayPanel ref={overlayRef} className="contenedor-notificaciones" h>
          <ScrollPanel style={{ width: '100%', height: 'calc(60vh - 2.5rem)' }} className="custombar1" pt={{
            root: {
              style: { width: '100%', height: '200px' }
            },
            barY: {
              className: 'bg-primary'
            }
          }}>

            {/* Contenido de la ventana de diálogo */}
            <div>
              <h2 style={{ marginTop: '5px', marginLeft: '10px' }}>Notificaciones</h2>
              <Divider />
              <div style={{ width: '25vw', display: 'flex', alignContent: 'center', justifyContent: 'center', flexWrap: 'wrap', margin: 'auto' }}>
                {notificaciones.map((notificacion, index) => (
                  <div key={index} >
                    <p>{notificacion.mensaje}</p>
                    <p>{notificacion.fecha.toString()}</p>
                    <a href={notificacion.urlRedireccion}><Button>Ir</Button></a>
                    <Divider style={{ width: '25vw' }} />

                  </div>

                ))}
              </div>
            </div>

          </ScrollPanel>
        </OverlayPanel>
        <div className="username">
          <div className="logo-usuario">
            <AlertaMaquina />

            <img src={usuario} alt="usuario"></img>
            <SplitButton
              label={`¡Bienvenido ${user?.persona?.nombres}!`}
              model={props.items}
              className="p-button-text mr-2 mb-2 p-button-secondary desplegable"
              onClick={handleClickSplitButton}
              ref={splitButtonRef}
            ></SplitButton>
            {
              //<img className="icon-config" src={config} alt="config"></img>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
