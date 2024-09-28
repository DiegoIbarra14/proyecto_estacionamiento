import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../Components/Pedido/Table";
import "./pagePedidos.css";
import "./DataTableDemo.css";
import { Toast } from "primereact/toast";
import Container from "../../Components/Container/Container";
import PedidoService from "../../Services/PedidoService";
import DespachoService from "../../Services/DespachoService";

import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog } from "primereact/confirmdialog";
import ListPedidoDetalle from "../../Components/Pedido/ListPedidoDetalle";
import PageDespacho from "./PageDespacho";
import AuthUser from "../../AuthUser";
function PagePedido() {

  const [visible, setVisible] = useState(false);
const [pdfUrl, setPdfUrl] = useState('');

  const { http, getToken, deleteToken } = AuthUser();
  const [my, setMy] = useState(null);
  let navigate = useNavigate();
  const toast = useRef(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [globalFilterPedidoDetalle, setGlobalFilterPedidoDetalle] =
    useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [despachos, setDespachos] = useState([]);
  const [pedidoDetalles, setPedidoDetalles] = useState([]);
  const [visiblePedidosDetalles, setVisiblePedidosDetalles] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleDespachos, setVisibleDespachos] = useState(false);
  const [pedido, setPedido] = useState({
    id: 0,
    cliente: null,
    cliente_id: null,
    fecha_emision: "",
    //costo_total: "",
    modalidad_pago: null,
    modalidad_pago_id: null,
    estado_pedido: "",
    productos: [],
    despachos: [],
  });
  const getAllPedidos = () => {
    http
      .get("/pedidos/get")
      .then((response) => {
        setPedidos(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getAllPedidos();
    //getAllClientes();
    //getAllTrabajadores();
    //getAllModalidadPagos();
    //getAllDespachos();
    //getAllPedidosDetalles();
  }, []);
  const showToast = (tipo, titulo, detalle) => {
    toast.current.show({
      severity: tipo,
      summary: titulo,
      detail: detalle,
      life: 3000,
    });
  };
  const ratingBodyTemplate = (rowData) => {
    let estate = "";
    let color = "";
    if (rowData.estado_pedido == 1) {
      estate = "Pendiente";
      color = "danger";
    } else if (rowData.estado_pedido == 2) {
      estate = "Incompleto";
      color = "warning";
    } else if (rowData.estado_pedido == 3) {
      estate = "Completo";
      color = "success";
    }
    return (
      <Tag
        className="mr-2"
        value={estate}
        severity={color}
        onClick={(e) => {
          console.log("presiono");
        }}
      ></Tag>
    );
  };
  const actionBodyTemplateDespachos = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-shopping-cart"
          className="p-button-rounded p-button-success"
          onClick={() => despachosPedido(rowData)}
        ></Button>
      </React.Fragment>
    );
  };
  const despachosPedido = (pedido) => {
    setPedido(pedido);
    /*setDespacho1({
      pedido_id: pedido.id,
      trabajador: null,
      trabajador_id: null,
      cantidad_producto: "",
      cantidad_entregada: "",
      cantidad_solicitada: "",
      cantidad_pendiente: "",
      fecha_emision: "",
      fecha_entrega: "",
      estado_entrega: 1,
      documento_referencia: "",
    });
    getAllDespachos(pedido.id);*/
    getAllDespachos(pedido.id);
    setVisibleDespachos(true);
  };
  const actionBodyTemplatePedidoDetalle = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-file"
          className="p-button-rounded p-button-success"
          onClick={() => {
            pedidosDetalle(rowData);
            getAllPedidos();
          }}
        ></Button>
      </React.Fragment>
    );
  };

  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const exportPdf = async (datos) => {
    try {
      console.log(datos)
      //const url = `${apiUrl}/producciones/imprimirpdf/${datos.id}`;
      const url = `${apiUrl}/pedidos/imprimirpdf/${datos.id}`;
      setPdfUrl(url);
      setVisible(true);
    } catch (error) {
      console.log(error);
    }
  };

  const actionBodyDocumento = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-file-pdf"
          className="p-button-outlined p-button-rounded p-button-primary"
          onClick={() => exportPdf(rowData)}
        />
      </>
    );
  };

  const pedidosDetalle = (pedido) => {
    setPedido(pedido);
    setPedidoDetalles(pedido.pedido_detalle);
    //getAllPedidosDetalles(pedido.id);
    setVisiblePedidosDetalles(true);
  };
  const actionBodyTemplateUpdate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmUpdatePedido(rowData)}
          disabled={rowData.estado_pedido != 1 ? true : false}
        />
      </React.Fragment>
    );
  };
  const confirmUpdatePedido = (pedido) => {
    setPedido(pedido);
    navigate(`updatePedido/${pedido.id}`);
  };
  const actionBodyTemplateDelete = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => confirmDeletePedido(rowData)}
          disabled={rowData.estado_pedido != 1 ? true : false}
        />
      </React.Fragment>
    );
  };
  const confirmDeletePedido = (pedido) => {
    setPedido(pedido);
    setVisibleDelete(true);
  };
  const hideDialogPedidosDetalles = () => {
    //cleanPedido();
    setVisiblePedidosDetalles(false);
    //cleanPedidoDetalle();
  };
  const DialogFooterPedidoDetalle = (
    <React.Fragment>
      <Button
        label="Cerrar"
        icon="pi pi-times"
        className="p-button-danger"
        onClick={hideDialogPedidosDetalles}
      />
    </React.Fragment>
  );

  const cleanPedido = () => {
    setPedido({
      id: 0,
      cliente: null,
      cliente_id: null,
      fecha_emision: "",
      //costo_total: "",
      modalidad_pago: null,
      modalidad_pago_id: null,
      estado_pedido: 1,
      productos: [],
      despachos: [],
    });
  };
  //detalle del pedido
  const ratingBodyTemplatePedidoDetalle = (rowData) => {
    let estate = "";
    let color = "";
    if (rowData.estado_pedido_detalle == 1) {
      estate = "Pendiente";
      color = "danger";
    } else if (rowData.estado_pedido_detalle == 2) {
      estate = "Incompleto";
      color = "warning";
    } else if (rowData.estado_pedido_detalle == 3) {
      estate = "Completo";
      color = "success";
    }
    return (
      <Tag
        className="mr-2"
        value={estate}
        severity={color}
        onClick={(e) => {
          console.log("presiono");
        }}
      ></Tag>
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
    //cleanPedido();
  };
  const handleSubmitDelete = () => {
    //PedidoService.remove(`${pedido.id}`);
    http
      .delete(`/pedidos/delete/${pedido.id}`)
      .then((response) => {
        showToast(
          "success",
          "Pedido Eliminado",
          `Se elimino correctamente el pedido ${pedido.id}`
        );
        getAllPedidos();
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "errro",
          "Pedido No Eliminado",
          `No Se Elimino el pedido ${pedido.id}`
        );
      });
  };
  const getAllDespachos = (id) => {
    /*DespachoService.get(`${id}`)
      .then((response) => {
        setDespachos(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });*/
  };

  const hideDialogDespachos = () => {
    cleanPedido();
    //cleanDespacho();
    setVisibleDespachos(false);
  };
  const productDialogFooterDespacho = (
    <React.Fragment>
      <Button
        label="Cerrar"
        icon="pi pi-times"
        className="p-button-danger"
        onClick={() => {
          getAllPedidos();
          hideDialogDespachos();
        }}
      />
    </React.Fragment>
  );

  const formatValue = (value) => {
    if (value === null || value === '' || value === undefined) {
      return '---';
    }
    return value;
  };

  return (
    <>
      <Container url="getPedidos">
        <Toast ref={toast} />
        <div className="p-container-header">
          <div className="p-container-titulo">
            <h1 style={{color:'#04638A'}} className="container-titulo-table">Lista de Pedidos</h1>
          </div>
          <div className="container-descripcion">
            <div className="container-descripcion-table">
              <p>
                A continuación, se visualiza la lista de pedidos registrados en
                el sistema
              </p>
            </div>
            <div className="container-descripcion-button-add">
              <button
                onClick={() => {
                  cleanPedido();
                  navigate("createPedido");
                }}
                className="button button-crear"
              >
                Crear Pedido <i className="pi pi-plus mr-2"></i>
              </button>
            </div>
          </div>
        </div>
        <Table
          onInputSearch={(e) => setGlobalFilter(e.target.value)}
          valueGlobalFilter={globalFilter}
          data={pedidos}
          onClickRefresh={() => {
            getAllPedidos();
          }}
        >
          <Column
            field={"cliente" != null ? "cliente.razon_social" : "cliente"}
            header="Cliente"
            style={{ minWidth: "7rem" }}
            className="column column-cliente" /*cliente*/
          ></Column>
          <Column
            field={"fecha_emision"}
            header="Fecha de Emisión"
            style={{ minWidth: "8rem" }}
            className="column column-emision" /*Emisión*/
            body={(rowData) => formatValue(rowData.fecha_emision)}
          ></Column>
          {/**<Column field={"costo_total"} header="Costo Total"></Column>**/}
          <Column
            field={
              "modalidad_pago" != null
                ? "modalidad_pago.nombre"
                : "modalidad_pago"
            }
            header="Modalidad de Pago"
            style={{ minWidth: "8rem" }}
            className="column column-pago" /*Pago*/
          ></Column>
          <Column
            field={
              "local_cliente" != null
                ? "local_cliente.nombre_local"
                : "local_cliente"
            }
            header="Local"
            style={{ minWidth: "8rem" }}
            className="column column-local" /*Local*/
          ></Column>
          <Column
            header="Estado"
            body={ratingBodyTemplate}
            exportable={false}
            style={{ minWidth: "6rem" }}
            className="column column-estado" /*Estado*/
          ></Column>
          <Column
            body={actionBodyTemplateDespachos}
            header="Despacho"
            exportable={false}
            style={{ minWidth: "6rem" }}
            className="column column-despacho" /*Despacho*/
          ></Column>

          <Column
            body={actionBodyTemplatePedidoDetalle}
            header="Detalles del Pedido"
            exportable={false}
            style={{ minWidth: "7rem" }}
            className="column column-pedido" /*Pedido*/
          ></Column>

          <Column
            body={actionBodyDocumento}
            header="Trazabilidad"
            exportable={false}
            style={{ minWidth: "7rem" }}
            className="column column-trazabilidad" /*Trazabilidad*/
          ></Column>

          <Column
            header="Editar"
            body={actionBodyTemplateUpdate}
            exportable={false}
            style={{ minWidth: "6rem" }}
            className="column column-edit" /*Editar*/
          ></Column>
          {/* <Column
            body={actionBodyTemplateDelete}
            header="Documento Referencia"
            exportable={false}
            style={{ minWidth: "8rem" }}
          ></Column>*/}
          <Column
            body={actionBodyTemplateDelete}
            header="Eliminar"
            exportable={false}
            style={{ minWidth: "6rem" }}
            className="column column-delete" /*Eliminar*/
          ></Column>

        </Table>

        <Dialog
          visible={visiblePedidosDetalles}
          style={{ width: "80vw", backgroundColor: "#F7F7F8 !important" }}
          modal
          className="p-fluid container-descripcion-modal-locales-dialog"
          footer={DialogFooterPedidoDetalle}
          onHide={hideDialogPedidosDetalles}
        >
          <div className=""></div>
          <div>
            <div className="detalle-pedido">
              <div className="">
                <ListPedidoDetalle
                  data={pedidoDetalles}
                  onClickRefresh={() => {
                    //getAllPedidosDetalles(pedido.id);
                  }}
                  onInputSearch={(e) =>
                    setGlobalFilterPedidoDetalle(e.target.value)
                  }
                  valueGlobalFilter={globalFilterPedidoDetalle}
                >
                  <Column
                    field={"producto" != null ? "producto.nombre" : ""}
                    header="Producto"
                    className="column column-detalles-pedido-producto" /*Producto*/
                  ></Column>
                  <Column
                    field={"producto" != null ? "producto.stock" : ""}
                    header="Cantidad de Producto"
                    className="column column-detalles-pedido-cantidad-producto" /*Cantidad Producto*/
                  ></Column>
                  <Column
                    field={"cantidad_solicitada"}
                    header="Cantidad Solicitada"
                    className="column column-detalles-pedido-cantidad-solicitada" /*Cantidad Solicitada*/
                  ></Column>
                  {/**<Column field={"cantidad_entregada"} header="Cantidad Entregada"></Column>**/}
                  <Column
                    field={"fecha_emision"}
                    header="Fecha de Emisión"
                    className="column column-detalles-pedido-emision" /*Fecha de Emisión*/
                  ></Column>
                  <Column
                    header="Estado"
                    body={ratingBodyTemplatePedidoDetalle}
                    exportable={false}
                    style={{ minWidth: "8rem" }}
                    className="column column-estado" /*Estado*/
                  ></Column>
                </ListPedidoDetalle>
              </div>
            </div>
          </div>
        </Dialog>
        <Dialog header="Lista de ingredientes" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
        <iframe src={pdfUrl} width="100%" height="700px" title="PDF Viewer"></iframe>
      </Dialog>
        <ConfirmDialog
          visible={visibleDelete}
          onHide={() => {
            setVisibleDelete(false);
            cleanPedido();
          }}
          message={`Esta seguro de eliminar el Pedido ${pedido.id}`}
          header="Confirmación"
          icon="pi pi-exclamation-triangle"
          acceptLabel="Sí"
          accept={accept}
          reject={reject}
        />
        <Dialog
          visible={visibleDespachos}
          style={{ width: "90vw", backgroundColor: "#F7F7F8 !important" }}
          header={
            <>
              <i className="pi pi-users icon-create-proveedor"></i>Despachos del
              Pedido {pedido.id}
            </>
          }
          modal
          className="p-fluid container-descripcion-modal-locales-dialog"
          footer={productDialogFooterDespacho}
          onHide={hideDialogDespachos}
        >
          <PageDespacho
            pedido_id={pedido.id}
            data={despachos}
            completo={pedido.estado_pedido}
          />
        </Dialog>
      </Container>
    </>
  );
}

export default PagePedido;
