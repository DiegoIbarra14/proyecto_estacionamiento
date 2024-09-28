import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// Importación elementos visuales
import logo from "../../Imagenes/logoPeru.jpg";
import logoresponsive from "../../Imagenes/logo-responsive-mapa.png";
import { useLogout } from "../../hooks/useLogout"; // Importa el hook personalizado
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";

// Íconos de cada módulo
import {
  Pedidos,
  Clientes,
  Estadisticas,
  Maquinas,
  ProdTer,
  Produccion,
  Productos,
  Proveedores,
  Reprocesamiento,
  Servicios,
  Trabajadores,
} from "./index-iconos";

import "primeicons/primeicons.css";
import "./sidebar.css";

const Sidebar = ({ onSidebarToggle }) => {
  let navigate = useNavigate();
  const accesos = useSelector((state) => state.auth.accesos);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const { handleLogout, acceptLogout, rejectLogout, visibleDelete, setVisibleDelete, toast } = useLogout(); // Usa el hook personalizado
  const handleMenuClick = (path) => {
    // Evitar la navegación si los botones están deshabilitados
    if (!buttonsDisabled && location.pathname !== path) {
      setButtonsDisabled(true); // Deshabilitar botones temporalmente
      navigate(path); // Navegar a la ruta seleccionada
      setTimeout(() => {
        setButtonsDisabled(false); // Habilitar botones después de 1 segundo
      }, 1000);
    }
  };

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const handleIconClick = () => {
    onSidebarToggle();
    toggleSidebar();
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 800) {
        setSidebarExpanded(true);
      } else {
        setSidebarExpanded(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const location = useLocation();

  const Fond = () => (
    <svg
      width="312"
      height="202"
      viewBox="0 0 312 202"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ zIndex: 490, position: "absolute" }}
    >
      <path
        d="M0 130.944H312V158C312 182.3 292.301 202 268 202H0V130.944Z"
        fill="white"
        fillOpacity="0.3"
      />
      <path
        d="M0 126.885H312V147.85C312 172.15 292.301 191.85 268 191.85H0V126.885Z"
        fill="white"
        fillOpacity="0.7"
      />
      <path
        d="M0 130.944H312C312 152.808 294.276 170.532 272.412 170.532H0V130.944Z"
        fill="white"
      />
      <path
        d="M0 0H312V135.668C312 159.969 292.301 179.668 268 179.668H0V0Z"
        fill="white"
      />
    </svg>
  );

  const listIcons = {
    "Ver locales": <Produccion />,
    "Ver alquileres": <Proveedores />,
    "Mod. Reprocesamiento": <Reprocesamiento />,
    "Lista de Máquinas": <Maquinas />,
    "Lista de Trabajadores": <Trabajadores />,
    "Lista de Clientes": <Clientes />,
    "Lista de Servicios": <Servicios />,
    "Productos Registrados": <Productos />,
    "Almacén de Prod. Ter": <ProdTer />,
    "Estadísticas": <Estadisticas />,
    "Lista de Pedidos": <Pedidos />,
    "Gestión de roles": <Pedidos />,
    "Dispositivos permitidos": <Pedidos />,
    "Almacén de Mat. Primas": <Reprocesamiento />,
  };


  return (
    <>
      <div className="toggle-button" onClick={handleIconClick}>
        <i
          className={sidebarExpanded ? "pi pi-arrow-left" : "pi pi-arrow-right"}
          style={{
            fontSize: "20px",
            color: "#fff",
            cursor: "pointer",
          }}
        ></i>
      </div>
      <div
        className={
          sidebarExpanded
            ? "sidebar-logo sidebar-logo-expanded"
            : "sidebar-logo sidebar-logo-compressed"
        }
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {sidebarExpanded ? <Fond /> : ""}
        <img
          className={
            sidebarExpanded
              ? "logo-img logo-img-expanded"
              : "logo-img logo-img-compressed"
          }
          style={{ zIndex: 900, position: "absolute", width: "150px" }}
          src={logo}
          alt="logo"
          onClick={() => navigate("/")}
        />
        <img
          className={
            sidebarExpanded
              ? "logo-responsive logo-responsive-expanded"
              : "logo-responsive logo-responsive-compressed"
          }
          style={{ zIndex: 200, position: "absolute", width: "50px" }}
          src={logoresponsive}
          alt="logo"
          onClick={() => navigate("/")}
        />
      </div>
      <div
        className={
          sidebarExpanded
            ? "sidebar-lista sidebar-lista-expanded"
            : "sidebar-lista sidebar-lista-compressed"
        }
        style={{ position: "absolute", top: 0, paddingTop: 220, bottom: 0, }}
      >
        <ul
          className={
            sidebarExpanded
              ? "sidebar-lista-ul sidebar-lista-ul-expanded"
              : "sidebar-lista-ul sidebar-lista-ul-compressed"
          }
        >
          {accesos?.map((item) =>
            item?.path !== "/dispositivos" ? (
              <li
                key={item?.path}
                style={{
                  backgroundColor: location.pathname.startsWith(`${item?.path}`)
                    ? "#23609e"
                    : "transparent", // Fondo transparente si no está activo
                  color: location.pathname.startsWith(`${item?.path}`)
                    ? "#fff"
                    : "inherit",
                  display: "flex",
                  cursor: buttonsDisabled ? "not-allowed" : "pointer",
                  pointerEvents: buttonsDisabled ? "none" : "auto",
                }}
                className={
                  sidebarExpanded
                    ? "sidebar-lista-opcion sidebar-lista-opcion-expanded "
                    : "sidebar-lista-opcion2 sidebar-lista-opcion-compressed"
                }
                onClick={() => handleMenuClick(item?.path)}
              >
                {sidebarExpanded
                  ? listIcons?.[item?.nombre]
                  : listIcons?.[item?.nombre]}
                <span
                  className={
                    sidebarExpanded
                      ? "sliderbar-text sliderbar-text-expanded"
                      : "sliderbar-text sliderbar-text-compressed"
                  }
                >
                  {item?.nombre}
                </span>
              </li>
            ) : (
              <></>
            )
          )}

          <div
            className={
              sidebarExpanded
                ? "cerrar-sesion-expanded"
                : "cerrar-sesion-compressed"
            }
          >
            <Button
              icon="pi pi-sign-out"
              style={{
                backgroundColor: "transparent",
                color: "inherit",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                pointerEvents: buttonsDisabled ? "none" : "auto",
                marginTop: 50,
                border: "none",
              }}
              className={
                sidebarExpanded
                  ? "sidebar-lista-opcion sidebar-lista-opcion-expanded items-center justify-content-center"
                  : "sidebar-lista-opcion2 sidebar-lista-opcion-compressed"
              }
              onClick={() => setVisibleDelete(true)}
            >
              {sidebarExpanded && <span className="pl-3 ">Cerrar sesión</span>}
            </Button>
          </div>
        </ul>

      </div>
      <ConfirmDialog
        visible={visibleDelete}
        onHide={() => setVisibleDelete(false)}
        message="¿Está seguro de que desea cerrar sesión?"
        header="Confirmación"
        icon="pi pi-exclamation-triangle"
        accept={acceptLogout}
        reject={rejectLogout}
      />
    </>
  );
};
export default Sidebar;