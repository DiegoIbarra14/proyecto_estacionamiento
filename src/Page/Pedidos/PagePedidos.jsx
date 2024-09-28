import React, { useEffect, useState, useRef } from "react";
import { Tag } from "primereact/tag";
import { InputSwitch } from "primereact/inputswitch";
import { Column } from "primereact/column";
import Table from "../../Components/Pedido/Table";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import "./pagePedidos.css";
import "./DataTableDemo.css";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useNavigate } from "react-router-dom";
import ListDespachos from "../../Components/Pedido/ListDespachos";
import ListPedidoDetalle from "../../Components/Pedido/ListPedidoDetalle";
import ListDetalleDespacho from "../../Components/Pedido/ListDetalleDespacho";
import ListCreateDespachos from "../../Components/Pedido/ListCreateDespachos";
import Container from "../../Components/Container/Container";
import AuthUser from '../../AuthUser';
import { logout } from "../../reducers/authSlices";
import { useDispatch } from "react-redux";

export default function PagePedidos() {
  const navigate = useNavigate();
  const toast = useRef(null);
  const { http, getToken, deleteToken } = AuthUser();
  const [my, setMy] = useState(null);
  const [visibleConfirmChangeStatus, setVisibleConfirmChangeStatus] =
    useState(false);
  const [clientes, setClientes] = useState([]);
  const [producto, setProducto] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [modalidadPagos, setModalidadPagos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [despachos, setDespachos] = useState([]);
  const [despachosDetalles, setDespachosDetalles] = useState([]);
  const [pedidosDetalles, setPedidosDetalles] = useState([]);
  const [checked1, setChecked1] = useState(false);
  const [editingRows, setEditingRows] = useState({});
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
  const [despacho, setDespacho] = useState({
    id: 0,
    pedido_id: pedido.id,
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
  });
  const [despacho1, setDespacho1] = useState({
    id: 0,
    pedido_id: pedido.id,
    //producto_id: null,
    //producto: null,
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
  });
  const [despachoDetalle, setDespachoDetalle] = useState({
    id: 0,
    despacho: despacho.id,
    despacho_id: despacho.id,
    producto: null,
    producto_id: null,
    cantidad_solicitada: "",
    cantidad_entregada: "",
    cantidad_pendiente: "",
    estado_entrega: 1,
  });

  const [pedidoDetalle, setPedidoDetalle] = useState({
    id: 0,
    pedido: pedido.id,
    pedido_id: pedido.id,
    producto: null,
    producto_id: null,
    cantidad_producto: "",
    cantidad_solicitada: "",
    //cantidad_entregada: '',
    estado_pedido_detalle: "",
    fecha_emision: "",
  });
  //const [visibleEstadoPedido, setVisibleEstadoPedido] = useState(false);
  const dispatch =useDispatch()
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [visibleEditTrabajador, setVisibleEditTrabajador] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleDespachos, setVisibleDespachos] = useState(false);
  const [visibleCreateDespacho, setVisibleCreateDespacho] = useState(false);
  const [visibleDeleteDespacho, setVisibleDeleteDespacho] = useState(false);
  const [visibleDetalleDespacho, setVisibleDetalleDespacho] = useState(false);
  const [visiblePedidosDetalles, setVisiblePedidosDetalles] = useState(false);
  const [select, setSelect] = useState(null);
  const [selectDespacho, setSelectDespacho] = useState(null);
  const [selectPedidoDetalle, setSelectPedidoDetalle] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [globalFilterDespacho, setGlobalFilterDespacho] = useState(null);
  const [globalFilterPedidoDetalle, setGlobalFilterPedidoDetalle] =
    useState(null);

  const getAllClientes = () => {
    http.get("/clientes/get")
      .then((response) => {
        setClientes(response.data.data);
        console.log(clientes);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAllTrabajadores = () => {
    http.get("/trabajadores/get")
      .then((response) => {
        setTrabajadores(response.data.data);
        console.log(trabajadores);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAllModalidadPagos = () => {
    http.get("/modalidadpagos/get")
      .then((response) => {
        setModalidadPagos(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAllPedidos = () => {
    http.get("/pedidos/get")
      .then((response) => {
        setPedidos(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAllDespachos = (id) => {
    http.get(`/pedidos/despachos/get/${id}`)
      .then((response) => {
        setDespachos(response.data.data);
        console.log(despachos);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAllDespachosDetalles = (id) => {
    http.get(`/pedidos/despachosdetalles/get/${id}`)
      .then((response) => {
        setDespachosDetalles({
          pedido_id: pedido.id,
          fecha_entrega: "",
          documento_referencia: "",
          despachos: response.data.data,
        });
        console.log("sadjsadhksahdksa", response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAllPedidosDetalles = (id) => {
    http.get(`/pedidos/pedidosDetalles/get/${id}`)
      .then((response) => {
        setPedidosDetalles(response.data.data);
        console.log(pedidosDetalles);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getAllClientes();
    getAllTrabajadores();
    getAllModalidadPagos();
    getAllPedidos();
    getAllDespachos();
    getAllPedidosDetalles();
  }, [setPedidos]);

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
      console.log("promesa 2", response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const onRowEditComplete1 = (e) => {
    let desp = [...despachosDetalles.despachos];
    let { newData, index } = e;
    console.log(newData);
    const newDespacho = {
      pedido_id: newData.pedido_id,
      producto_id: newData.producto_id,
      producto: newData.producto,
      //trabajador: null,
      //trabajador_id: null,
      cantidad_producto: newData.cantidad_producto - newData.cantidad_entregada,
      cantidad_entregada: newData.cantidad_entregada,
      cantidad_solicitada: newData.cantidad_solicitada,
      cantidad_pendiente:
        newData.cantidad_solicitada - newData.cantidad_entregada,
      estado_entrega: newData.estado_entrega,
      //fecha_emision: newData.fecha_emision,
      //fecha_entrega: newData.fecha_entrega,
      //documento_referencia: newData.documento_referencia,
    };
    desp[index] = newDespacho;

    setDespachosDetalles({
      pedido_id: pedido.id,
      fecha_entrega: despachosDetalles.fecha_entrega,
      documento_referencia: despachosDetalles.documento_referencia,
      despachos: desp,
    });
  };

  const textEditor = (options) => {
    return (
      <InputText
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
        min="1"
        max="15"
        keyfilter="num"
      />
    );
  };
  const textEditorFecha = (options) => {
    return (
      <InputText
        type="date"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  const ratingBodyTemplate = (rowData) => {
    let estate = "";
    let color = "";
    if (rowData.estado_pedido === 1) {
      estate = "Pendiente";
      color = "danger";
    } else if (rowData.estado_pedido === 2) {
      estate = "incompleto";
      color = "warning";
    } else if (rowData.estado_pedido === 3) {
      estate = "completo";
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
  const ratingBodyTemplatePedidoDetalle = (rowData) => {
    let estate = "";
    let color = "";
    if (rowData.estado_pedido_detalle === 1) {
      estate = "Pendiente";
      color = "danger";
    } else if (rowData.estado_pedido_detalle === 2) {
      estate = "incompleto";
      color = "warning";
    } else if (rowData.estado_pedido_detalle === 3) {
      estate = "completo";
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
  const ratingBodyTemplateEstadoDespacho = (rowData) => {
    let estate = "";
    let color = "";
    if (rowData.estado_entrega === 1) {
      estate = "no entregado";
      color = "danger";
    } else if (rowData.estado_entrega === 2) {
      estate = "entregado";
      color = "warning";
    }
    return <Tag className="mr-2" value={estate} severity={color}></Tag>;
  };
  const ratingBodyTemplateEstadoDespachoDetalle = (rowData) => {
    let estate = "";
    let color = "";
    if (rowData.estado_entrega === 1) {
      estate = "no entregado";
      color = "danger";
    } else if (rowData.estado_entrega === 2) {
      estate = "entregado";
      color = "warning";
    }
    return <Tag className="mr-2" value={estate} severity={color}></Tag>;
  };

  const actionBodyTemplateAccionDespacho = (rowData) => {
    console.log("sad", rowData);

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
          disabled={rowData.estado_entrega == 2 ? true : false}
          onClick={() => editTrabajador(rowData)}
        />
      </React.Fragment>
    );
  };
  const actionBodyTemplateDetalleDespacho = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-file"
          className="p-button-rounded p-button-success"
          onClick={() => detallesDespacho(rowData)}
        ></Button>
      </React.Fragment>
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
  const actionBodyTemplatePedidoDetalle = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-file"
          style={{ color: "blue" }}
          className="p-button-rounded p-button-success"
          onClick={() => pedidosDetalle(rowData)}
        ></Button>
      </React.Fragment>
    );
  };
  const actionBodyTemplateDeleteDespachos = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => confirmDeleteDespacho(rowData)}
          disabled={rowData.estado_entrega == 2 ? true : false}
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
          onClick={() => confirmDeletePedido(rowData)}
          disabled={rowData.estado_pedido != 1 ? true : false}
        />
      </React.Fragment>
    );
  };
  const editPedido = (pedido) => {
    setPedido(pedido);
    setVisibleEdit(true);
  };
  const confirmDeletePedido = (pedido) => {
    setPedido(pedido);
    setVisibleDelete(true);
  };
  const editTrabajador = (despacho1) => {
    setDespacho1(despacho1);
    setVisibleEditTrabajador(true);
  };
  const despachosPedido = (pedido) => {
    setPedido(pedido);
    setDespacho1({
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
    getAllDespachos(pedido.id);
    setVisibleDespachos(true);
  };
  const detallesDespacho = (pedido) => {
    setPedido(pedido);
    setDespacho1({
      id: 0,
      pedido: pedido.id,
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
    getAllDespachos(pedido.id);
    setVisibleDetalleDespacho(true);
  };
  const pedidosDetalle = (pedido) => {
    setPedido(pedido);
    setPedidoDetalle({
      id: 0,
      pedido: pedido.id,
      pedido_id: pedido.id,
      cantidad_producto: "",
      cantidad_solicitada: "",
      producto: pedido.id,
      producto_id: pedido.id,
      fecha_emision: "",
      estado_pedido_detalle: "",
    });
    getAllPedidosDetalles(pedido.id);
    setVisiblePedidosDetalles(true);
  };

  const confirmDeleteDespacho = (pedido) => {
    setDespacho(pedido);
    setVisibleDeleteDespacho(true);
  };
  const hideDialog = () => {
    //cleanPedido();
    cleanDespacho();
    //setVisibleCreate(false);
    setVisibleEdit(false);
  };
  const hideDialogTrabajadoresEdit = () => {
    cleanDespacho();
    setVisibleEditTrabajador(false);
  };
  const hideDialogDespachos = () => {
    cleanPedido();
    cleanDespacho();
    setVisibleDespachos(false);
  };
  const hideDialogDetalleDespachos = () => {
    //cleanPedido();
    cleanDespacho();
    setVisibleDetalleDespacho(false);
  };
  const hideDialogPedidosDetalles = () => {
    cleanPedido();
    setVisiblePedidosDetalles(false);
    cleanPedidoDetalle();
  };
  const hideDialogDespachosCreate = () => {
    cleanDespacho();
    setProducto([]);
    setVisibleCreateDespacho(false);
  };
  const cleanDespacho = () => {
    setDespacho1({
      id: 0,
      pedido_id: pedido.id,
      trabajador: null,
      trabajador_id: null,
      cantidad_producto: "",
      cantidad_entregada: "",
      cantidad_solicitada: "",
      cantidad_pendiente: "",
      fecha_emision: "",
      fecha_entrega: "",
      estado_entrega: "",
      documento_referencia: "",
    });
  };
  const cleanDespachosDetalles = () => {
    setDespachosDetalles({
      pedido_id: pedido.id,
      fecha_entrega: "",
      documento_referencia: "",
      despachos: null,
    });
  };
  const cleanPedidoDetalle = () => {
    setPedidoDetalle({
      id: 0,
      pedido: pedido.id,
      pedido_id: pedido.id,
      cantidad_producto: "",
      cantidad_solicitada: "",
      producto: pedido.id,
      producto_id: pedido.id,
      fecha_emision: "",
      estado_pedido_detalle: "",
    });
  };

  const productDialogFooterDespacho = (
    <React.Fragment>
      <Button
        label="Cerrar"
        icon="pi pi-times"
        className="p-button-danger"
        onClick={hideDialogDespachos}
      />
    </React.Fragment>
  );
  const productDialogFooterDetalleDespacho = (
    <React.Fragment>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-danger"
        onClick={hideDialogDetalleDespachos}
      />
    </React.Fragment>
  );
  const productDialogFooterPedidoDetalle = (
    <React.Fragment>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-danger"
        onClick={hideDialogPedidosDetalles}
      />
    </React.Fragment>
  );
  const productDialogFooterDespachoCreate = (
    <React.Fragment>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-danger"
        onClick={() => {
          hideDialogDespachosCreate();
        }}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        className="p-button-success"
        onClick={() => {
          handleSubmitCreateDespacho();
          hideDialogDespachosCreate();
        }}
      />
    </React.Fragment>
  );

  const productDialogFooterTrabajadorEdit = (
    <React.Fragment>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-danger"
        onClick={() => {
          hideDialogTrabajadoresEdit();
          toast.current.show({
            severity: "info",
            summary: "Rechazada",
            detail: "No se realizo ninguna acción",
            life: 3000,
          });
        }}
      />
      <Button
        label="Seleccionar Responsable"
        icon="pi pi-check"
        className="p-button-success"
        onClick={() => {
          if (despacho1.trabajador.nombres.length == 0) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe seleccionar un responsable"
            );
          } else {
            handleSubmitUpdateTrabajador();
            hideDialogTrabajadoresEdit();
          }
        }}
      />
    </React.Fragment>
  );

  const Estados = (estado) => {
    let estate = "";
    if (estado === 1) {
      estate = "Pendiente";
    } else if (estado === 2) {
      estate = "incompleto";
    } else if (estado == 3) {
      estate = "completo";
    }
    return <div>{estate}</div>;
  };

  const accept = () => {
    handleSubmitDelete();
  };
  const acceptStatus = () => {
    handleDespachoEntregado(despacho.id);
  };
  const accept2 = () => {
    handleSubmitDeleteDespacho();
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
  const reject2 = () => {
    toast.current.show({
      severity: "info",
      summary: "Rechazada",
      detail: "No se realizo ninguna acción",
      life: 3000,
    });
    cleanPedido();
  };

  const pedidoPendiente = (pedido) => {
    setPedido({
      id: pedido.id,
      cliente: pedido.cliente,
      cliente_id: pedido.cliente_id,
      fecha_emision: pedido.fecha_emision,
      modalidad_pago: pedido.modalidad_pago,
      modalidad_pago_id: pedido.modalidad_pago_id,
      estado_pedido: "1",
    });
    setVisibleEstadoPedido(true);
  };
  /**const handleChangePedidos = (e) => {
    setDespacho({
      id: despacho.id,
      pedido_id: pedido.id,
      trabajador: despacho.trabajador,
      trabajador_id: despacho.trabajador_id,
      cantidad_producto: despacho.cantidad_producto,
      cantidad_solicitada: despacho.cantidad_solicitada,
      cantidad_entregada: despacho.cantidad_entregada,
      cantidad_pendiente: despacho.cantidad_pendiente,
      fecha_emison: despacho.fecha_emision,
      fecha_entrega: despacho.fecha_entrega,
      documento_referencia: despacho.documento_referencia,
      estado_despacho: despacho.estado_despacho,
    });
  }; */
  const handleChangeTrabajadores = (e) => {
    setDespacho1({
      id: despacho1.id,
      pedido_id: despacho1.pedido_id,
      trabajador: e.target.value,
      trabajador_id: e.value != null ? e.value.id : e.value,
      cantidad_producto: despacho1.cantidad_producto,
      cantidad_solicitada: despacho1.cantidad_solicitada,
      cantidad_entregada: despacho1.cantidad_entregada,
      cantidad_pendiente: despacho1.cantidad_pendiente,
      fecha_emison: despacho1.fecha_emision,
      fecha_entrega: despacho1.fecha_entrega,
      documento_referencia: despacho1.documento_referencia,
      estado_entrega: despacho1.estado_entrega,
    });
  };
  const handleChangeProducto = (e) => {
    setProducto(e.value);
    setDespacho1({
      id: 0,
      pedido_id: pedido.id,
      producto: e.value,
      producto_id: e.value.id,
      trabajador: null,
      trabajador_id: null,
      cantidad_producto: e.value.cantidad_producto,
      cantidad_entregada: "",
      cantidad_solicitada: e.value.cantidad_solicitada,
      cantidad_pendiente: "",
      fecha_emision: "",
      fecha_entrega: "",
      estado_entrega: "",
      documento_referencia: "",
    });
  };
  const handleChangeCantidadProductos = (e) => {
    setDespacho1({
      id: despacho1.id,
      pedido_id: despacho1.pedido_id,
      trabajador: despacho1.trabajador,
      trabajador_id: despacho1.trabajador_id,
      cantidad_producto: e.target.value,
      cantidad_solicitada: despacho1.cantidad_solicitada,
      cantidad_entregada: despacho1.cantidad_entregada,
      cantidad_pendiente: despacho1.cantidad_pendiente,
      fecha_emison: despacho1.fecha_emision,
      fecha_entrega: despacho1.fecha_entrega,
      documento_referencia: despacho1.documento_referencia,
      estado_entrega: despacho1.estado_entrega,
    });
  };
  const handleChangeCantidadSolicitada = (e) => {
    setDespacho1({
      id: despacho1.id,
      pedido_id: despacho1.pedido_id,
      trabajador: despacho1.trabajador,
      trabajador_id: despacho1.trabajador_id,
      cantidad_producto: despacho1.cantidad_producto,
      cantidad_solicitada: e.target.value,
      cantidad_entregada: despacho1.cantidad_entregada,
      cantidad_pendiente: despacho1.cantidad_pendiente,
      fecha_emison: despacho1.fecha_emision,
      fecha_entrega: despacho1.fecha_entrega,
      documento_referencia: despacho1.documento_referencia,
      estado_entrega: despacho1.estado_entrega,
    });
  };
  const handleChangeCantidadEntregada = (e) => {
    console.log("cantidades entregadas");
    setDespacho1({
      id: despacho1.id,
      pedido_id: despacho1.pedido_id,
      trabajador: despacho1.trabajador,
      trabajador_id: despacho1.trabajador_id,
      cantidad_producto: despacho1.cantidad_producto,
      cantidad_solicitada: despacho1.cantidad_solicitada,
      cantidad_entregada: e.target.value,
      cantidad_pendiente: despacho1.cantidad_solicitada - e.target.value,
      fecha_emison: despacho1.fecha_emision,
      fecha_entrega: despacho1.fecha_entrega,
      documento_referencia: despacho1.documento_referencia,
      estado_entrega: despacho1.estado_entrega,
    });
  };
  const handleChangeCantidadPendiente = (e) => {
    setDespacho1({
      id: despacho1.id,
      pedido_id: despacho1.pedido_id,
      trabajador: despacho1.trabajador,
      trabajador_id: despacho1.trabajador_id,
      cantidad_producto: despacho1.cantidad_producto,
      cantidad_solicitada: despacho1.cantidad_solicitada,
      cantidad_entregada: despacho1.cantidad_entregada,
      cantidad_pendiente: e.target.value,
      fecha_emison: despacho1.fecha_emision,
      fecha_entrega: despacho1.fecha_entrega,
      documento_referencia: despacho1.documento_referencia,
      estado_entrega: despacho1.estado_entrega,
    });
  };
  const handleChangeFechaEmision = (e) => {
    setDespacho1({
      id: despacho.id,
      pedido_id: despacho.pedido_id,
      trabajador: despacho.trabajador,
      trabajador_id: despacho.trabajador_id,
      cantidad_producto: despacho.cantidad_producto,
      cantidad_solicitada: despacho.cantidad_solicitada,
      cantidad_entregada: despacho.cantidad_entregada,
      cantidad_pendiente: despacho.cantidad_pendiente,
      fecha_emison: e.target.value,
      fecha_entrega: despacho.fecha_entrega,
      documento_referencia: despacho.documento_referencia,
      estado_entrega: despacho.estado_entrega,
    });
  };
  const handleChangePedido = (e) => {
    setDespachosDetalles({
      pedido: e.target.value,
      pedido_id: e.value != null ? e.value.id : e.value,
      fecha_entrega: e.target.value,
      documento_referencia: despachosDetalles.documento_referencia,
      despachos: despachosDetalles.despachos,
    });
  };
  const handleChangeFechaEntrega = (e) => {
    setDespachosDetalles({
      pedido_id: pedido.id,
      fecha_entrega: e.target.value,
      documento_referencia: despachosDetalles.documento_referencia,
      despachos: despachosDetalles.despachos,
    });
  };
  const handleChangeDocumentoReferencia = (e) => {
    setDespachosDetalles({
      pedido_id: pedido.id,
      fecha_entrega: despachosDetalles.fecha_entrega,
      documento_referencia: e.target.value,
      despachos: despachosDetalles.despachos,
    });
  };
  const handleChangeEstadoDespacho = (e) => {
    setDespacho1({
      id: despacho.id,
      pedido_id: despacho.pedido_id,
      trabajador: despacho.trabajador,
      trabajador_id: despacho.trabajador_id,
      cantidad_producto: despacho.cantidad_producto,
      cantidad_solicitada: despacho.cantidad_solicitada,
      cantidad_entregada: despacho.cantidad_entregada,
      cantidad_pendiente: despacho.cantidad_pendiente,
      fecha_emison: despacho.fecha_emision,
      fecha_entrega: despacho.fecha_entrega,
      documento_referencia: despacho.documento_referencia,
      estado_entrega: e.target.value,
    });
  };
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
  const handleDespachoEntregado = (id) => {
    http.put(`pedidos/despachos/despachoEntregado/${id}`, despacho)
      .then((response) => {
        pedido.estado_pedido == 2;
        showToast(
          "success",
          "Despacho Entregado",
          `Despacho Entregado ${despacho.id}`
        );
        getAllDespachos(pedido.id);
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
    http.put(`pedidos/despachos/updateTrabajador/${despacho1.id}`, despacho1)
      .then((response) => {
        showToast(
          "success",
          "Responsable Seleccionado",
          `Se seleccionó al responsable ${despacho1.trabajador.nombres} correctamente`
        );
        getAllDespachos(pedido.id);
      })
      .catch((error) => {
        console.log(despacho1);
        console.log(error);
        showToast(
          "error",
          "Responsable No Seleccionado",
          `No Se selecciono al responsable ${despacho1.trabajador.nombres}`
        );
      });
  };
  const handleSubmitDelete = () => {
    http.delete(`/pedidos/delete/${pedido.id}`)
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
  const handleSubmitCreateDespacho = () => {
    console.log(despachosDetalles, "eeeeeeeeeeeeeeeeeeee");
    if (despachosDetalles.cantidad_entregada <= 0) {
      showToast(
        "error",
        "Error al crear Despacho",
        `Debe ingresar un cliente para el pedido`
      );
    } else {
      http.post("/pedidos/despachos/create", despachosDetalles)
        .then((response) => {
          console.log(response, "responseeeeeeeeeeeeeeeeeeeeeeee");
          showToast(
            "success",
            "Despacho Creado",
            `Se creo el despacho correctamente`
          );
          getAllDespachos(pedido.id);
          getAllPedidos();
        })
        .catch((error) => {
          console.log(error);
          showToast("error", "Despacho No Creado", `No Se creo el despacho`);
        });
    }
  };
  const handleSubmitDeleteDespacho = () => {
    http.delete(`/pedidos/despachos/delete/${despacho.id}`)
      .then((response) => {
        showToast(
          "success",
          "Despacho Eliminado",
          `Se elimino correctamente el despacho ${despacho.id}`
        );
        getAllDespachos(pedido.id);
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

  const showToast = (tipo, titulo, detalle) => {
    toast.current.show({
      severity: tipo,
      summary: titulo,
      detail: detalle,
      life: 3000,
    });
  };
  return (
    <>
      <Container url="getPedidos">
        <Toast ref={toast} />
        <div className="p-container-header">
          <div className="p-container-titulo">
            <h1 className="container-titulo-table">Tabla de Pedidos</h1>
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
                  setVisibleCreate(true);
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
          selection={select}
          onSelectionChange={(e) => {
            setSelect(e.value);
            console.log(e.value);
          }}
          onClickRefresh={() => {
            getAllPedidos();
          }}
        >
          <Column
            field={"cliente" != null ? "cliente.razon_social" : "cliente"}
            header="Cliente"
          ></Column>
          <Column field={"fecha_emision"} header="Fecha de Emisión"></Column>
          {/**<Column field={"costo_total"} header="Costo Total"></Column>**/}
          <Column
            field={
              "modalidad_pago" != null
                ? "modalidad_pago.nombre"
                : "modalidad_pago"
            }
            header="Modalidad de Pago"
          ></Column>
          <Column
            header="Estado"
            body={ratingBodyTemplate}
            exportable={false}
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            body={actionBodyTemplateDespachos}
            header="Despacho"
            exportable={false}
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            body={actionBodyTemplatePedidoDetalle}
            header="Detalles del Pedido"
            exportable={false}
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            header="Editar"
            body={actionBodyTemplateUpdate}
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
          visible={visibleEditTrabajador}
          style={{ width: "500px" }}
          header={
            <>
              <i className="pi pi-briefcase icon-create-proveedor"></i>
              Seleccionar Responsable de Despacho*
            </>
          }
          modal
          className="p-fluid"
          footer={productDialogFooterTrabajadorEdit}
          onHide={hideDialogTrabajadoresEdit}
        >
          <div className="field">
            <label htmlFor="trabajador">Responsable</label>
            <Dropdown
              id="trabajador"
              value={despacho1.trabajador}
              options={trabajadores}
              onChange={handleChangeTrabajadores}
              optionLabel="nombres"
              placeholder="Selecciona un responsable"
              filter
              autoFocus
            />
          </div>
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
          <div className="p-container-titulo">
            <h1 className="container-titulo-table">Tabla de Despachos</h1>
          </div>
          <div className="container-descripcion container-descripcion-modal-locales">
            <div className="container-descripcion-table">
              <p>
                A continuación, se visualiza la lista de los despachos del
                pedido {pedido.id} registrados en el sistema.
              </p>
            </div>
            <div className="container-descripcion-button-add">
              <button
                onClick={(e) => {
                  cleanDespacho();
                  console.log("entraaa");
                  cleanDespachosDetalles();
                  setVisibleCreateDespacho(true);
                  getAllDespachosDetalles(pedido.id);
                }}
                className="button button-crear"
              >
                Crear Despacho <i className="pi pi-plus mr-2"></i>
              </button>
            </div>
          </div>
          <div className="cliente-locales-container">
            <div className="cliente-table-locales">
              <div className="card-table-locales">
                <ListDespachos
                  data={despachos}
                  selection={selectDespacho}
                  onSelectionChange={(e) => {
                    setSelectDespacho(e.value);
                    console.log(e.value);
                  }}
                  onClickRefresh={() => getAllDespachos(pedido.id)}
                  onInputSearch={(e) => setGlobalFilterDespacho(e.target.value)}
                  valueGlobalFilter={globalFilterDespacho}
                >
                  <Column
                    body={actionBodyTemplateEditTrabajador}
                    header="Responsable del Despacho"
                    exportable={false}
                    style={{ minWidth: "8rem" }}
                    className="column column-despacho-pe" /*Responsable del Despacho*/
                  ></Column>
                  <Column
                    field={"fecha_emision"}
                    header="Fecha de Emisión"
                    className="column column-emision-pe" /*Fecha de Emisión*/
                  ></Column>
                  <Column
                    field={"fecha_entrega"}
                    header="Fecha de Entrega"
                    className="column column-entrega-pe" /*Fecha de Entrega*/
                  ></Column>
                  <Column
                    field={"documento_referencia"}
                    header="Documento de Referencia"
                    className="column column-docuemtno-referencia-pe" /*Documento de Referencia*/
                  ></Column>
                  <Column
                    body={actionBodyTemplateDetalleDespacho}
                    header="Detalles del Despacho"
                    exportable={false}
                    style={{ minWidth: "8rem" }}
                    className="column column-detalles-despacho-pe" /*Detalles del Despacho*/
                  ></Column>
                  <Column
                    header="Estado"
                    body={ratingBodyTemplateEstadoDespacho}
                    exportable={false}
                    style={{ minWidth: "8rem" }}
                    className="column column-estado" /*Estado*/
                  ></Column>
                  <Column
                    body={actionBodyTemplateAccionDespacho}
                    header="Acción"
                    exportable={false}
                    style={{ minWidth: "8rem" }}
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
                    style={{ minWidth: "8rem" }}
                    className="column column-delete" /*Eliminar*/
                  ></Column>
                </ListDespachos>
              </div>
            </div>
          </div>
        </Dialog>
        <Dialog
          visible={visibleCreateDespacho}
          style={{ width: "70vw" }}
          header={
            <>
              <i className="pi pi-users icon-create-proveedor"></i>Crear
              Despacho
            </>
          }
          modal
          className="p-fluid"
          footer={productDialogFooterDespachoCreate}
          onHide={hideDialogDespachosCreate}
        >
          <div className="">
            <div className="flex-crear-despacho">
              <div className="field field-despacho">
                <label htmlFor="estado_mantenimiento">Fecha de Entrega</label>
                <InputText
                  placeholder="Ingresar Fecha de Entrega"
                  onChange={handleChangeFechaEntrega}
                  value={despachosDetalles.fecha_entrega}
                  type="date"
                />
              </div>
              <div className="field field-despacho margin-despacho">
                <label htmlFor="estado_mantenimiento">
                  Documento de Referencia
                </label>
                <InputText
                  placeholder="Ingresar Documento de Referencia"
                  onChange={handleChangeDocumentoReferencia}
                  value={despachosDetalles.documento_referencia}
                />
              </div>
            </div>
          </div>
          <ListCreateDespachos
            data={despachosDetalles.despachos}
            selection={selectPedidoDetalle}
            onSelectionChange={(e) => {
              setSelectPedidoDetalle(e.value);
              console.log(e.value);
            }}
            onClickRefresh={() => getAllPedidosDetalles(pedido.id)}
            onInputSearch={(e) => setGlobalFilterPedidoDetalle(e.target.value)}
            valueGlobalFilter={globalFilterPedidoDetalle}
            editMode="row"
            onRowEditComplete={onRowEditComplete1}
            responsiveLayout="scroll"
          >
            <Column field={"producto.nombre"} header="Productos"
            className="column column-producto-detalle-despacho" /*Productos*/
            ></Column>
            <Column
              field={"producto.stock"}
              header="Cantidades de Productos"
              className="column column-cantidad-producto-detalle-despacho" /*Cantidades Productos*/
            ></Column>
            <Column
              field={"cantidad_solicitada"}
              header="Cantidades Solicitadas"
              className="column column-cantidad-solicitada-detalle-despacho" /*Cantidades Solicitadas*/
            ></Column>
            <Column
              field={"cantidad_entregada"}
              header="Cantidades Entregadas"
              className="column column-cantidades-entregadas-detalle-despacho" /*Cantidades Entregadas*/
              editor={(options) => textEditor(options)}
              onChange={(e) => handleChangeCantidadEntregada(e)}
            ></Column>
            <Column
              field={"cantidad_pendiente"}
              header="Cantidades Pendientes"
              //onChange={handleChangeCantidadPendiente}
              className="column column-cantidades-pendientes-detalle-despacho" /*Cantidades Pendientes*/
              disable
            ></Column>

            <Column
              rowEditor
              headerStyle={{ width: "10%", minWidth: "8rem" }}
              bodyStyle={{ textAlign: "center" }}
            ></Column>
          </ListCreateDespachos>
        </Dialog>
        <ConfirmDialog
          visible={visibleDeleteDespacho}
          onHide={() => {
            setVisibleDeleteDespacho(false);
            cleanDespacho();
          }}
          message={`Esta seguro de eliminar el despacho ${despacho.id}`}
          header="Confirmación"
          icon="pi pi-exclamation-triangle"
          acceptLabel="Sí"
          accept={accept2}
          reject={reject2}
        />
        <Dialog
          visible={visiblePedidosDetalles}
          style={{ width: "80vw", backgroundColor: "#F7F7F8 !important" }}
          modal
          className="p-fluid container-descripcion-modal-locales-dialog"
          footer={productDialogFooterPedidoDetalle}
          onHide={hideDialogPedidosDetalles}
        >
          <div className=""></div>
          <div>
            <div className="detalle-pedido">
              <div className="">
                <ListPedidoDetalle
                  data={pedidosDetalles}
                  selection={selectPedidoDetalle}
                  onSelectionChange={(e) => {
                    setSelectPedidoDetalle(e.value);
                    console.log(e.value);
                  }}
                  onClickRefresh={() => getAllPedidosDetalles(pedido.id)}
                  onInputSearch={(e) =>
                    setGlobalFilterPedidoDetalle(e.target.value)
                  }
                  valueGlobalFilter={globalFilterPedidoDetalle}
                >
                  <Column
                    field={"producto" != null ? "producto.nombre" : "producto"}
                    header="Producto"
                  ></Column>
                  <Column
                    field={"producto.stock"}
                    header="Cantidad de Producto"
                  ></Column>
                  <Column
                    field={"cantidad_solicitada"}
                    header="Cantidad Solicitada"
                  ></Column>
                  {/**<Column field={"cantidad_entregada"} header="Cantidad Entregada"></Column>**/}
                  <Column
                    field={"fecha_emision"}
                    header="Fecha de Emisión"
                  ></Column>
                  <Column
                    header="Estado"
                    body={ratingBodyTemplatePedidoDetalle}
                    exportable={false}
                    style={{ minWidth: "8rem" }}
                  ></Column>
                </ListPedidoDetalle>
              </div>
            </div>
          </div>
        </Dialog>
        <Dialog
          visible={visibleDetalleDespacho}
          style={{ width: "80vw", backgroundColor: "#F7F7F8 !important" }}
          modal
          className="p-fluid container-descripcion-modal-locales-dialog"
          footer={productDialogFooterDetalleDespacho}
          onHide={hideDialogDetalleDespachos}
        >
          <div className=""></div>
          <div>
            <div className="detalle-pedido">
              <div className="">
                <ListDetalleDespacho
                  data={pedidosDetalles}
                  selection={selectPedidoDetalle}
                  onSelectionChange={(e) => {
                    setSelectPedidoDetalle(e.value);
                    console.log(e.value);
                  }}
                  onClickRefresh={() => getAllPedidosDetalles(pedido.id)}
                  onInputSearch={(e) =>
                    setGlobalFilterPedidoDetalle(e.target.value)
                  }
                  valueGlobalFilter={globalFilterPedidoDetalle}
                >
                  <Column field={"producto.nombre"} header="Productos"></Column>
                  <Column
                    field={"producto.stock"}
                    header="Cantidades de Productos"
                  ></Column>
                  <Column
                    field={"cantidad_solicitada"}
                    header="Cantidades Solicitadas"
                  ></Column>
                  <Column
                    field={"cantidad_entregada"}
                    header="Cantidades Entregadas"
                  ></Column>
                  <Column
                    field={"cantidad_pendiente"}
                    header="Cantidades Pendientes"
                    //onChange={handleChangeCantidadPendiente}
                    disable
                  ></Column>
                  <Column field={"estado_entrega"} header="Estado"></Column>
                </ListDetalleDespacho>
              </div>
            </div>
          </div>
        </Dialog>
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
      </Container>
    </>
  );
}