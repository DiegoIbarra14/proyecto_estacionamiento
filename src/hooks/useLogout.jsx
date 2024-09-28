import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { logout } from "../reducers/authSlices";
import { Toast } from "primereact/toast";

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useRef(null); // Para mostrar notificaciones con Toast
  const [visibleDelete, setVisibleDelete] = useState(false); // Estado para el confirm dialog

  const handleLogout = () => {
    setVisibleDelete(true); // Mostrar el confirm dialog
  };

  const acceptLogout = () => {
    dispatch(logout()); // Cierra la sesión
    navigate("/"); // Redirige al inicio o login
  };

  const rejectLogout = () => {
    setVisibleDelete(false);
  };

  return {
    handleLogout,
    acceptLogout,
    rejectLogout,
    visibleDelete,
    setVisibleDelete,
    toast, // Retornamos el toast para su uso en el componente
  };
};
