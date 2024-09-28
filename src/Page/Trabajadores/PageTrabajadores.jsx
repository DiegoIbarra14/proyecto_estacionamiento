import React, { useEffect, useState, useRef } from "react";
import { Column } from "primereact/column";
import Table from "../../Components/Trabajador/Table";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import "./pageTrabajadores.css";
import { ConfirmDialog } from "primereact/confirmdialog";
import Container from "../../Components/Container/Container";
import AuthUser from '../../AuthUser';
import { logout } from "../../reducers/authSlices";
import { useDispatch } from "react-redux";
export default function PageTrabajadores() {
  const [Desabilitar, setDesabilitar] = useState(false)
  const toast = useRef(null);
  const { http, getToken, deleteToken } = AuthUser();
  const [my, setMy] = useState(null);
  const [tiposTrabajadores, setTiposTrabajadores] = useState([]);
  const [tiposDocumentos, setTiposDocumentos] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  let count = 1;
  const [trabajador, setTrabajador] = useState({
    id: 0,
    tipo_documento: null,
    tipo_documento_id: null,
    numero_documento: "",
    nombres: "",
    apellidos: "",
    tipo_trabajador: null,
    tipo_trabajador_id: null,
    sueldo: "",
    horas_mes: "",
  });
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [select, setSelect] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [showValidateDNI, setShowValidateDNI] = useState(false);
  const [valueMaxDocumento, setValueMaxDocumento] = useState(20);
  const dispatch = useDispatch()
  const getAllTiposTrabajadores = () => {
    http.get("/tipostrabajadores/get")
      .then((response) => {
        setTiposTrabajadores(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InlvY29qMTI3ODRAYmFjYWtpLmNvbSJ9.YHSqYX_C3RpegTKD9V7RLxH3eOLyPwK-AajOIegQBtc
  // https://dniruc.apisperu.com/api/v1/dni/12345678?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InlvY29qMTI3ODRAYmFjYWtpLmNvbSJ9.YHSqYX_C3RpegTKD9V7RLxH3eOLyPwK-AajOIegQBtc
  // https://dniruc.apisperu.com/api/v1/ruc/20131312955?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InlvY29qMTI3ODRAYmFjYWtpLmNvbSJ9.YHSqYX_C3RpegTKD9V7RLxH3eOLyPwK-AajOIegQBtc
  const getAllTiposDocumentos = () => {
    http.get("/usuarios/tiposdocumentos/get")
      .then((response) => {
        const filteredDocumentos = response.data.data.filter(
          (tipo) => tipo.nombre !== "RUC"
        );
        setTiposDocumentos(filteredDocumentos);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAllTrabajadores = () => {
    http.get("/trabajadores/get")
      .then((response) => {
        setTrabajadores(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getAllTiposDocumentos();
    getAllTiposTrabajadores();
    getAllTrabajadores();
  }, [setTiposTrabajadores]);

  useEffect(() => {
    handleMy();
  }, []);

  const handleMy = async () => {
    try {


      const response = await http.post("/my");
      setMy(response.data);
      if (!response.data.status) {

      } else {
        dispatch(logout())
        // deleteToken();
      }
    } catch (e) {
      console.log(e);
    }
  };
  const getKeyFilter = () => {
    switch (trabajador.tipo_documento?.nombre) {
      case "DNI":
        return 'int';
      case "Carné de extranjería":
        return /^[a-zA-Z0-9]*$/;
      case "Pasaporte":
        return /^[a-zA-Z0-9]*$/;
      default:
        return /^[a-zA-Z0-9]*$/;
    }
  };
  //necesario para el crud
  const actionBodyTemplateEdit = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning"
          onClick={() => editTrabajador(rowData)}
        />
      </React.Fragment>
    );
  };

  const actionBodyTemplateDelete = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => confirmDeleteTrabajador(rowData)}
        />
      </React.Fragment>
    );
  };
  const confirmDeleteTrabajador = (trabajador) => {
    setTrabajador(trabajador);
    setVisibleDelete(true);
    confirm1();
  };
  const editTrabajador = (trabajador) => {
    setTrabajador(trabajador);
    setVisibleEdit(true);
    if (trabajador.tipo_documento && trabajador.tipo_documento.nombre === "DNI") {
      setShowValidateDNI(true);
    } else {
      setShowValidateDNI(false);
    }
  };

  //para el modal de crear
  const hideDialog = () => {
    //setSubmitted(false);
    cleanTrabajador();
    setVisibleCreate(false);
    setVisibleEdit(false);
    setShowValidateDNI(false);
  };
  const hideDialogEdit = () => {
    //setSubmitted(false);
    cleanTrabajador();
    setVisibleEdit(false);
    setShowValidateDNI(false);
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
          if (!trabajador.tipo_documento_id) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe seleccionar un tipo de documento"
            );
          } else if (!trabajador.numero_documento) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe ingresar un número de documento"
            );
          } else if (trabajador.tipo_documento?.nombre === "DNI" && trabajador.numero_documento.length < 8) {
            showToast(
              "error",
              "Error de ingreso",
              "El número de documento debe tener al menos 8 caracteres para DNI"
            );
          } else if (trabajadores.some(c => c.numero_documento === parseInt(trabajador.numero_documento))) {
            showToast(
              "error",
              "Error de ingreso",
              "El número de documento ya existe"
            );
          } else if (!trabajador.nombres) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe ingresar un nombre de trabajador"
            );
          } else if (!trabajador.apellidos) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe ingresar los apellidos del trabajador"
            );
          } else if (!trabajador.tipo_trabajador_id) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe seleccionar un tipo de trabajador"
            );
          } else if (!trabajador.sueldo || isNaN(trabajador.sueldo) || trabajador.sueldo <= 0) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe ingresar un sueldo válido"
            );
          } else if (trabajador.horas_mes === null || trabajador.horas_mes=== '') {
            showToast(
              "error",
              "Error de ingreso",
              "Debe ingresar horas de trabajo"
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


  const TrabajadorDialogFooterUpdate = (
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
          if (!trabajador.numero_documento) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe ingresar un número de documento"
            );
          } else if (trabajador.tipo_documento?.nombre === "DNI" && trabajador.numero_documento.length < 8) {
            showToast(
              "error",
              "Error de ingreso",
              "El número de documento debe tener al menos 8 caracteres para DNI"
            );
          } else if (trabajador.nombres.length == 0) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe ingresar un nombre de un Trabajador"
            );
          } else if (!trabajador.sueldo || isNaN(trabajador.sueldo) || trabajador.sueldo <= 0) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe ingresar un sueldo válido"
            );
          } else if (trabajador.horas_mes === null || trabajador.horas_mes === '') {
            showToast(
              "error",
              "Error de ingreso",
              "Debe ingresar horas de trabajo"
            );
          } else {
            handleSubmitUpdate();
            hideDialogEdit();
          }
        }}
      />
    </React.Fragment>
  );
  // const handleChangeTipoDocumento = (e) => {
  //   const newTipoDocumento = e.target.value;
  //   setTrabajador({
  //     id: trabajador.id,
  //     // tipo_documento: e.target.value,
  //     // tipo_documento_id: e.value != null ? e.value.id : e.value,
  //     tipo_documento: newTipoDocumento,
  //     tipo_documento_id: newTipoDocumento ? newTipoDocumento.id : null,
  //     numero_documento: trabajador.numero_documento,
  //     nombres: trabajador.nombres,
  //     apellidos: trabajador.apellidos,
  //     tipo_trabajador: trabajador.tipo_trabajador,
  //     tipo_trabajador_id: trabajador.tipo_trabajador_id,
  //     sueldo: trabajador.sueldo,
  //     horas_mes: trabajador.horas_mes,
  //   });
  //   setShowValidateDNI(newTipoDocumento && newTipoDocumento.nombre === "DNI");
  // };
  const handleChangeTipoDocumento = (e) => {
    const newTipoDocumento = e.target.value;
    const selectedTipoDocumento = e.value;
    setTrabajador({
      ...trabajador,
      tipo_documento: selectedTipoDocumento,
      tipo_documento_id: selectedTipoDocumento ? selectedTipoDocumento.id : null,
      numero_documento: '',
      razon_social: '',
    });
    setShowValidateDNI(newTipoDocumento && newTipoDocumento.nombre === "DNI");
    switch (selectedTipoDocumento?.nombre) {
      case "DNI":
        setValueMaxDocumento(8);
        break;
      case "Carné de extranjería":
        setValueMaxDocumento(20);
        break;
      case "Pasaporte":
        setValueMaxDocumento(20);
        break;
      default:
        setValueMaxDocumento(20);
    }
  };
  const handleChangeTipoTrabajador = (e) => {
    setTrabajador({
      id: trabajador.id,
      tipo_documento: trabajador.tipo_documento,
      tipo_documento_id: trabajador.tipo_documento_id,
      numero_documento: trabajador.numero_documento,
      nombres: trabajador.nombres,
      apellidos: trabajador.apellidos,
      tipo_trabajador: e.target.value,
      tipo_trabajador_id: e.value != null ? e.value.id : e.value,
      sueldo: trabajador.sueldo,
      horas_mes: trabajador.horas_mes,
    });
  };
  // const handleChangeNumeroDocumento = (e) => {
  //   setTrabajador({
  //     id: trabajador.id,
  //     tipo_documento: trabajador.tipo_documento,
  //     tipo_documento_id: trabajador.tipo_documento_id,
  //     numero_documento: e.target.value,
  //     nombres: trabajador.nombres,
  //     apellidos: trabajador.apellidos,
  //     tipo_trabajador: trabajador.tipo_trabajador,
  //     tipo_trabajador_id: trabajador.tipo_trabajador_id,
  //     sueldo: trabajador.sueldo,
  //     horas_mes: trabajador.horas_mes,
  //   });
  // };
  const handleChangeNumeroDocumento = (e) => {
    const value = e.target.value;
    const filter = getKeyFilter();

    if (filter === 'int' && !/^\d*$/.test(value)) return;
    if (filter !== 'int' && !filter.test(value)) return;

    const maxLength = trabajador.tipo_documento?.nombre === "DNI" ? 8 : valueMaxDocumento;
    setTrabajador(prevTrabajador => ({
      ...prevTrabajador,
      numero_documento: value.slice(0, maxLength)
    }));
  };
  const handleChangeNombres = (e) => {
    setTrabajador({
      id: trabajador.id,
      tipo_documento: trabajador.tipo_documento,
      tipo_documento_id: trabajador.tipo_documento_id,
      numero_documento: trabajador.numero_documento,
      nombres: e.target.value,
      apellidos: trabajador.apellidos,
      tipo_trabajador: trabajador.tipo_trabajador,
      tipo_trabajador_id: trabajador.tipo_trabajador_id,
      sueldo: trabajador.sueldo,
      horas_mes: trabajador.horas_mes,
    });
  };
  const handleChangeApellidos = (e) => {
    setTrabajador({
      id: trabajador.id,
      tipo_documento: trabajador.tipo_documento,
      tipo_documento_id: trabajador.tipo_documento_id,
      numero_documento: trabajador.numero_documento,
      nombres: trabajador.nombres,
      apellidos: e.target.value,
      tipo_trabajador: trabajador.tipo_trabajador,
      tipo_trabajador_id: trabajador.tipo_trabajador_id,
      sueldo: trabajador.sueldo,
      horas_mes: trabajador.horas_mes,
    });
  };
  // const handleChangeSueldo = (e) => {
  //   setTrabajador({
  //     id: trabajador.id,
  //     tipo_documento: trabajador.tipo_documento,
  //     tipo_documento_id: trabajador.tipo_documento_id,
  //     numero_documento: trabajador.numero_documento,
  //     nombres: trabajador.nombres,
  //     apellidos: trabajador.apellidos,
  //     tipo_trabajador: trabajador.tipo_trabajador,
  //     tipo_trabajador_id: trabajador.tipo_trabajador_id,
  //     sueldo: e.target.value,
  //     horas_mes: trabajador.horas_mes,
  //   });
  // };
  const handleChangeSueldo = (e) => {
    const value = e.target.value;
    
    const regex = /^\d{1,6}(\.\d{0,2})?$/;
    
    if (regex.test(value) || value === '') {
      setTrabajador({
        ...trabajador,
        sueldo: value
      });
    }
  };

  // const handleChangeHorasMes = (e) => {
  //   setTrabajador({
  //     id: trabajador.id,
  //     tipo_documento: trabajador.tipo_documento,
  //     tipo_documento_id: trabajador.tipo_documento_id,
  //     numero_documento: trabajador.numero_documento,
  //     nombres: trabajador.nombres,
  //     apellidos: trabajador.apellidos,
  //     tipo_trabajador: trabajador.tipo_trabajador,
  //     tipo_trabajador_id: trabajador.tipo_trabajador_id,
  //     sueldo: trabajador.sueldo,
  //     horas_mes: e.target.value,
  //   });
  // };
  const handleChangeHorasMes = (e) => {
    const value = e.target.value;
    
    const regex = /^[1-9]\d{0,2}$/;
    
    if (regex.test(value) || value === '') {
      setTrabajador({
        ...trabajador,
        horas_mes: value
      });
    }
  };

  const cleanTrabajador = () => {
    setTrabajador({
      id: 0,
      tipo_documento: null,
      tipo_documento_id: null,
      numero_documento: "",
      nombres: "",
      apellidos: "",
      tipo_trabajador: null,
      tipo_trabajador_id: null,
      sueldo: "",
      horas_mes: "",
    });
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

  const validateDNI = async () => {
    if (!trabajador.numero_documento) {
      showToast("error", "Error", "Por favor, ingrese un número de DNI");
      return;
    }

    try {
      const response = await fetch(`https://dniruc.apisperu.com/api/v1/dni/${trabajador.numero_documento}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InlvY29qMTI3ODRAYmFjYWtpLmNvbSJ9.YHSqYX_C3RpegTKD9V7RLxH3eOLyPwK-AajOIegQBtc`);
      const data = await response.json();

      if (data.success) {
        setTrabajador({
          ...trabajador,
          nombres: data.nombres,
          apellidos: `${data.apellidoPaterno} ${data.apellidoMaterno}`,
        });
        showToast("success", "Éxito", "Datos del DNI obtenidos correctamente");
      } else {
        showToast("error", "Error", "No se pudo obtener los datos del DNI");
      }
    } catch (error) {
      console.error("Error al validar DNI:", error);
      showToast("error", "Error", "Hubo un problema al validar el DNI");
    }
  };

  const handleSubmitCreate = () => {
    setDesabilitar(true)
    http.post("/trabajadores/create", trabajador)
      .then((response) => {
        showToast(
          "success",
          "Trabajador Creado",
          `Se creo al trabajador ${trabajador.nombres} correctamente`
        );
        getAllTrabajadores();
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "danger",
          "Trabajador No Creado",
          `No Se creo al trabajador ${trabajador.nombres}`
        );
      })
      .finally(()=>{
        setTimeout(() => {
          setDesabilitar(false);
        }, 5000);
      })
  };
  const handleSubmitUpdate = () => {
    http.put(`trabajadores/update/${trabajador.id}`, trabajador)
      .then((response) => {
        showToast(
          "success",
          "Trabajador Editado",
          `Se Edito al trabajador ${trabajador.nombres} correctamente`
        );
        getAllTrabajadores();
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "error",
          "Trabajador No Creado",
          `No Se creo al trabajador ${trabajador.nombres}`
        );
      });
  };

  const handleSubmitDelete = () => {
    http.delete(`/trabajadores/delete/${trabajador.id}`)
      .then((response) => {
        showToast(
          "success",
          "Trabajador Eliminado",
          `Se elimino correctamente al trabajador ${trabajador.nombres}`
        );
        getAllTrabajadores();
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "error",
          "Trabajador No Eliminado",
          `No Se creo al trabajador ${trabajador.nombres}`
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

  const formatCurrency = (value) => {
    if (value === null || value === '' || value === undefined) {
      return '-';
    }
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatValue = (value) => {
    if (value === null || value === '' || value === undefined) {
      return '---';
    }
    return value;
  };

  return (
    <>
      <Container url="getTrabajadores">
        <Toast ref={toast} />
        <div className="p-container-header header-trabajadores">
          <div className="p-container-titulo">
            <h1 style={{ color: '#04638A' }} className="container-titulo-table">Lista de Trabajadores</h1>
          </div>
          <div className="container-descripcion">
            <div className="container-descripcion-table">
              <p>
                A continuación, se visualiza la lista de trabajadores
                registrados en el sistema
              </p>
            </div>
            <div className="container-descripcion-button-add">
              <button
                onClick={() => {
                  cleanTrabajador();
                  setVisibleCreate(true);
                }}
                className="button button-crear"
              >
                Crear Trabajador <i className="pi pi-plus mr-2"></i>
              </button>
            </div>
          </div>
        </div>
        <Table
          onInputSearch={(e) => setGlobalFilter(e.target.value)}
          valueGlobalFilter={globalFilter}
          data={trabajadores}
          selection={select}
          onSelectionChange={(e) => {
            setSelect(e.value);
          }}
          onClickRefresh={getAllTrabajadores}

        >
          <Column
            field={
              "tipo_documento" != null
                ? "tipo_documento.nombre"
                : "tipo_documento"
            }
            header="Tipo de Documento"
            className="column column-type"
          ></Column>

          <Column
            field={"numero_documento"}
            header="Número de Documento"
            className="column column-id"
            body={(rowData) => formatValue(rowData.numero_documento)}
          ></Column>
          <Column field={"nombres"} header="Nombres" className="column column-name" body={(rowData) => formatValue(rowData.nombres)} ></Column>
          <Column field="apellidos" header="Apellidos" className="column column-lastname" body={(rowData) => formatValue(rowData.apellidos)}></Column>

          <Column
            field={
              "tipo_trabajador" != null
                ? "tipo_trabajador.nombre"
                : "tipo_trabajador"
            }
            header="Tipo de Trabajador"
            className="column column-typeworker"
          ></Column>
          <Column field="sueldo" header="Sueldo" className="column column-salary" body={(rowData) => formatCurrency(rowData.sueldo)}></Column>
          <Column field="horas_mes" header="Horas de Trabajo al Mes" className="column column-hours" body={(rowData) => formatValue(rowData.horas_mes)}></Column>
          <Column
            header="Editar"
            body={actionBodyTemplateEdit}
            exportable={false}
            style={{ minWidth: "8rem" }}
            className="column column-edit"
          ></Column>
          <Column
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
              Trabajadores
            </>
          }
          modal
          className="p-fluid"
          footer={productDialogFooter}
          onHide={hideDialog}
        >
          <div className="field">
            <label htmlFor="tipo_documento">Tipo de Documento</label>
            <Dropdown
              id="tipo_documento"
              value={trabajador.tipo_documento}
              options={tiposDocumentos}
              onChange={handleChangeTipoDocumento}
              optionLabel="nombre"
              placeholder="Seleccione un Tipo de Documento"
              autoFocus
              filter
            />
          </div>
          <div className="field">
            <label htmlFor="numero_documento">Número de Documento</label>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '0.4rem' }}>
              <InputText
                id="numero_documento"
                value={trabajador.numero_documento}
                onChange={(e) => handleChangeNumeroDocumento(e)}
                required
                keyfilter={getKeyFilter()}
                autoComplete="off"
                maxLength={valueMaxDocumento}
              />
              {showValidateDNI && (
                <Button
                  label="Validar"
                  onClick={validateDNI}
                />
              )}
            </div>
          </div>
          <div className="field">
            <label htmlFor="nombres">Nombres</label>
            <InputText
              id="nombres"
              value={trabajador.nombres}
              onChange={(e) => handleChangeNombres(e)}
              required
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label htmlFor="apellidos">Apellidos</label>
            <InputText
              id="apellidos"
              value={trabajador.apellidos}
              onChange={(e) => handleChangeApellidos(e)}
              required
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label htmlFor="tipo_trabajador">Tipo de Trabajador</label>
            <Dropdown
              id="tipo_trabajador"
              value={trabajador.tipo_trabajador}
              options={tiposTrabajadores}
              onChange={handleChangeTipoTrabajador}
              optionLabel="nombre"
              placeholder="Seleccione un Tipo de Trabajador"
              autoFocus
              filter
            />
          </div>
          <div className="field">
            <label htmlFor="sueldo">Sueldo</label>
            <InputText
              id="sueldo"
              value={trabajador.sueldo}
              onChange={handleChangeSueldo}
              required
              keyfilter={/^\d*\.?\d{0,2}$/}
              maxLength={20}
              autoComplete="off"
            />
          </div>
          <div className="field last-field">
            <label htmlFor="horas_mes">Horas de Trabajo al Mes</label>
            <InputText
              id="horas_mes"
              value={trabajador.horas_mes}
              onChange={handleChangeHorasMes}
              required
              keyfilter="pint" 
              maxLength={20}
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
              Trabajador
            </>
          }
          modal
          className="p-fluid"
          footer={TrabajadorDialogFooterUpdate}
          onHide={hideDialog}
        >
          <div className="field">
            <label htmlFor="tipo_documento">Tipo de Documento</label>
            <Dropdown
              id="tipo_documento"
              value={trabajador.tipo_documento}
              options={tiposDocumentos}
              optionLabel="nombre"
              onChange={handleChangeTipoDocumento}
              placeholder="Seleccione un Tipo de Documento"
              autoFocus
              filter
            />
          </div>
          <div className="field">
            <label htmlFor="numero_documento">Número de Documento</label>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '0.4rem' }}>
              <InputText
                id="numero_documento"
                value={trabajador.numero_documento}
                onChange={(e) => handleChangeNumeroDocumento(e)}
                required
                keyfilter={getKeyFilter()}
                autoComplete="off"
              />
              {showValidateDNI && (
                <Button
                  label="Validar"
                  onClick={validateDNI}
                />
              )}
            </div>
          </div>
          <div className="field">
            <label htmlFor="nombres">Nombres</label>
            <InputText
              id="nombres"
              value={trabajador.nombres}
              onChange={(e) => handleChangeNombres(e)}
              required
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label htmlFor="apellidos">Apellidos</label>
            <InputText
              id="apellidos"
              value={trabajador.apellidos}
              onChange={(e) => handleChangeApellidos(e)}
              required
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label htmlFor="tipo_trabajador">Tipo de Trabajador</label>
            <Dropdown
              id="tipo_trabajador"
              value={trabajador.tipo_trabajador}
              options={tiposTrabajadores}
              optionLabel="nombre"
              onChange={handleChangeTipoTrabajador}
              placeholder="Seleccione un Tipo de Trabajador"
              autoFocus
              filter
            />
          </div>
          <div className="field">
            <label htmlFor="sueldo">Sueldo</label>
            <InputText
              id="sueldo"
              value={trabajador.sueldo}
              onChange={handleChangeSueldo}
              required
              keyfilter={/^\d*\.?\d{0,2}$/}
              maxLength={20}
              autoComplete="off"
            />
          </div>
          <div className="field last-field">
            <label htmlFor="horas_mes">Horas de Trabajo al Mes</label>
            <InputText
              id="horas_mes"
              value={trabajador.horas_mes}
              onChange={handleChangeHorasMes}
              required
              keyfilter="pint" 
              maxLength={20}
              autoComplete="off"
            />
          </div>
        </Dialog>
        <ConfirmDialog
          visible={visibleDelete}
          onHide={() => {
            setVisibleDelete(false);
            cleanTrabajador();
          }}
          message={`Esta seguro de eliminar al Trabajador ${trabajador.nombres}`}
          header="Confirmación"
          icon="pi pi-exclamation-triangle"
          acceptLabel="Sí"
          accept={accept}
          reject={reject}
        />
      </Container>
    </>
  );
}
