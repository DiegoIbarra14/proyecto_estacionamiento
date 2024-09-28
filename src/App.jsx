import React, { useEffect } from "react";
import { Route, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Importar useDispatch y useSelector
import AuthUser from "./AuthUser";
import Guest from "./Roles/guest";
import Auth from "./Roles/auth";
import { checkAuthState } from "./reducers/authSlices"; // Ajusta la ruta según tu estructura de carpetas
import "./App.css";
import { history } from "./history";

function App() {
  // const { getToken } = AuthUser();
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Obteniendo el hook de navegación
  const location = useLocation(); // Obteniendo la ubicación actual
  const { loading, authenticated } = useSelector((state) => state.auth); // Obtén el estado de carga y autenticación del store
  console.log("ss", authenticated)

  // Actualiza el objeto history
  history.location = location;
  history.navigate = navigate;

  useEffect(() => {
    // Despachar checkAuthState para verificar el estado de autenticación
    dispatch(checkAuthState());
  }, [dispatch]);

  // Si está cargando, puedes mostrar un spinner o un mensaje de carga
  if (loading) {
    return <div>Loading...</div>; // O algún componente de carga que prefieras
  }

  // Si no hay token y no está autenticado, muestra el componente Guest
  if (!authenticated) {
    return <Guest />;
  }

  // Si está autenticado, muestra el componente Auth
  return <Auth />;
}

export default App;
