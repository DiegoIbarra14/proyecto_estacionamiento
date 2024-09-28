import React, { useEffect, useState, useRef } from "react";
import { Column } from "primereact/column";
import Table from "../../Components/Maquina/Table";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import "./pageMaquinas.css";
import ListServicios from "../../Components/Maquina/ListServicios";
import { ConfirmDialog } from "primereact/confirmdialog";
import Container from "../../Components/Container/Container";
import AuthUser from '../../AuthUser';
import Tag from "../../Components/Maquina/Tag.jsx";
import iconAdvice from "../../Imagenes/sirena.png"
import '../../Page/Maquinas/PageMaquinas.jsx';
import CustomDialog from "../../Components/General/CustomDialog.jsx";

import axios from '../../http-common.js';

function PageMaquinas() {
  const [Desabilitar, setDesabilitar] = useState(false)
  const toast = useRef(null);
  const { http, getToken, deleteToken } = AuthUser();
  const [proveedores, setProveedores] = useState([]);
  const [perteneces, setPerteneces] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [maquinaServicios, setMaquinaServicios] = useState([]);
  const [isVisibleDialogCustomNotify, setIsVisibleDialogCustomNotify] = useState(false)
  let count = 1;
  const [maquina, setMaquina] = useState({
    id: 0,
    codigo: "",
    nombre: "",
    proveedor: null,
    proveedor_id: null,
    pertenece: null,
    pertenece_id: null,
    ubicacion: null,
    ubicacion_id: null,
    //electricidad: "",
    //gas: "",
    fecha_ultimo_mantenimiento: "",
    estado_mantenimiento: "",
    cantidad_dias_mantenimiento: "",
    maquinaServicios: [],
  });
  const [maquinaServicio, setMaquinaServicio] = useState({
    id: 0,
    maquina_id: maquina.id,
    maquina: maquina,
    servicio: "",
    servicio_id: null,
    consumo: "",
  });
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleMantenimiento, setVisibleMantenimiento] = useState(false);
  const [visibleMaquinaServicios, setVisibleMaquinaServicios] = useState(false);
  const [visibleCreateMaquinaServicio, setVisibleCreateMaquinaServicio] = useState(false);
  const [visibleDeleteMaquinaServicio, setVisibleDeleteMaquinaServicio] = useState(false);
  const [select, setSelect] = useState(null);
  const [selectMaquinaServicio, setSelectMaquinaServicio] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [globalFilterMaquinaServicio, setGlobalFilterMaquinaServicio] = useState(null);
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [selectedComentario, setSelectedComentario] = useState('');

  //datos para alerta de mantenimiento
  const [valorInputAlerta, setValorInputAlerta] = useState();
  const [valorGetAlerta, setValorGetAlerta] = useState('');


  const getAllProveedores = () => {
    http.get("/proveedores/get")
      .then((response) => {
        setProveedores(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAllPerteneces = () => {
    http.get("/pertenece/get")
      .then((response) => {
        setPerteneces(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAllUbicaciones = () => {
    http.get("/ubicaciones/get")
      .then((response) => {
        setUbicaciones(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAllMaquinas = () => {
    http.get("/maquinas/get")
      .then((response) => {
        setMaquinas(response.data.data);
        const options = response.data.data.map(materia => ({
          nombre: materia.nombre,
          fecha_ultimo_mantenimiento: materia.fecha_ultimo_mantenimiento,
        }));
        localStorage.setItem("maquinas", JSON.stringify(options));

        console.log(options)
        localStorage.setItem("maquinas", JSON.stringify(options));

      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAllMaquinasServicios = (id) => {
    http.get(`/maquinasservicios/get/${id}`)
      .then((response) => {
        setMaquinaServicios(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAllServicios = () => {
    http.get("/servicios/get")
      .then((response) => {
        setServicios(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getAllProveedores();
    getAllPerteneces();
    getAllUbicaciones();
    getAllMaquinas();
    getAllMaquinasServicios();
    validarMaquinasConServicios();
  }, [setProveedores]);


  //necesario para el crud
  const actionBodyTemplateEdit = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning p-button-outlined"
          onClick={() => editMaquina(rowData)}
        />
      </React.Fragment>
    );
  };
  // const actionBodyTemplateMaquinaServicios = (rowData) => {
  //   return (
  //     <React.Fragment>
  //       <Button
  //         icon="pi pi-align-justify"
  //         className="p-button-rounded p-button-warning p-button-outlined"
  //         onClick={() => serviciosMaquina(rowData)}
  //       />
  //     </React.Fragment>
  //   );
  // };

  // Función para validar máquinas con servicios
  const validarMaquinasConServicios = () => {
    http.get("/maquinas/get")
      .then((responseMaquinas) => {
        const maquinasData = responseMaquinas.data.data;

        Promise.all(maquinasData.map(maquina =>
          http.get(`/maquinasservicios/get/${maquina.id}`)
            .then(responseServicios => ({
              ...maquina,
              tieneServicios: responseServicios.data.size > 0
            }))
            .catch(() => ({
              ...maquina,
              tieneServicios: false
            }))
        ))
          .then(maquinasConValidacion => {
            setMaquinas(maquinasConValidacion);
          })
          .catch(error => {
            console.error("Error al validar máquinas con servicios:", error);
          });
      })
      .catch(error => {
        console.error("Error al obtener máquinas:", error);
      });
  };

  const actionBodyTemplateMaquinaServicios = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-align-justify"
          className={`p-button-rounded ${rowData.tieneServicios ? 'p-button-success' : 'p-button-danger'} p-button-outlined`}
          onClick={() => serviciosMaquina(rowData)}
        />
      </React.Fragment>
    );
  };

  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  function formatDate(date) {
    return [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('-');
  }

  const actionBodyTemplateCalendar = (rowData) => {

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0)
    const ultimoMantenimiento = new Date(rowData?.fecha_ultimo_mantenimiento);
    ultimoMantenimiento.setHours(0, 0, 0, 0)

    // Sumar un día a la fecha del último mantenimiento si es necesario
    ultimoMantenimiento.setDate(ultimoMantenimiento.getDate() + 1);

    // Obtener la cantidad de días de mantenimiento
    const cantidadDiasMantenimiento = rowData.cantidad_dias_mantenimiento;

    // Calcular la diferencia en milisegundos entre las fechas
    const diferenciaTiempo = hoy.getTime() - ultimoMantenimiento.getTime();

    // Calcular la diferencia en días
    const diasPasados = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24));


    return (
      <React.Fragment>
        {diasPasados <= cantidadDiasMantenimiento ? (
          <Button
            icon="pi pi-calendar"
            className={`p-button-rounded p-button-success p-button-outlined`}
            disabled
          />
        ) : (
          <Button
            icon="pi pi-calendar"
            className={`p-button-rounded p-button-danger p-button-outlined`}
            onClick={() => confirmMantenimientoMaquina(rowData)}
          />
        )}
      </React.Fragment>
    );
  };

  const actionBodyTemplateDelete = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-outlined"
          onClick={() => confirmDeleteMaquina(rowData)}
        />
      </React.Fragment>
    );
  };
  const actionBodyTemplateDeleteMaquinasServicios = (rowData) => {
    return (
      <div className="">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning p-button-outlined mr-2"
          onClick={() => openDialogMaquinaServiciosEdit(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-outlined"
          onClick={() => confirmDeleteMaquinaServicio(rowData)}
        />

      </div>


    );
  };
  const confirmDeleteMaquina = (maquina) => {
    setMaquina(maquina);
    setVisibleDelete(true);
    confirm1();
  };
  const confirmMantenimientoMaquina = (maquina) => {
    setMaquina(maquina);
    setVisibleMantenimiento(true);
  };
  const editMaquina = (maquina) => {
    setMaquina(maquina);
    setVisibleEdit(true);
  };
  const serviciosMaquina = (maquina) => {
    setMaquina(maquina);
    setMaquinaServicio({
      maquina_id: maquina.id,
      servicio_id: null,
      servicio: null,
      consumo: "",
    });
    getAllMaquinasServicios(maquina.id);
    setVisibleMaquinaServicios(true);
    getAllServicios();
  };
  const hideDialogMaquinaServicios = () => {
    cleanMaquina();
    setVisibleMaquinaServicios(false);
    cleanMaquinaServicio();
  };
  const hideDialogMaquinaServiciosCreate = () => {
    cleanMaquinaServicio();
    setVisibleCreateMaquinaServicio(false);
  };
  const openDialogMaquinaServiciosEdit = (rowData) => {
    cleanMaquinaServicio();
    setVisibleCreateMaquinaServicio(true);
    console.log("darta", rowData)
    setMaquinaServicio(
      {
        id: rowData?.id,
        maquina_id: rowData?.maquina_id,
        servicio: rowData?.servicio,
        servicio_id: rowData?.servicio_id,
        consumo: rowData?.consumo,
      }
    )

  };
  const confirmDeleteMaquinaServicio = (maquina) => {
    setMaquinaServicio(maquina);
    setVisibleDeleteMaquinaServicio(true);
  };
  //para el modal de crear
  const hideDialog = () => {
    //setSubmitted(false);
    cleanMaquina();
    setVisibleCreate(false);
    setVisibleEdit(false);
  };
  const hideDialogEdit = () => {
    //setSubmitted(false);
    cleanMaquina();
    setVisibleEdit(false);
  };

  

  const productDialogFooter = (
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
          if (maquina.nombre.length == 0) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe ingresar un nombre de una Máquina"
            );
          } else {
            handleSubmitCreate();
            hideDialog();
          }
        }}
        disabled={Desabilitar}
      />
    </React.Fragment>
  );
  const MaquinaDialogFooterUpdate = (
    <React.Fragment>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-danger"
        onClick={() => {
          hideDialogEdit();
          toast.current.show({
            severity: "info",
            summary: "Rechazada",
            detail: "No se realizo ninguna acción",
            life: 3000,
          });
        }}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        className="p-button-success"
        onClick={() => {
          if (maquina.nombre.length == 0) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe ingresar un nombre de una Máquina"
            );
          } else {
            handleSubmitUpdate();
            hideDialogEdit();
          }
        }}
      />
    </React.Fragment>
  );
  const productDialogFooterMaquinaServicioCreate = (
    <React.Fragment>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-danger"
        onClick={hideDialogMaquinaServiciosCreate}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        className="p-button-success"
        onClick={() => {
          if (maquinaServicio.consumo.length == 0) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe ingresar un Consumo"
            );
          } else {
            handleSubmitCreateMaquinaServicio();
            hideDialogMaquinaServiciosCreate();
          }
        }}
      />
    </React.Fragment>
  );

  const handleChangeCodigo = (e) => {
    setMaquina({
      id: maquina.id,
      codigo: e.target.value,
      nombre: maquina.nombre,
      proveedor: maquina.proveedor,
      proveedor_id: maquina.proveedor_id,
      pertenece: maquina.pertenece,
      pertenece_id: maquina.pertenece_id,
      ubicacion: maquina.ubicacion,
      ubicacion_id: maquina.ubicacion_id,
      //electricidad: maquina.electricidad,
      //gas: maquina.gas,
      fecha_ultimo_mantenimiento: maquina.fecha_ultimo_mantenimiento,
      estado_mantenimiento: maquina.estado_mantenimiento,
      cantidad_dias_mantenimiento: maquina.cantidad_dias_mantenimiento,
    });
  };
  const handleChangeProveedor = (e) => {
    console.log("dat", e.target);
  
    // Actualiza el estado de la máquina
    setMaquina({
      id: maquina.id,
      codigo: maquina.codigo,
      nombre: maquina.nombre,
      proveedor: e.target.value,
      proveedor_id: e.value != null ? e.value.id : e.value,
      pertenece: maquina.pertenece,
      pertenece_id: maquina.pertenece_id,
      ubicacion: maquina.ubicacion,
      ubicacion_id: maquina.ubicacion_id,
      fecha_ultimo_mantenimiento: maquina.fecha_ultimo_mantenimiento,
      estado_mantenimiento: maquina.estado_mantenimiento,
      cantidad_dias_mantenimiento: maquina.cantidad_dias_mantenimiento,
    });
  };
  const handleChangePertenece = (e) => {
    setMaquina({
      id: maquina.id,
      codigo: maquina.codigo,
      nombre: maquina.nombre,
      proveedor: maquina.proveedor,
      proveedor_id: maquina.proveedor_id,
      pertenece: e.target.value,
      pertenece_id: e.value != null ? e.value.id : e.value,
      ubicacion: maquina.ubicacion,
      ubicacion_id: maquina.ubicacion_id,
      //electricidad: maquina.electricidad,
      //gas: maquina.gas,
      fecha_ultimo_mantenimiento: maquina.fecha_ultimo_mantenimiento,
      estado_mantenimiento: maquina.estado_mantenimiento,
      cantidad_dias_mantenimiento: maquina.cantidad_dias_mantenimiento,
    });
  };
  const handleChangeUbicacion = (e) => {
    setMaquina({
      id: maquina.id,
      nombre: maquina.nombre,
      codigo: maquina.codigo,
      proveedor: maquina.proveedor,
      proveedor_id: maquina.proveedor_id,
      pertenece: maquina.pertenece,
      pertenece_id: maquina.pertenece_id,
      ubicacion: e.target.value,
      ubicacion_id: e.value != null ? e.value.id : e.value,
      //electricidad: maquina.electricidad,
      //gas: maquina.gas,
      fecha_ultimo_mantenimiento: maquina.fecha_ultimo_mantenimiento,
      estado_mantenimiento: maquina.estado_mantenimiento,
      cantidad_dias_mantenimiento: maquina.cantidad_dias_mantenimiento,
    });
  };
  const handleChangeNombre = (e) => {
    setMaquina({
      id: maquina.id,
      codigo: maquina.codigo,
      nombre: e.target.value,
      proveedor: maquina.proveedor,
      proveedor_id: maquina.proveedor_id,
      pertenece: maquina.pertenece,
      pertenece_id: maquina.pertenece_id,
      ubicacion: maquina.ubicacion,
      ubicacion_id: maquina.ubicacion_id,
      //electricidad: maquina.electricidad,
      //gas: maquina.gas,
      fecha_ultimo_mantenimiento: maquina.fecha_ultimo_mantenimiento,
      estado_mantenimiento: maquina.estado_mantenimiento,
      cantidad_dias_mantenimiento: maquina.cantidad_dias_mantenimiento,
    });
  };
  /**const handleChangeElectricidad = (e) => {
    setMaquina({
      id: maquina.id,
      codigo: maquina.codigo,
      nombre: maquina.nombre,
      proveedor: maquina.proveedor,
      proveedor_id: maquina.proveedor_id,
      pertenece: maquina.pertenece,
      pertenece_id: maquina.pertenece_id,
      ubicacion: maquina.ubicacion,
      ubicacion_id: maquina.ubicacion_id,
      electricidad: e.target.value,
      gas: maquina.gas,
      fecha_ultimo_mantenimiento: maquina.fecha_ultimo_mantenimiento,
      estado_mantenimiento: maquina.estado_mantenimiento,
      cantidad_dias_mantenimiento: maquina.cantidad_dias_mantenimiento,
    });
  };
  const handleChangeGas = (e) => {
    setMaquina({
      id: maquina.id,
      codigo: maquina.codigo,
      nombre: maquina.nombre,
      proveedor: maquina.proveedor,
      proveedor_id: maquina.proveedor_id,
      pertenece: maquina.pertenece,
      pertenece_id: maquina.pertenece_id,
      ubicacion: maquina.ubicacion,
      ubicacion_id: maquina.ubicacion_id,
      electricidad: maquina.electricidad,
      gas: e.target.value,
      fecha_ultimo_mantenimiento: maquina.fecha_ultimo_mantenimiento,
      estado_mantenimiento: maquina.estado_mantenimiento,
      cantidad_dias_mantenimiento: maquina.cantidad_dias_mantenimiento,
    });
  };**/
  const handleChangeFechaMantenimiento = (e) => {
    setMaquina({
      id: maquina.id,
      codigo: maquina.codigo,
      nombre: maquina.nombre,
      proveedor: maquina.proveedor,
      proveedor_id: maquina.proveedor_id,
      pertenece: maquina.pertenece,
      pertenece_id: maquina.pertenece_id,
      ubicacion: maquina.ubicacion,
      ubicacion_id: maquina.ubicacion_id,
      //electricidad: maquina.electricidad,
      //gas: maquina.gas,
      fecha_ultimo_mantenimiento: e.target.value,
      estado_mantenimiento: maquina.estado_mantenimiento,
      cantidad_dias_mantenimiento: maquina.cantidad_dias_mantenimiento,
    });
  };
  const handleChangeEstadoMantenimiento = (e) => {
    setMaquina({
      id: maquina.id,
      codigo: maquina.codigo,
      nombre: maquina.nombre,
      proveedor: maquina.proveedor,
      proveedor_id: maquina.proveedor_id,
      pertenece: maquina.pertenece,
      pertenece_id: maquina.pertenece_id,
      ubicacion: maquina.ubicacion,
      ubicacion_id: maquina.ubicacion_id,
      //electricidad: maquina.electricidad,
      //gas: maquina.gas,
      fecha_ultimo_mantenimiento: maquina.fecha_ultimo_mantenimiento,
      cantidad_dias_mantenimiento: e.target.value,
    });
  };
  const handleChangeMaquina = (e) => {
    setMaquinaServicio({
      id: maquinaServicio.id,
      maquina: e.target.value,
      maquina_id: e.value != null ? e.value.id : e.value,
      servicio: maquinaServicio.servicio,
      servicio_id: maquinaServicio.servicio_id,
      consumo: maquinaServicio.consumo,
    });
  };
  const handleChangeServicio = (e) => {
    setMaquinaServicio({
      id: maquinaServicio.id,
      maquina: maquinaServicio.maquina,
      maquina_id: maquinaServicio.maquina_id,
      servicio: e.target.value,
      servicio_id: e.value != null ? e.value.id : e.value,
      consumo: maquinaServicio.consumo,
    });
    console.log("maquina-ser", maquinaServicio?.servicio?.unidad_medida_servicio?.nombre)
  };
  const handleChangeConsumo = (e) => {
    setMaquinaServicio({
      id: maquinaServicio.id,
      maquina: maquinaServicio.maquina,
      maquina_id: maquinaServicio.maquina_id,
      servicio: maquinaServicio.servicio,
      servicio_id: maquinaServicio.servicio_id,
      consumo: e.target.value,
    });
  };
  const cleanMaquina = () => {
    setMaquina({
      id: 0,
      codigo: "",
      nombre: "",
      proveedor: null,
      proveedor_id: null,
      pertenece: null,
      pertenece_id: null,
      ubicacion: null,
      ubicacion_id: null,
      //electricidad: "",
      //gas: "",
      fecha_ultimo_mantenimiento: "",
      estado_mantenimiento: "",
      cantidad_dias_mantenimiento: "",
    });
  };
  const cleanMaquinaServicio = () => {
    setMaquinaServicio({
      id: 0,
      maquina: null,
      maquina_id: maquina.id,
      servicio: null,
      servicio_id: null,
      consumo: "",
    });
  };
  /*const confirmManteniento = () => {
    confirmDialog({
      message: `Esta seguro de que se realizo el mantenimiento de la maquina ${maquina.nombre}`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept2,
      reject2,
    });
  };*/
  const accept2 = () => {
    handleSubmitMantenimiento();
  };
  const accept3 = () => {
    handleSubmitDeleteMaquinaServicio();
  };
  const reject2 = () => {
    showToast(
      "info",
      "Mantenimiento de máquina",
      `No se realizo ninguna acción`
    );
  };
  const accept = () => {
    handleSubmitDelete();
  };

  const reject = () => {
    toast.current.show({
      severity: "info",
      summary: "Rechazada",
      detail: "No se realizo ninguna acción",
      life: 3000,
    });
  };
  const handleSubmitCreate = () => {
    setDesabilitar(true)
    http.post("/maquinas/create", maquina)
      .then((response) => {
        showToast(
          "success",
          "Maquina Creada",
          `Se creo la maquina ${maquina.nombre} correctamente`
        );
        getAllMaquinas();
        validarMaquinasConServicios();
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "danger",
          "Maquina No Creada",
          `No Se creo la maquina ${maquina.nombre}`
        );
      })
      .finally(()=>{
        setTimeout(() => {
          setDesabilitar(false);
        }, 5000);
      })
  };
  const handleSubmitUpdate = () => {
    http.put(`/maquinas/update/${maquina.id}`, maquina)
      .then((response) => {
        showToast(
          "success",
          "Maquina Editada",
          `Se Edito la maquina ${maquina.nombre} correctamente`
        );
        getAllMaquinas();
        validarMaquinasConServicios();
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "error",
          "Maquina No Creada",
          `No Se creo la maquina ${maquina.nombre}`
        );
      });
  };

  const handleSubmitDelete = () => {
    http.delete(`/maquinas/delete/${maquina.id}`)
      .then((response) => {
        showToast(
          "success",
          "Maquina Eliminada",
          `Se elimino correctamente la maquina ${maquina.nombre}`
        );
        getAllMaquinas();
        validarMaquinasConServicios();
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "error",
          "Maquina No Eliminada",
          `No Se creo la maquina ${maquina.nombre}`
        );
      });
  };
  const handleSubmitMantenimiento = () => {
    http.put(`/maquinas/mantenimiento/${maquina.id}`, maquina)
      .then((response) => {
        showToast(
          "success",
          "Mantenimiento exitoso",
          `Se realizo correctamente el mantenimiento de la maquina ${maquina.nombre}`
        );
        getAllMaquinas();
        validarMaquinasConServicios();
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "error",
          "Maquina no mantenida",
          `No ser relizo acción ${maquina.nombre}`
        );
      });
  };
  const handleSubmitCreateMaquinaServicio = () => {
    console.log("DATOS", maquinaServicio)
    if (maquinaServicio?.id && maquinaServicio?.id !== 0) {
      http.put(`maquinasservicios/update/${maquinaServicio?.id}`, maquinaServicio)
        .then((response) => {
          showToast(
            "success",
            "Servicio Actualizado",
            `Se actualizo el servicio correctamente`
          );
          getAllMaquinasServicios(maquina.id);
          validarMaquinasConServicios();
        })
        .catch((error) => {
          console.log(error);
          showToast(
            "error",
            "Servicio No Agregado",
            `No Se agregó el servicio`
          );
        });



    } else {
      http.post("/maquinasservicios/create", maquinaServicio)
        .then((response) => {
          showToast(
            "success",
            "Servicio Agregado",
            `Se agregó el servicio correctamente`
          );
          getAllMaquinasServicios(maquina.id);
          validarMaquinasConServicios();
        })
        .catch((error) => {
          console.log(error);
          showToast(
            "error",
            "Servicio No Agregado",
            `No Se agregó el servicio`
          );
        });

    }


  };
  const handleSubmitDeleteMaquinaServicio = () => {
    http.delete(`/maquinasservicios/delete/${maquinaServicio.id}`)
      .then((response) => {
        showToast(
          "success",
          "Servicio Eliminado",
          `Se elimino correctamente el servicio`
        );
        getAllMaquinasServicios(maquina.id);
        validarMaquinasConServicios();
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "errro",
          "Servicio No Eliminado",
          `No Se Elimino el servicio`
        );
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

  const ConvertValueToOption = (data, options) => {
    const option = options?.find((option) => option?.id === data?.id);
    return option || null;
  }

  const [days, setDays] = useState('');

  const TemplateFooterMantNotify = () => {
    return (<>
      <div className="contenedor-boton-alerta" style={{ display: "flex", justifyContent: 'space-between' }}>
        <Button label="Cancelar" icon="pi pi-times" style={{ backgroundColor: '#F85E6A', border: '1px solid #F85E6A' }} onClick={hideDialogNotify} />
        <Button label="Guardar" className="btn-notify-save" icon="pi pi-save" onClick={clearInput} />
      </div>
    </>)
  }

  const TemplateHeaderMantNotify = () => {
    return (<>
      <div className="contenedor-boton-alerta" style={{ display: "flex", justifyContent: 'space-between', fontWeight: 'normal' }}>
        <p><span style={{ fontWeight: 'bold' }}>Mantenimiénto:</span> <span>cada {valorGetAlerta.dias_prev_aler_fech_mant} días</span></p>
      </div>
    </>)
  }

  const getDatosAlerta = async () => {
    const repuesta_alerta = await axios.http.get('configuracion/get');
    console.log(repuesta_alerta)
    setValorGetAlerta(repuesta_alerta.data);
  }

  useEffect(() => {
    getDatosAlerta();
  }, []);

  const putDatosAlerta = async () => {

    try {
      const datos_envio = {
        dias_prev_aler_fech_mant: parseInt(valorInputAlerta)
      }
      const respuesta_alerta = await axios.http.put('configuracion/update', datos_envio);

      if (valorInputAlerta && !isNaN(valorInputAlerta)) {

        const maquinas = JSON.parse(localStorage.getItem("maquinas"));
         // Calcular las fechas de alerta y guardarlas en localStorage
         const alertDates = maquinas.map(materia => ({
           nombre: materia.nombre,
           fecha_alerta: calculateFutureDate(materia.fecha_ultimo_mantenimiento, valorInputAlerta),
           fecha_mantenimiento:materia.fecha_ultimo_mantenimiento,
         }));
   
         console.log(alertDates);
   
         localStorage.setItem("alertDates", JSON.stringify(alertDates));


        showToast(
          "success",
          "Mantenimiento creado.",
          "Se creo correctamento el dia del mantenimiento."
        );
        hideDialogNotify()
        getDatosAlerta();
      } else {
        console.log('Por favor, ingrese un número válido de días.');
      }
      console.log(respuesta_alerta);
    } catch (error) {
      showToast(
        "error",
        "Error de crear",
        "No se pudo crear el día de mantenimiénto"
      );
      console.log(error.response.status);
    }
  }

  
  // Función para calcular la fecha futura
  const calculateFutureDate = (dateString, days) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() - days);
    return date.toISOString(); // Devuelve la fecha en formato ISO 8601 completo
  };
  const showDialogNotify = () => {
    setIsVisibleDialogCustomNotify(true)
  }
  const hideDialogNotify = () => {
    setIsVisibleDialogCustomNotify(false)
  }

  const handleChange = (e) => {
    const value = e.target.value;
    const numValue = Number(value);

    if (value === '' || (numValue >= 1 && numValue <= 31)) {
      setValorInputAlerta(value);
    }
  };

  const clearInput = () => {
    putDatosAlerta()
    setValorInputAlerta('');
  };

  const formatValue = (value) => {
    if (value === null || value === '' || value === undefined) {
      return '---';
    }
    return value;
  };
  const itemTemplate = (option) => {
    return (
      <div style={{ padding: '8px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{option.razon_social}</div>
        <div style={{ color: 'black', fontSize: '12px', marginTop: '4px', paddingLeft: '10px', display: 'flex', alignItems: 'center' }}>
          <span>{option.contactos && option.contactos.length > 0 ? option.contactos[0].contacto : ''}</span>
          <span style={{ marginLeft: '10px', fontSize: '12px' }}>
            {option.contactos && option.contactos.length > 0 ? option.contactos[0].comentario : ''}
          </span>
        </div>
      </div>
    );
};


  
  return (
    <>
      <Container url="getMaquinas">
        <Toast ref={toast} />
        <div className="p-container-header">
          <div className="p-container-titulo">
            <h1 style={{ color: '#04638A' }} className="container-titulo-table">Lista de Máquinas</h1>
          </div>
          <div className="container-descripcion">
            <div className="container-descripcion-table">
              <p>
                A continuación, se visualiza la lista de máquinas registradas en
                el sistema
              </p>
            </div>
            <div className="container-descripcion-button-add mr-7 flex gap-4 align-items-center">
              <div className="btn-dialog-notificacion-mantenimiento">
                <Button className="btn-advice-setting " onClick={showDialogNotify}>
                  <span>!</span>
                </Button>
              </div>
              <button
                onClick={() => {
                  cleanMaquina();
                  setVisibleCreate(true);
                }}
                className="boton"
              >
                Crear Máquina <i className="pi pi-plus"></i>
              </button>
            </div>
          </div>
        </div>
        <CustomDialog
          footer={TemplateFooterMantNotify}
          header={TemplateHeaderMantNotify}
          visible={isVisibleDialogCustomNotify}
          setVisible={setIsVisibleDialogCustomNotify}
          hide={hideDialogNotify}
          style={{ width: "30vw", height: "450px" }}
        >
          <div className="CustomNotify">
            <div className="CustomNotify__container-icon-advice ">
              <img src={iconAdvice} alt="" />
            </div>
            <div className="CustomNotify__message-advice">
              <p>Definir dias previos a la alerta</p>
            </div>
            <div className="CustomNotify__field-days-notify">
              <InputText
                type="number"
                value={valorInputAlerta}
                onChange={handleChange}
                keyfilter="int"
                min="1"
                max="31"
              />
            </div>
          </div>
        </CustomDialog>
        <Table
          onInputSearch={(e) => setGlobalFilter(e.target.value)}
          valueGlobalFilter={globalFilter}
          data={maquinas}
          selection={select}
          onSelectionChange={(e) => {
            setSelect(e.value);
          }}

          onClickRefresh={getAllMaquinas}
        >
          <Column data-label="co" field={"codigo"} header="Código" className="column column-code" body={(rowData) => formatValue(rowData.codigo)} ></Column>
          <Column
            data-label="pro"
            field={"proveedor" != null ? "proveedor.razon_social" : "proveedor"}
            header="Proveedor"
            className="column column-provider"
          ></Column>
          <Column
            data-label="pertenece"
            field={"pertenece" != null ? "pertenece.nombre" : "pertenece"}
            header="Pertenece"
            className="column column-pertain"
          ></Column>
          <Column
            data-label="ubi"
            field={"ubicacion" != null ? "ubicacion.nombre" : "ubicacion"}
            header="Ubicación"
            className="column column-location"
          ></Column>

          <Column data-label="ss" field={"nombre"} header="Nombre" className="column column-name" body={(rowData) => formatValue(rowData.nombre)}></Column>
          {/**<Column field="electricidad" header="Electricidad"></Column>
          <Column field="gas" header="Gas"></Column>**/}

          {
            <Column
              data-label="estado"
              field="estado_mantenimiento"
              body={actionBodyTemplateCalendar}
              exportable={true}
              header="Estado Mant"
              className="column column-state"
            ></Column>
          }
          <Column
            data-label="servicio"
            header="Servicios"
            body={actionBodyTemplateMaquinaServicios}
            exportable={false}
            style={{ minWidth: "8rem" }}
            className="column column-service"
          ></Column>
          <Column
            data-label="fehcha"
            field="fecha_ultimo_mantenimiento"
            header="Fecha Ult. Mant."
            className="column column-date"
            body={(rowData) => formatValue(rowData.fecha_ultimo_mantenimiento)}
          ></Column>
          <Column
            data-label="editar"
            header="Editar"
            body={actionBodyTemplateEdit}
            exportable={false}
            style={{ minWidth: "8rem" }}
            className="column column-edit"
          ></Column>
          <Column
            data-label="eliminar"
            body={actionBodyTemplateDelete}
            header="Eliminar"
            exportable={false}
            style={{ minWidth: "8rem" }}
            className="column column-delete"
          ></Column>

        </Table>


        <Dialog
          visible={visibleCreate}
          style={{ width: "450px" }}
          header={
            <>
              <i className="pi pi-briefcase icon-create-proveedor"></i>Crear
              Máquinas
            </>
          }
          modal
          className="p-fluid"
          footer={productDialogFooter}
          onHide={hideDialog}
        >
          <div className="field">
            <label htmlFor="nombre">Nombre</label>
            <InputText
              id="nombre"
              value={maquina.nombre}
              onChange={(e) => handleChangeNombre(e)}
              required
              autoComplete="off"
              pa
            />
          </div>
          <div className="field">
            <label htmlFor="codigo">Código</label>
            <InputText
              id="codigo"
              value={maquina.codigo}
              onChange={(e) => handleChangeCodigo(e)}
              required
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label htmlFor="proveedor">Proveedor</label>
            <Dropdown
              id="proveedor"
              value={maquina.proveedor}
              options={proveedores}
              onChange={handleChangeProveedor}  // Usar la función que manejas para actualizar la máquina
              itemTemplate={itemTemplate}  // Personalizamos la visualización del Dropdown
              optionLabel="razon_social"              
              placeholder="Seleccione un proveedor"

              filter
            />
          </div>
          <div className="field">
            <label htmlFor="pertenece">Pertenece</label>
            <Dropdown
              id="pertenece"
              value={maquina.pertenece}
              options={perteneces}
              onChange={handleChangePertenece}
              optionLabel="nombre"
              placeholder="Seleccione lugar a donde Pertenece"

              filter
            />
          </div>
          <div className="field">
            <label htmlFor="ubicacion">Ubicación</label>
            <Dropdown
              id="ubicacion"
              value={maquina.ubicacion}
              options={ubicaciones}
              onChange={handleChangeUbicacion}
              optionLabel="nombre"
              placeholder="Seleccione una Ubicación"

              filter
            />
          </div>

          {/**<div className="field">
            <label htmlFor="electricidad">Electricidad</label>
            <InputText
              id="electricidad"
              value={maquina.electricidad}
              onChange={(e) => handleChangeElectricidad(e)}
              required
              keyfilter="num"
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label htmlFor="gas">Gas</label>
            <InputText
              id="gas"
              value={maquina.gas}
              onChange={(e) => handleChangeGas(e)}
              required
              keyfilter="num"
              autoComplete="off"
            />
          </div>**/}
          <div className="field">
            <label htmlFor="fecha_mantenimiento">
              Fecha del último Mantenimiento
            </label>
            <InputText
              id="fecha_mantenimiento"
              value={maquina.fecha_ultimo_mantenimiento}
              onChange={(e) => handleChangeFechaMantenimiento(e)}
              required
              type="date"
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label htmlFor="estado_mantenimiento">Días de mantenimiento</label>
            <InputText
              id="estado_mantenimiento"
              value={maquina.cantidad_dias_mantenimiento}
              onChange={(e) => handleChangeEstadoMantenimiento(e)}
              required
              autoComplete="off"
            />
          </div>

        </Dialog>

        <Dialog
          visible={visibleEdit}
          style={{ width: "450px" }}
          header={
            <>
              <i className="pi pi-briefcase icon-create-proveedor"></i>Editar
              Maquina
            </>
          }
          modal
          className="p-fluid"
          footer={MaquinaDialogFooterUpdate}
          onHide={hideDialog}
        >
          <div className="field">
            <label htmlFor="codigo">Código</label>
            <InputText
              id="codigo"
              value={maquina.codigo}
              onChange={(e) => handleChangeCodigo(e)}
              required
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label htmlFor="proveedor">Proveedor</label>
            <Dropdown
              id="proveedor"
              value={ConvertValueToOption(maquina?.proveedor, proveedores)}
              options={proveedores}
              onChange={handleChangeProveedor}
              optionLabel="razon_social"
              placeholder="Seleccione un Proveedor"

              filter
            />
          </div>
          <div className="field">
            <label htmlFor="pertenece">Pertenece</label>
            <Dropdown
              id="pertenece"
              value={maquina.pertenece}
              options={perteneces}
              onChange={handleChangePertenece}
              optionLabel="nombre"
              placeholder="Seleccione un lugar a donde Pertenece"

              filter
            />
          </div>
          <div className="field">
            <label htmlFor="ubicacion">Ubicación</label>
            <Dropdown
              id="ubicacion"
              value={maquina.ubicacion}
              options={ubicaciones}
              onChange={handleChangeUbicacion}
              optionLabel="nombre"
              placeholder="Seleccione una Ubicación"

              filter
            />
          </div>
          <div className="field">
            <label htmlFor="nombre">Nombre</label>
            <InputText
              id="nombre"
              value={maquina.nombre}
              onChange={(e) => handleChangeNombre(e)}
              required
              placeholder="Ingrese un nombre"
            />
          </div>
          {/**<div className="field">
            <label htmlFor="electricidad">Electricidad</label>
            <InputText
              id="electricidad"
              value={maquina.electricidad}
              onChange={(e) => handleChangeElectricidad(e)}
              required
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label htmlFor="gas">Gas</label>
            <InputText
              id="gas"
              value={maquina.gas}
              onChange={(e) => handleChangeGas(e)}
              required
              autoComplete="off"
            />
        </div>**/}
          <div className="field">
            <label htmlFor="fecha_mantenimiento">Fecha Mantenimiento</label>

            <InputText
              id="fecha_mantenimiento"
              value={maquina.fecha_ultimo_mantenimiento}
              onChange={(e) => handleChangeFechaMantenimiento(e)}
              type="date"
              required
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label htmlFor="estado_mantenimiento">
              Cantidad de días para mantenimiento
            </label>
            <InputText
              id="estado_mantenimiento"
              value={maquina.cantidad_dias_mantenimiento}
              onChange={(e) => handleChangeEstadoMantenimiento(e)}
              required
              autoComplete="off"
            />
          </div>
        </Dialog>
        <ConfirmDialog
          visible={visibleMantenimiento}
          onHide={() => setVisibleMantenimiento(false)}
          message={`Esta seguro de que se realizó el mantenimiento de la máquina ${maquina.nombre}`}
          header="Confirmación"
          icon="pi pi-exclamation-triangle"
          accept={accept2}
          reject={reject2}
          acceptLabel="Si"
        />
        <ConfirmDialog
          visible={visibleDelete}
          onHide={() => {
            setVisibleDelete(false);
            cleanMaquina();
          }}
          message={`Esta seguro de eliminar la Maquina ${maquina.nombre}`}
          header="Confirmación"
          icon="pi pi-exclamation-triangle"
          accept={accept}
          reject={reject}
          acceptLabel="Si"
        />
      </Container>

      <Dialog
        visible={visibleMaquinaServicios}
        style={{ width: "80vw", backgroundColor: "#F7F7F8 !important" }}
        header={
          <>
            <i className="pi pi-users icon-create-proveedor"></i>Servicios de la máquina {maquina.nombre}
          </>
        }
        modal
        className="p-fluid container-descripcion-modal-locales-dialog "

        onHide={hideDialogMaquinaServicios}
      >
        <div className="p-container-titulo">
          <h1 className="container-titulo-table">Lista de Servicios</h1>
        </div>
        <div className="container-descripcion container-descripcion-modal-locales">
          <div className="container-descripcion-table">
            <p>
              A continuación, se visualiza los servicios de la máquina{" "}
              {maquina.nombre} registrados en el sistema.
            </p>
          </div>
          <div className="container-descripcion-button-add">
            <button
              onClick={() => {
                setVisibleCreateMaquinaServicio(true);
              }}
              className="button button-crear"
            >
              Agregar Servicio <i className="pi pi-plus mr-2"></i>
            </button>
          </div>
        </div>
        <div className="cliente-locales-container">
          <div className="cliente-table-locales">
            <div className="card-table-servicios-maquinas">
              <ListServicios
                data={maquinaServicios}
                selection={selectMaquinaServicio}
                onSelectionChange={(e) => {
                  setSelectMaquinaServicio(e.value);
                }}
                onClickRefresh={() => getAllMaquinasServicios(maquina.id)}
                onInputSearch={(e) => setGlobalFilterMaquinaServicio(e.target.value)}
                valueGlobalFilter={globalFilterMaquinaServicio}
              >
                <Column
                  field={"servicio" != null ? "servicio.nombre" : "servicio"}
                  header="Nombre"
                  className="column column-name"
                ></Column>
                <Column field={"consumo"} header="Consumo" className="column column-consumo"></Column>
                <Column
                  field={"servicio" != null ? "servicio.unidad_medida_servicio.abreviatura" : "servicio"}
                  header="Medida"
                  className="column column-medida"
                ></Column>
                <Column
                  body={actionBodyTemplateDeleteMaquinasServicios}
                  header="Operaciones"
                  exportable={false}
                  style={{ minWidth: "8rem" }}
                  className="column column-delete"
                ></Column>

              </ListServicios>
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog
        visible={visibleCreateMaquinaServicio}
        style={{ width: "450px" }}
        header={
          <>
            <i className="pi pi-users icon-create-proveedor"></i>Lista de
            Servicios
          </>
        }
        modal
        className="p-fluid"
        footer={productDialogFooterMaquinaServicioCreate}
        onHide={hideDialogMaquinaServiciosCreate}
      >
        <div className="field">
          <label htmlFor="servicio">Servicio</label>
          <Dropdown
            id="servicio"
            value={maquinaServicio.servicio}
            options={servicios}
            onChange={handleChangeServicio}
            optionLabel="nombre"
            placeholder="Seleccione un Servicio"

            filter
          />
        </div>
        <div className="field">
          <label htmlFor="consumo">Consumo por hora</label>
          <div className="field-input flex relative">
            <InputText
              id="consumo"
              value={maquinaServicio.consumo}
              onChange={(e) => handleChangeConsumo(e)}
              required
              autoComplete="off"
              type="number"
              className="pr-6"


            />
            <span className="p-inputgroup-addon absolute  " style={{ height: "100%", marginLeft: "100px"}}>
              {maquinaServicio?.servicio === null ||
                !maquinaServicio?.servicio.hasOwnProperty("unidad_medida_servicio")
                ? ""
                : maquinaServicio?.servicio?.unidad_medida_servicio?.abreviatura}
            </span>

          </div>



        </div>
      </Dialog>

      <ConfirmDialog
        visible={visibleDeleteMaquinaServicio}
        onHide={() => {
          setVisibleDeleteMaquinaServicio(false);
          cleanMaquinaServicio();
        }}
        message={`Esta seguro de eliminar el servicio`}
        header="Confirmación"
        icon="pi pi-exclamation-triangle"
        acceptLabel="Sí"
        accept={accept3}
        reject={reject}
      />

    </>
  );
}

export default PageMaquinas;

