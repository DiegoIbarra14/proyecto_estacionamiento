import React, { useEffect, useState, useRef } from "react";
import { Column } from "primereact/column";
import Table from "../../Components/Servicio/Table";
import http from "../../http-common";
import { confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import "./pageServicios.css";
import { ConfirmDialog } from "primereact/confirmdialog";
import Container from "../../Components/Container/Container";
import AuthUser from '../../AuthUser';
import { InputNumber } from "primereact/inputnumber"
import { logout } from "../../reducers/authSlices";
import { useDispatch } from "react-redux";

export default function PageServicios() {
  const toast = useRef(null);
  const { http, getToken, deleteToken } = AuthUser();
  const [my, setMy] = useState(null);
  const [unidadesMedidas, setUnidadesMedidas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loadingServicios, setLoadingServicios] = useState(false);
  let count = 1;
  const [servicio, setServicio] = useState({
    id: 0,
    unidad_medida_servicio: null,
    unidad_medida_id: null,
    nombre: "",
    tarifa: "",
  });

  const [visibleCreate, setVisibleCreate] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [select, setSelect] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const dispatch = useDispatch()


  const getAllUnidadesMedidas = () => {
    http.get("/unidadesmedidaservicio/get")
      .then((response) => {
        const filteredUnidades = response.data.data.filter(
          (unidad) => unidad.nombre !== "Metros"
        );
        setUnidadesMedidas(filteredUnidades);
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

  useEffect(() => {
    getAllUnidadesMedidas();
    getAllServicios();
  }, [setUnidadesMedidas]);

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

  //necesario para el crud
  const actionBodyTemplateEdit = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning"
          onClick={() => editServicio(rowData)}
        />
      </React.Fragment>
    );
  };

  const actionBodyTemplateDelete = (rowData) => {
    return (
      <React.Fragment>
        {rowData.estado_registro == 'SU' ?
          (<Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger"
            disabled
          />)
          :
          (<Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger"
            onClick={() => confirmDeleteServicio(rowData)}
          />)
        }

      </React.Fragment>
    );
  };
  const confirmDeleteServicio = (servicio) => {
    setServicio(servicio);
    setVisibleDelete(true);
    confirm1();
  };
  const editServicio = (servicio) => {
    setServicio(servicio);
    setVisibleEdit(true);
  };

  //para el modal de crear
  const hideDialog = () => {
    //setSubmitted(false);
    cleanServicio();
    setVisibleCreate(false);
    setVisibleEdit(false);
  };
  const hideDialogEdit = () => {
    //setSubmitted(false);
    cleanServicio();
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
        disabled={loadingServicios}
        icon="pi pi-check"
        className="p-button-success"
        onClick={() => {
          if (servicio.nombre.length == 0) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe ingresar un nombre de un Servicio"
            );
          } else {
            handleSubmitCreate();
            hideDialog();
          }
        }}
      />
    </React.Fragment>
  );
  const ServicioDialogFooterUpdate = (
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
          if (servicio.nombre.length == 0) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe ingresar un nombre de un Servicio"
            );
          } else {
            handleSubmitUpdate();
            hideDialogEdit();
          }
        }}
      />
    </React.Fragment>
  );
  const handleChangeUnidadMedida = (e) => {
    setServicio({
      id: servicio.id,
      unidad_medida_servicio: e.target.value,
      unidad_medida_id: e.value != null ? e.value.id : e.value,
      nombre: servicio.nombre,
      tarifa: servicio.tarifa,
    });
  };
  const handleChangeNombre = (e) => {
    setServicio({
      id: servicio.id,
      unidad_medida_servicio: servicio.unidad_medida_servicio,
      unidad_medida_id: servicio.unidad_medida_id,
      nombre: e.target.value,
      tarifa: servicio.tarifa,
    });
  };
  const handleChangeTarifa = (e) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]*(\.[0-9]{0,2})?$/.test(value)) {
      setServicio({ ...servicio, tarifa: value });
    }
  };

  const cleanServicio = () => {
    setServicio({
      id: 0,
      unidad_medida_servicio: null,
      unidad_medida_id: null,
      nombre: "",
      tarifa: "",
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
  const handleSubmitCreate = () => {
    setLoadingServicios(true)
    http.post("/servicios/create", servicio)
      .then((response) => {
        showToast(
          "success",
          "Servicio Creado",
          `Se creo el servicio ${servicio.nombre} correctamente`
        );
        getAllServicios();
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "danger",
          "Servicio No Creado",
          `No Se creo el servicio ${servicio.nombre}`
        );
      })
      .finally(() => {
        setLoadingServicios(false)
      })
  };
  const handleSubmitUpdate = () => {
    setLoadingServicios(true)
    http.put(`servicios/update/${servicio.id}`, servicio)
      .then((response) => {
        showToast(
          "success",
          "Servicio Editado",
          `Se Edito el servicio ${servicio.nombre} correctamente`
        );
        getAllServicios();
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "error",
          "Servicio No Creado",
          `No Se creo el servicio ${servicio.nombre}`
        );
      })
      .finally(() => {
        setLoadingServicios(false);
      })
  };

  const handleSubmitDelete = () => {
    http.delete(`/servicios/delete/${servicio.id}`)
      .then((response) => {
        showToast(
          "success",
          "Servicio Eliminado",
          `Se elimino correctamente el servicio ${servicio.nombre}`
        );
        getAllServicios();
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "error",
          "Servicio No Eliminado",
          `No Se creo el servicio ${servicio.nombre}`
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

  const formatValue = (value) => {
    if (value === null || value === '' || value === undefined) {
      return '---';
    }
    return value;
  };

  return (
    <>
      <Container url="getServicios">
        <Toast ref={toast} />
        <div className="p-container-headerPrima">
          <div className="p-container-titulo">

            <h1 style={{ color: '#04638A' }} className="container-titulo-table">Lista de Servicios</h1>
          </div>
          <div className="container-descripcion">
            <div className="container-descripcion-table">
              <p>
                A continuación, se visualiza la lista de servicios registrados
                en el sistema
              </p>
            </div>
            <div className="container-descripcion-button-add">
              <button
                onClick={() => {
                  cleanServicio();
                  setVisibleCreate(true);
                }}
                className="button button-crear"
              >
                Crear Servicio <i className="pi pi-plus mr-2"></i>
              </button>
            </div>
          </div>
        </div>
        <Table
          onInputSearch={(e) => setGlobalFilter(e.target.value)}
          valueGlobalFilter={globalFilter}
          data={servicios}
          selection={select}
          onSelectionChange={(e) => {
            setSelect(e.value);
          }}
          onClickRefresh={getAllServicios}
        >
          <Column field={"nombre"} header="Nombres" body={(rowData) => formatValue(rowData.nombre)} ></Column>
          <Column field="tarifa" header="Tarifas (soles)" body={(rowData) => formatCurrency(rowData.tarifa)} ></Column>
          <Column
            field={
              "unidad_medida_servicio" != null ? "unidad_medida_servicio.nombre" : "unidad_medida_servicio"
            }
            header="Unidades de Medida"
          ></Column>

          <Column
            header="Editar"
            body={actionBodyTemplateEdit}
            exportable={false}
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            body={actionBodyTemplateDelete}
            header="Eliminar"
            exportable={false}
            style={{ minWidth: "8rem" }}
          ></Column>
        </Table>

        <Dialog
          visible={visibleCreate}
          style={{ width: "450px" }}
          header={
            <>
              <i className="pi pi-briefcase icon-create-proveedor"></i>Crear
              Servicios
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
              value={servicio.nombre}
              onChange={(e) => handleChangeNombre(e)}
              required
              autoComplete="off"
            />
          </div>
          <div className=" flex flex-block">
            <div className="field" style={{ marginRight: '10px' }}>
              <label htmlFor="tarifa">Tarifa (soles)</label>


              <InputText
                id="tarifa"
                value={servicio.tarifa || ''} // Asegura que el campo esté vacío inicialmente
                onChange={(e) => {
                  const value = e.target.value;
                  // Verifica si el valor cumple con el patrón permitido (hasta 2 dígitos decimales)
                  if (value === '' || /^[0-9]*(\.[0-9]{0,2})?$/.test(value)) {
                    setServicio({ ...servicio, tarifa: value });
                  }
                }}
                required
                autoComplete="off"
                placeholder="Ingrese tarifa"
                maxLength={20}
                inputMode="decimal" // Permite el teclado numérico para ingresar decimales
              />


            </div>
            <div className="field">
              <label htmlFor="unidad_medida_servicio">Unidad de Medida</label>
              <Dropdown
                id="unidad_medida_servicio"
                value={servicio.unidad_medida_servicio}
                options={unidadesMedidas}
                onChange={handleChangeUnidadMedida}
                optionLabel="nombre"
                placeholder="Seleccione una Unidad de Medida"
                autoFocus
                filter
                style={{ width: '200px' }}
              />
            </div>
          </div>
        </Dialog>

        <Dialog
          visible={visibleEdit}
          style={{ width: "450px" }}
          header={
            <>
              <i className="pi pi-briefcase icon-create-proveedor"></i>Editar
              Servicio
            </>
          }
          modal
          className="p-fluid"
          footer={ServicioDialogFooterUpdate}
          onHide={hideDialog}
        >
          <div className="field">
            <label htmlFor="nombre">Nombre</label>

            <InputText
              id="nombre"
              value={servicio.nombre}
              onChange={(e) => handleChangeNombre(e)}
              disabled={servicio.estado_registro == 'SU' ? (true) : (false)}
              autoComplete="off"
              required
              placeholder="Ingrese tarifa"
              maxLength={20}
              inputMode="decimal" // Permite el teclado numérico para ingresar decimales
            />
          </div>
          <div className=" flex flex-block">

            <div className="field" style={{ marginRight: '10px' }}>
              <label htmlFor="tarifa">Tarifa (soles)</label>

              <InputText
                id="tarifa"
                value={servicio.tarifa}
                onChange={handleChangeTarifa}
                required
                autoComplete="off"
                placeholder="Ingrese tarifa"
              />


            </div>




            <div className="field">
              <label htmlFor="unidad_medida_servicio">Unidad de Medida</label>
              <Dropdown
                id="unidad_medida_servicio"
                value={servicio.unidad_medida_servicio}
                options={unidadesMedidas}
                optionLabel="nombre"
                onChange={handleChangeUnidadMedida}
                placeholder="Seleccione una Unidad de Medida"
                autoFocus
                filter
                style={{ width: '200px' }}
              />
            </div>
          </div>
        </Dialog>
        <ConfirmDialog
          visible={visibleDelete}
          onHide={() => {
            setVisibleDelete(false);
            cleanServicio();
          }}
          message={`Esta seguro de eliminar el Servicio ${servicio.nombre}`}
          header="Confirmación"
          icon="pi pi-exclamation-triangle"
          accept={accept}
          reject={reject}
        />
      </Container>
    </>
  );
}