import React, { useEffect, useState, useRef } from "react";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import ListDespachos from "../../Components/Pedido/ListDespachos";
import DespachoService from "../../Services/DespachoService";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog } from "primereact/confirmdialog";
import TrabajadorService from "../../Services/TrabajadorService";
import ListDetalleDespacho from "../../Components/Pedido/ListDetalleDespacho";
import ListCreateDespachos from "../../Components/Pedido/ListCreateDespachos";
import AuthUser from "../../AuthUser";
import PageCreateDespacho from "./PageCreateDespacho";
import PageDetailDespacho from "./PageDetailDespacho";
import PageDespachoResponsable from "./PageDespachoResponsable";

function PageDespacho(props) {

  //HELPERS
  const toast = useRef(null);
  const { http, getToken, deleteToken } = AuthUser();

  //TABLE
  const [globalFilter, setGlobalFilter] = useState(null);

  //SET DATA
  const [despachos, setDespachos] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);

  //DIALOGS
  const [visibleEditTrabajador, setVisibleEditTrabajador] = useState(false);
  const [visibleCreateDespacho, setVisibleCreateDespacho] = useState(false);
  const [visibleConfirmChangeStatus, setVisibleConfirmChangeStatus] = useState(false);
  //
  const [visibleDetalleDespacho, setVisibleDetalleDespacho] = useState(false);
  //
  const [visibleDeleteDespacho, setVisibleDeleteDespacho] = useState(false);

  const [despachoDetalle, setDespachoDetalle] = useState([]);
  const [despachosDetalles, setDespachosDetalles] = useState([]);
  const [objectCreateDespacho, setObjectCreateDespacho] = useState({
    fecha_entrega: "",
    documento_referencia: "",
    despachos: [],
  });
  const [despacho, setDespacho] = useState({
    id: 0,
    pedido_id: props.pedido_id,
    //producto: null,
    //producto_id: null,
    trabajador: null,
    trabajador_id: null,
    //cantidad_producto: "",
    //cantidad_entregada: "",
    //cantidad_solicitada: "",
    //cantidad_pendiente: "",
    fecha_emision: "",
    fecha_entrega: "",
    estado_entrega: 1,
    documento_referencia: "",
    despachos: [],
  });


  const actionBodyTemplateDetalleDespacho = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-file"
          className="p-button-rounded p-button-success"
          onClick={() => showDialogDespachosDetail(rowData)}
        ></Button>
      </>
    );
  };
  const actionBodyTemplateAccionDespacho = (rowData) => {
    return (
      <InputSwitch
        disabled={
          rowData.trabajador == null || rowData.estado_entrega == 2
            ? true
            : false
        }
        checked={rowData.estado_entrega == 1 ? false : true}
        onClick={(e) => {
          console.log(rowData);
          setVisibleConfirmChangeStatus(true);
          setDespacho(rowData);
          //handleDespachoEntregado(rowData.id);
        }}
      />
    );
  };
  const actionBodyTemplateDeleteDespachos = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => showDialogDespachosDelete(rowData)}
          disabled={rowData.estado_entrega == 2 ? true : false}
        />
      </React.Fragment>
    );
  };

  const actionBodyTemplateEditTrabajador = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-user"
          className={
            rowData.trabajador == null
              ? "p-button-rounded p-button-danger"
              : "p-button-rounded p-button-success"
          }
          onClick={() => {
            getAllDespachos(rowData.pedido_id);
            showDialogTrabajadorEdit(rowData);
          }}
        />
      </React.Fragment>
    );
  };
  const ratingBodyTemplateEstadoDespacho = (rowData) => {
    let estate = "";
    let color = "";
    if (rowData.estado_entrega == 1) {
      estate = "No entregado";
      color = "danger";
    } else if (rowData.estado_entrega == 2) {
      estate = "Entregado";
      color = "success";
    }
    return <Tag className="mr-2" value={estate} severity={color}></Tag>;
  };

  const hideDialogTrabajadoresEdit = () => {
    setVisibleEditTrabajador(false);
  };

  const showDialogTrabajadorEdit = (despacho) => {
    setDespacho(despacho);
    setVisibleEditTrabajador(true);
  };
  const showDialogDespachosDetail = (despacho) => {
    setDespachoDetalle(despacho);
    //getAllDespachos(pedido.id);
    setVisibleDetalleDespacho(true);
  };
  const showDialogDespachosDelete = (pedido) => {
    setDespacho(pedido);
    setVisibleDeleteDespacho(true);
  };

  const handleChangeTrabajadores = (e) => {
    setDespacho({
      id: despacho.id,
      pedido_id: despacho.pedido_id,
      trabajador: e.target.value,
      trabajador_id: e.value != null ? e.value.id : e.value,
      fecha_emison: despacho.fecha_emision,
      fecha_entrega: despacho.fecha_entrega,
      documento_referencia: despacho.documento_referencia,
      estado_entrega: despacho.estado_entrega,
      despachos: despacho.despachos,
    });
  };
  const handleDespachoEntregado = (id) => {
    //DespachoService.updateEntregado(id, despacho)
    http
      .put(`pedidos/despachos/despachoEntregado/${id}`, despacho)
      .then((response) => {
        showToast(
          "success",
          "Despacho Entregado",
          `Despacho Entregado ${despacho.id}`
        );
        getAllDespachos(props.pedido_id);
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "error",
          "Despacho Entregado",
          `El despacho esta entregado ${despacho.id}`
        );
      });
  };
  const handleSubmitUpdateTrabajador = () => {
    //DespachoService.updateTrabajador(`${despacho.id}`, despacho)
    http
      .put(`pedidos/despachos/updateTrabajador/${despacho.id}`, despacho)
      .then((response) => {
        showToast(
          "success",
          "Responsable Seleccionado",
          `Se seleccionó al responsable ${despacho.trabajador.nombres} correctamente`
        );
        getAllDespachos(props.pedido_id);
      })
      .catch((error) => {
        console.log(despacho);
        console.log(error);
        showToast(
          "error",
          "Responsable No Seleccionado",
          `No Se selecciono al responsable ${despacho.trabajador.nombres}`
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
  const reject = () => {
    toast.current.show({
      severity: "info",
      summary: "Rechazada",
      detail: "No se realizo ninguna acción",
      life: 3000,
    });
    //cleanPedido();
  };
  const acceptStatus = () => {
    handleDespachoEntregado(despacho.id);
  };



  const accept2 = () => {
    handleSubmitDeleteDespacho();
  };
  const handleSubmitDeleteDespacho = () => {
    //DespachoService.remove(`${despacho.id}`)
    http
      .delete(`/pedidos/despachos/delete/${despacho.id}`)
      .then((response) => {
        showToast(
          "success",
          "Despacho Eliminado",
          `Se elimino correctamente el despacho ${despacho.id}`
        );
        getAllDespachos(props.pedido_id);
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "errro",
          "Despacho No Eliminado",
          `No Se Elimino el despacho ${despacho.id}`
        );
      });
  };



  const getAllDespachos = (id) => {
    //DespachoService.get(`${id}`)
    http
      .get(`/pedidos/despachos/get/${id}`)
      .then((response) => {
        setDespachos(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };



  
  useEffect(() => {
    getAllDespachos(props.pedido_id);
  }, [setDespachos, setTrabajadores]);

  return (
    <>
      <Toast ref={toast} />

      {/*DESPACHO - HEADER*/}
      <div className="p-container-titulo">
        <h1 className="container-titulo-table">Lista de Despachos</h1>
      </div>
      <div className="container-descripcion container-descripcion-modal-locales">
        <div className="container-descripcion-table">
          <p>
            A continuación, se visualiza la lista de los despachos del pedido{" "}
            {props.pedido_id} registrados en el sistema.
          </p>
        </div>
        <div className="container-descripcion-button-add">
          {props.completo != 3 &&
            <>
              <button
                onClick={(e) => {
                  setVisibleCreateDespacho(true);
                }}
                className="button button-crear"
              >
                <span style={{marginRight:'.5rem'}}>Crear Despacho</span>
                 <i className="pi pi-plus"></i>
              </button>
            </>
          }
        </div>
      </div>

      {/*DESPACHO - TABLA*/}
      <div className="cliente-locales-container">
        <div className="cliente-table-locales">
          <div className="card-table-locales">
            <ListDespachos
              data={despachos}
              onClickRefresh={() => getAllDespachos(props.pedido_id)}
              onInputSearch={(e) => setGlobalFilter(e.target.value)}
              valueGlobalFilter={globalFilter}
            >
              <Column
                body={actionBodyTemplateEditTrabajador}
                header="Responsable del Despacho"

                exportable={false}
                className="column column-responsable-despacho-lista-despacho" /*Responsable del Despacho*/
              ></Column>
              <Column
                field={"fecha_emision"}
                header="Fecha de Emisión"
                className="column column-fecha-emison-lista-despacho" /*Fecha de Emisión*/
              ></Column>
              <Column
                field={"fecha_entrega"}
                header="Fecha de Entrega"
                className="column column-fecha-entrega-lista-despacho" /*Fecha de Entrega*/
              ></Column>
              <Column
                field={"documento_referencia"}
                header="Documento de Referencia"
                className="column column-documento-referencia-lista-despacho" /*Documento de Referencia*/
              ></Column>
              <Column
                body={actionBodyTemplateDetalleDespacho}
                header="Detalles del Despacho"
                exportable={false}
                className="column column-detalles-despacho-lista-despacho" /*Detalles del Despacho*/
              ></Column>
              <Column
                header="Estado"
                body={ratingBodyTemplateEstadoDespacho}
                exportable={false}
                className="column column-estado" /*Estado*/
              ></Column>
              <Column
                body={actionBodyTemplateAccionDespacho}
                header="Acción"
                exportable={false}
                className="column column-accion" /*Acción*/
              ></Column>
              {/**<Column
                    header="Editar"
                    body={actionBodyTemplateEditDespachos}
                    exportable={false}
                    style={{ minWidth: "8rem" }}
                ></Column>**/}
              <Column
                body={actionBodyTemplateDeleteDespachos}
                header="Eliminar"
                exportable={false}
                className="column column-delete" /*Eliminar*/
              ></Column>
            </ListDespachos>
          </div>
        </div>
      </div>
      {/*DESPACHO - ACCION*/}
      <ConfirmDialog
        visible={visibleConfirmChangeStatus}
        onHide={() => {
          setVisibleConfirmChangeStatus(false);
        }}
        message={`Esta Seguro de entregar este despacho`}
        header="Confirmación"
        icon="pi pi-exclamation-triangle"
        acceptLabel="Sí"
        accept={acceptStatus}
        reject={reject}
      />
      {/*DESPACHO - BORRAR*/}
      <ConfirmDialog
        visible={visibleDeleteDespacho}
        onHide={() => {
          setVisibleDeleteDespacho(false);
        }}
        message={`Esta seguro de eliminar el despacho ${despacho.id}`}
        header="Confirmación"
        icon="pi pi-exclamation-triangle"
        acceptLabel="Sí"
        accept={accept2}
        reject={reject}
      />

      <PageDespachoResponsable
        visible={visibleEditTrabajador}
        setVisible={setVisibleEditTrabajador}
        data={despacho}
        setData={setDespacho}
        props={props}
        loadData={() => getAllDespachos(props.pedido_id)}
      />

      <PageCreateDespacho
        visible={visibleCreateDespacho}
        setVisible={setVisibleCreateDespacho}
        data={props}
        loadData={() => getAllDespachos(props.pedido_id)}
      />



      <PageDetailDespacho
        visible={visibleDetalleDespacho}
        setVisible={setVisibleDetalleDespacho}
        data={despachoDetalle}
      />



    </>
  );
}

export default PageDespacho;
