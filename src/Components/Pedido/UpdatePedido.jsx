import React, { useEffect, useState, useRef } from "react";
import http from "../../http-common";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import TableIngredientes from "./TableIngredientes";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "./createPedido.css";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "primereact/confirmdialog";
import ModalidadPagoService from "../../Services/ModalidadPagoService";
import ClienteService from "../../Services/ClienteService";
import PedidoService from "../../Services/PedidoService";
import ProductoService from "../../Services/ProductoService";
import AuthUser from "../../AuthUser";
const UpdatePedido = (props) => {
  let navigate = useNavigate();
  const { http, getToken, deleteToken } = AuthUser();
  //const [my, setMy] = useState(null);
  let params = props.params;
  const toast = useRef(null);
  const [clientes, setClientes] = useState([]);
  const [modalidadPagos, setModalidadPagos] = useState([]);
  const [loadingPedido, setLoadingPedido] = useState(false);
  const [pedido, setPedido] = useState({
    id: 0,
    cliente: null,
    cliente_id: null,
    local_cliente_id : null,
    local_cliente: null,
    modalidad_pago: null,
    modalidad_pago_id: null,
    //documento_referencia: '',
    pedido_detalle: [],
  });
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleDeleteProducto, setVisibleDeleteProducto] = useState(false);
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState(null);
  const [cantidadSolicitadas, setCantidadSolicitadas] = useState(0);
  //const [precios, setPrecios] = useState(0);
  //const [total, setTotal] = useState(0);

  const showPedido = () => {
    //PedidoService.get(`${params.idPedido}`);
    http
      .get(`/pedidos/get/${params.idPedido}`)
      .then((response) => {
        setPedido(response.data);
        console.log(pedido);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAllClientes = () => {
    //ClienteService.getAll()
    http
      .get("/clientes/get")
      .then((response) => {
        setClientes(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAllModalidadPagos = () => {
    //ModalidadPagoService.getAll()
    http
      .get("/modalidadpagos/get")
      .then((response) => {
        setModalidadPagos(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAllProductos = () => {
    //ProductoService.getAll()
    http
      .get("/productos/get")
      .then((response) => {
        setProductos(response.data.data);
        console.log(productos);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    showPedido();
    getAllClientes();
    getAllModalidadPagos();
    getAllProductos();
  }, [setProductos]);

  const handleAddProducto = (product) => {
    if (producto === null) {
      showToast(
        "error",
        "Error al agregar Producto",
        `Debe Seleccionar un Producto`
      );
    } else if (cantidadSolicitadas <= 0) {
      showToast(
        "error",
        "Error al agregar Producto",
        `Debe ingresar una cantidad mayor a 0`
      );
    } else {
      const newProducto = {
        pedido_id: 0,
        producto: producto,
        producto_id: producto.id,
        cantidad_solicitada: cantidadSolicitadas,
        //cantidad_entregada: cantidadEntregadas,
        //precio: precios,
        //total: cantidadSolicitadas*precios,
      };
      let existe = false;
      const newProductos = pedido.pedido_detalle.map((pro) => {
        console.log(existe, pro);
        if (existe === false) {
          if (pro.id === product.id) {
            existe = true;
            console.log("enra al if de existe", existe);
            return {
              ...pro,
              cantidad_solicitada: cantidadSolicitadas,
              //cantidad_entregada: cantidadEntregadas,
              //precio: precios,
              //total: cantidadSolicitadas*precios,
            };
          } else {
            existe = false;
          }
        } else {
          return pro;
        }
        return pro;
      });
      if (!existe) {
        setPedido({
          cliente: pedido.cliente,
          cliente_id: pedido.cliente_id,
          local_cliente_id : pedido.local_cliente_id,
          local_cliente: pedido.local_cliente,
          fecha_emision: pedido.fecha_emision,
          modalidad_pago: pedido.modalidad_pago,
          modalidad_pago_id: pedido.modalidad_pago_id,
          //documento_referencia: pedido.documento_referencia,
          estado_pedido: pedido.estado_pedido,
          pedido_detalle: [...pedido.pedido_detalle, newProducto],
        });
      } else {
        console.log("ingresa al else");
        setPedido({
          cliente: pedido.cliente,
          cliente_id: pedido.cliente_id,
          local_cliente_id : pedido.local_cliente_id,
          local_cliente: pedido.local_cliente,
          fecha_emision: pedido.fecha_emision,
          modalidad_pago: pedido.modalidad_pago,
          modalidad_pago_id: pedido.modalidad_pago_id,
          //documento_referencia: pedido.documento_referencia,
          estado_pedido: pedido.estado_pedido,
          pedido_detalle: newProductos,
        });
      }

      setProducto(null);
      setCantidadSolicitadas(0);
      //setCantidadEntregadas(0);
      //setPrecios(0);
      //setTotal();
    }
  };
  const handleChangeCliente = (e) => {
    setPedido({
      cliente: e.target.value,
      cliente_id: e.value != null ? e.value.id : e.value,
      local_cliente_id : pedido.local_cliente_id,
      local_cliente: pedido.local_cliente,
      modalidad_pago: pedido.modalidad_pago,
      modalidad_pago_id: pedido.modalidad_pago_id,
      //documento_referencia: pedido.documento_referencia,
      pedido_detalle: pedido.pedido_detalle,
    });
  };
  const handleChangeLocal = (e) => {
    setPedido({
      cliente: pedido.cliente,
      cliente_id: pedido.cliente_id,
      local_cliente_id : e.value != null ? e.value.id : e.value,
      local_cliente: e.target.value,
      costo_total: pedido.costo_total,
      modalidad_pago: pedido.modalidad_pago,
      modalidad_pago_id: pedido.modalidad_pago_id,
      //documento_referencia: pedido.documento_referencia,
      pedido_detalle: pedido.pedido_detalle,
    });
  };
  const handleChangeModalidadPago = (e) => {
    setPedido({
      cliente: pedido.cliente,
      cliente_id: pedido.cliente_id,
      local_cliente_id : pedido.local_cliente_id,
      local_cliente: pedido.local_cliente,
      modalidad_pago: e.target.value,
      modalidad_pago_id: e.value != null ? e.value.id : e.value,
      //documento_referencia: pedido.documento_referencia,
      pedido_detalle: pedido.pedido_detalle,
    });
  };
  const handleChangeProducto = (e) => {
    setProducto(e.value);
    setPedido({
      cliente: pedido.cliente,
      cliente_id: pedido.cliente_id,
      local_cliente_id : pedido.local_cliente_id,
      local_cliente: pedido.local_cliente,
      modalidad_pago: pedido.modalidad_pago,
      modalidad_pago_id: pedido.modalidad_pago_id,
      //documento_referencia: pedido.documento_referencia,
      pedido_detalle: pedido.pedido_detalle,
    });
  };
  const handleChangeCantidadSolicitada = (e) => {
    setCantidadSolicitadas(e.target.value);
  };
  /**const handleChangePrecio = (e) => {
    setPrecios(e.target.value);
  };
  const handleChangeTotal = (e) => {
    setTotal(e.target.value);
  };**/

  const handleSubmitUpdate = () => {
    if (!pedido.cliente || !pedido.cliente.razon_social) {
      showToast(
        "error",
        "Error al crear Pedido",
        "Debe seleccionar un cliente para el pedido"
      );
    } else if (!pedido.local_cliente) {
      showToast(
        "error",
        "Error al crear Pedido",
        "Debe seleccionar un local para el pedido"
      );
    } else if (!pedido.modalidad_pago) {
      showToast(
        "error",
        "Error al crear Pedido",
        "Debe seleccionar una modalidad de pago para el pedido"
      );
    } else if (pedido.pedido_detalle.length === 0) {
      showToast(
        "error",
        "Error al crear Pedido",
        "Debe ingresar al menos un producto para el pedido"
      );
    } else {
      // Verificar si todos los productos tienen cantidad solicitada y presentación
      const productosIncompletos = pedido.pedido_detalle.filter(
        (producto) => !producto.cantidad_solicitada || !producto.producto.presentacion
      );
  
      if (productosIncompletos.length > 0) {
        showToast(
          "error",
          "Error al crear Pedido",
          "Todos los productos deben tener cantidad solicitada y presentación"
        );
      } else {
        console.log("creado");
        console.log('Pedido: ', pedido);
        setLoadingPedido(true);
        http
          .post("/pedidos/create", pedido)
          .then((response) => {
            showToast(
              "success",
              "Pedido Creado",
              "Se creó el pedido correctamente"
            );
            navigate("/getPedidos");
          })
          .catch((error) => {
            console.log(error);
            showToast(
              "error",
              "Pedido No Creado",
              "No se pudo crear el pedido"
            );
          })
          .finally(() => {
            setTimeout(() => {
              setLoadingPedido(false);
            }, 5000);
          })
      }
    }
  };
  const showToast = (tipo, titulo, detalle) => {
    toast.current.show({
      severity: tipo,
      summary: titulo,
      detail: detalle,
      life: 3000,
    });
  };

  const actionBodyTemplateDeleteProducto = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => confirmDeleteProducto(rowData)}
        />
      </React.Fragment>
    );
  };
  const confirmDeleteProducto = (producto) => {
    setProducto(producto);
    setVisibleDeleteProducto(true);
  };
  const deleteProducto = (product) => {
    const newProducto = pedido.pedido_detalle.filter(
      (pro) => pro.producto_id !== product.producto_id
    );

    setPedido({
      cliente: pedido.cliente,
      cliente_id: pedido.cliente_id,
      local_cliente_id : pedido.local_cliente_id,
      local_cliente: pedido.local_cliente,
      modalidad_pago: pedido.modalidad_pago,
      modalidad_pago_id: pedido.modalidad_pago_id,
      //documento_referencia: pedido.documento_referencia,
      pedido_detalle: newProducto,
    });
  };
  const acceptDeleteProducto = () => {
    deleteProducto(producto);
  };
  const rejectDeleteProducto = () => {
    toast.current.show({
      severity: "info",
      summary: "Rechazada",
      detail: "No se realizo ninguna acción",
      life: 3000,
    });
  };
  return (
    <>
      <Toast ref={toast} />
      <div className="section-crear-producto">
        <div className="title-crear-producto">
          <h1>Actualizar Pedido</h1>
        </div>
        <div className="field section-input">
          <label htmlFor="cliente">Cliente*</label>
          <Dropdown
            style={{ width: "100%" }}
            id="cliente"
            value={pedido.cliente}
            options={clientes}
            onChange={handleChangeCliente}
            optionLabel="razon_social"
            placeholder="Seleccione un cliente"
            autoFocus
            filter
            required
            emptyMessage='No se encontraron resultados.'
          />
        </div>
        <div className="field section-input">
          <label htmlFor="local_cliente">Local</label>
          <Dropdown
            style={{ width: "100%" }}
            id="local_cliente"
            value={pedido.local_cliente}
            options={pedido.cliente==null?"":pedido.cliente.locales}
            onChange={handleChangeLocal}
            optionLabel="nombre_local"
            placeholder="Seleccione un Local"
            autoFocus
            required
            filter
            emptyMessage='No se encontraron resultados.'
          />
        </div>
        <div className="field section-input">
          <label htmlFor="modalidad_pago">Modalidad de Pago*</label>
          <Dropdown
            style={{ width: "100%" }}
            id="modalidad_pago"
            value={pedido.modalidad_pago}
            options={modalidadPagos}
            onChange={handleChangeModalidadPago}
            optionLabel="nombre"
            placeholder="Seleccione una Modalidad de Pago para el Pedido"
            autoFocus
            required
            filter
            emptyMessage='No se encontraron resultados.'
          />
        </div>

        <div className="field section-input">
          <label htmlFor="productos">Productos*</label>
          <Dropdown
            id="productos"
            value={producto}
            options={productos}
            onChange={(e) => {
              handleChangeProducto(e);
            }}
            optionLabel="nombre"
            placeholder="Selecciona Un Producto"
            autoFocus
            filter
            required
            style={{ width: "100%" }}
          />
        </div>
        <div className="field section-input">
          <label htmlFor="cantidad_solicitada">Cantidad Solicitada*</label>
          <InputText
            style={{ width: "100%" }}
            id="cantidad_solicitada"
            value={cantidadSolicitadas}
            onChange={(e) => handleChangeCantidadSolicitada(e)}
            required
            keyfilter="num"
            autoComplete="off"
            placeholder="Ingrese la Cantidad Solicitada"
          />
        </div>
        {/**<div className='field section-input'>
          <label htmlFor='precio'>Precio*</label>
          <InputText
            style={{ width: '100%' }}
            id='precio'
            value={precios}
            onChange={(e) => handleChangePrecio(e)}
            required
            keyfilter='num'
            autoComplete='off'
            placeholder='Ingrese el Precio'
          />
          </div>**/}
        <div className="section-button-add-ingrediente">
          <Button
            type="button"
            icon="pi pi-plus"
            label="Agregar Producto"
            onClick={(e) => {
              handleAddProducto(producto);
            }}
          />
        </div>

        <div className="field">
          <label htmlFor="productos">Lista de Productos*</label>
          <TableIngredientes data={pedido.pedido_detalle}>
            <Column field={"producto.nombre"} header="Producto"></Column>
            <Column
              field={"producto.stock"}
              header="Cantidad de Producto"
            ></Column>
            <Column
              field={"cantidad_solicitada"}
              header="Cantidad Solicitada"
            ></Column>
            {/**<Column field={'precio'} header='Precio'></Column>
            <Column field={'total'} header='Total'></Column>**/}
            <Column
              body={actionBodyTemplateDeleteProducto}
              header="Eliminar"
              exportable={false}
              style={{ minWidth: "8rem" }}
            ></Column>
          </TableIngredientes>
        </div>

        {/**<div className='field section-input'>
          <label htmlFor='costo_total'>Costo Total*</label>
          <InputText
            style={{ width: '100%' }}
            id='costo_total'
            value={pedido.costo_total}
            onChange={handleChangeCostoTotal}
            required
            keyfilter='num'
            autoComplete='off'
            placeholder='Ingrese Costo Total del Pedido'
          />
          </div>**/}

        <div className="section-button-submits">
          <Button
            type="button"
            icon="pi pi-save"
            disabled={loadingPedido}
            className="p-button-success"
            label="Actualizar Pedido"
            style={{ marginRight: "20px" }}
            onClick={(e) => {
              handleSubmitUpdate();
            }}
          />
          <Button
            type="button"
            icon="pi pi-arrow-left"
            className="p-button-danger"
            label="Retornar"
            onClick={(e) => {
              navigate("/getPedidos");
            }}
          />
        </div>

        <ConfirmDialog
          visible={visibleDeleteProducto}
          onHide={() => {
            setVisibleDeleteProducto(false);
          }}
          message={`Esta seguro de eliminar el producto ${""}`}
          header="Confirmación"
          icon="pi pi-exclamation-triangle"
          acceptLabel="Sí"
          accept={acceptDeleteProducto}
          reject={rejectDeleteProducto}
        />
      </div>
    </>
  );
};

export default UpdatePedido;
