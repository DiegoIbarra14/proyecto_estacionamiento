import React, { useState, useRef, useEffect, useMemo, useContext } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import "./container.css";
import LoginService from "../../Services/LoginService";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Password } from "primereact/password";
import { ConfirmDialog } from "primereact/confirmdialog";
import AuthUser from "../../AuthUser";
import 'primeicons/primeicons.css';
import { useDispatch } from "react-redux";
import { logout } from "../../reducers/authSlices";
import { useNotificaciones } from "../../NotificacionesContext";

function Container(props) {

  const {setPerfil} =useNotificaciones();
  // const { http, getToken, deleteToken } = AuthUser();
  const dispatch=useDispatch()
  const items = [
    {
      label: "Mi Perfil",
      icon: "pi pi-cog",
      command: () => {
        visibleDialog();
      },
    },
    {
      label: "Cerrar Sesión",
      icon: "pi pi-power-off",
      command: () => {
        setVisibleDelete(true);
      },
    },
  ];

  let navigate = useNavigate();
  const toast = useRef(null);
  const [my, setMy] = useState([]);
  const [token, setToken] = useState();
  const [changePassword, setChangePassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const visibleDialog = () => {
    navigate(`/miPerfil`)
  };



  /*const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };*/

  const hideDialog = () => {
    setVisibleCreate(false);
  };

  const DialogFooter = (
    <React.Fragment>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-danger"
        onClick={hideDialog}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        className="p-button-success"
        onClick={() => {
          if (changePassword.oldPassword.length == 0) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe ingresar la contraseña antigua"
            );
          } else if (changePassword.newPassword.length == 0) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe ingresar la contraseña nueva"
            );
          } else if (changePassword.confirmPassword.length == 0) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe ingresar la contraseña nueva a confirmar"
            );
          } else {
            handleSubmitChange();
          }
        }}
      />
    </React.Fragment>
  );
  const handleChangeOldPassword = (e) => {
    setChangePassword({
      oldPassword: e.target.value,
      newPassword: changePassword.newPassword,
      confirmPassword: changePassword.confirmPassword,
    });
  };
  const handleChangeNewPassword = (e) => {
    setChangePassword({
      oldPassword: changePassword.oldPassword,
      newPassword: e.target.value,
      confirmPassword: changePassword.confirmPassword,
    });
  };
  const handleChangeConfirmPassword = (e) => {
    setChangePassword({
      oldPassword: changePassword.oldPassword,
      newPassword: changePassword.newPassword,
      confirmPassword: e.target.value,
    });
  };
  const handleSubmitChange = (e) => {
    LoginService.changePassword(changePassword)
      .then((response) => {
        showToast("success", "Cambio Exitoso", `Cambio realizado con exito!`);
        hideDialog();
      })
      .catch((error) => {
        console.log(error);
        showToast("error", "Acceso Denegado", `Error algo salio mal`);
      });
  };
  const showToast = (tipo, titulo, detalle) => {
    toast.current.show({
      severity: tipo,
      summary: titulo,
      detail: detalle,
      life: 3000,
    });
  };
  const accept = () => {
    dispatch(logout())
    // if (LoginService.getToken() != null) {
    //   setMy(null);
      
    //   // navigate("/");
    // } else {
    //   console.log("sesion cerrada");
    // }
  };
  const reject = () => {
    toast.current.show({
      severity: "info",
      summary: "Rechazada",
      detail: "No se realizo ninguna acción",
      life: 3000,
    });
    setVisibleDelete(false);
  };

  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 800) {
        setSidebarExpanded(true);
      } else {
        setSidebarExpanded(false);
      }
    };

    // Agregar un event listener para detectar cambios en el tamaño de la ventana
    window.addEventListener('resize', handleResize);

    // Llamar a handleResize una vez para configurar la clase inicial
    handleResize();

    // Limpieza: remover el event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="container-sidebar">
      {true? (<div className="container">

        <Toast ref={toast} />
        <div className={sidebarExpanded ? "p-sidebar p-sidebar-expanded" : "p-sidebar p-sidebar-compressed"}>
          <Sidebar onSidebarToggle={toggleSidebar} />
        </div>
        <div className="p-navbar" style={{zIndex:20}}>
          <Navbar items={items} />
        </div>

        <div className="p-container">{props.children}</div>


        <Dialog
          visible={visibleCreate}
          style={{ width: "450px" }}  
          header={
            <>
              <i className="pi pi-key icon-create-proveedor"></i>Cambio de
              Contraseña
            </>
          }
          modal
          className="p-fluid"
          footer={DialogFooter}
          onHide={hideDialog}
        >
          <div className="field">
            <label htmlFor="numero_documento">Contraseña Anterior*</label>
            <Password
              toggleMask
              className=""
              feedback={false}
              value={changePassword.oldPassword}
              onChange={handleChangeOldPassword}
            />
          </div>
          <div className="field">
            <label htmlFor="razon_social">Contraseña Nueva*</label>
            <Password
              toggleMask
              className=""
              feedback={false}
              value={changePassword.newPassword}
              onChange={handleChangeNewPassword}
            />
          </div>

          <div className="field">
            <label htmlFor="telefono">Confirme Contraseña Nueva*</label>
            <Password
              toggleMask
              className=""
              feedback={false}
              value={changePassword.confirmPassword}
              onChange={handleChangeConfirmPassword}
            />
          </div>
        </Dialog>
        <ConfirmDialog
          visible={visibleDelete}
          onHide={() => {
            setVisibleDelete(false);
          }}
          message={`Esta seguro de cerrar sesión`}
          header="Confirmación"
          icon="pi pi-exclamation-triangle"
          acceptLabel="Sí"
          accept={accept}
          reject={reject}
        />
      </div>) : (<i className="pi pi-spin pi-spinner" style={{ 'fontSize': '2em' }}></i>)}
    </div>

  );
}

export default React.memo(Container);
