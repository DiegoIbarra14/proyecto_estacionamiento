import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PageProveedores from "../Page/Proveedores/PageProveedores";

import PageServicios from "../Page/Servicios/PageServicios";

import PageNotFound from "../Page/NotFound/PageNotFound";
import PageTabs from "../Page/Estaditics/PageTabs";
import AuthUser from "../AuthUser";
import PagePedido from "../Page/Pedids/PagePedido";
import PageLocales from "../Page/Locales/pageLocales";
import PagePerfil from "../Page/Perfil/PagePerfil";
import Prueba from "../Page/AccesosDispositivos/prueba";
//import PageAccesoDevices from "../Page/AccesosDispositivos/PageAccesoDevices";
import ProveedorProvider from "../Page/Proveedores/context/ProveedorProvider";
import { useSelector } from "react-redux";
import Alquiler from "../Page/Arquileres/Alquiler";

function Auth() {
  let routes = useSelector((state) => state.auth)
  routes=routes?.accesos
  const routeComponents = routes?.map((route) => {
    switch (route.path) {
      case "/locales":
        return <Route key={route.path} path={route.path} element={<PageLocales />} />;
      case "/alquileres":
        return <Route key={route.path} path={route.path} element={<Alquiler/>} />;
      default:
        return null; // En caso de que no coincida ninguna ruta
    }
  });

  const RouteElementDefault = () => {
    return routes?.[0]?.path ? (
      <Navigate to={routes[0].path} />
    ) : (
      <PageNotFound />
    );
  };

  return (
    <div className="App">
      <Routes>
        {routeComponents}
        <Route path="*" element={<RouteElementDefault />} />
      </Routes>
    </div>
  );
}





export default Auth;
