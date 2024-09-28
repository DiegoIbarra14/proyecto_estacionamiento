import React, { useEffect, useState, useRef } from "react";
import { Column } from "primereact/column";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import ListProducto from "../../Components/Producto/ListProducto";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import Container from "../../Components/Container/Container";
import ProductoService from "../../Services/ProductoService";
import AuthUser from '../../AuthUser';
import { logout } from "../../reducers/authSlices";
import { useDispatch } from "react-redux";

export default function PageListProducto() {
  const navigate = useNavigate();
  const { http, getToken, deleteToken } = AuthUser();
  const dispatch =useDispatch()
  const location = useLocation();
  const [my, setMy] = useState(null);
  const toast = useRef(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [presentaciones, setPresentaciones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [select, setSelect] = useState(null);
  const [producto, setProducto] = useState({
    id: 0,
    nombre: "",
    presentacion_id: null,
    cantidad_base: 150,
    tiempo_vida: 15,
    estado_registro: "A",
    ingredientes: [],
  });
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [presentacion, setPresentacion] = useState(null);

  const getAllPresentaciones = () => {
    http.get("/presentaciones/get")
      .then((response) => {
        setPresentaciones(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllProductos = () => {
    http.get("/productos/get")
      .then((response) => {
        setProductos(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getAllProductos();
    getAllPresentaciones
  }, [setProductos]);

  useEffect(() => {
    handleMy();
    // Mostrar el mensaje si existe en el estado de la navegación
    if (location.state && location.state.message) {
      showToast(location.state.severity, location.state.title, location.state.message);
    }
  }, [location]);
  
  const handleMy = async () => {
    try {
      
      
      const response = await http.post("/my");
      setMy(response.data);
      if (!response.data.status) {
        
      } else {
        
        // deleteToken();
        dispatch(logout())
      }
    } catch (e) {
      console.log(e);
    }
  };

  //necesario para el crud
  const actionBodyTemplateDelete = (rowData) => {
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
    setVisibleDelete(true);
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
    cleanProducto();
  };
  const cleanProducto = () => {
    setProducto({
      id: 0,
      nombre: "",
      presentacion_id: null,
      cantidad_base: 150,
      tiempo_vida: 15,
      estado_registro: "A",
      ingredientes: [],
    });
  };
  // console.log(productos);
  const handleSubmitDelete = () => {
    http.delete(`/productos/delete/${producto.id}`)
      .then((response) => {
        showToast(
          "success",
          "Producto Eliminado",
          `Se elimino correctamente el producto ${producto.nombre}`
        );
        getAllProductos();
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "errro",
          "Producto No Eliminado",
          `No Se Elimino el cliente ${producto.nombre}`
        );
      });
  };
  const actionBodyTemplateUpdate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmUpdateProducto(rowData)}
        />
      </React.Fragment>
    );
  };
  const confirmUpdateProducto = (producto) => {
    setProducto(producto);
    navigate(`updateProducto/${producto.id}`);
    //setVisibleDelete(true);
  };
  /*const accept = () => {
    handleSubmitDelete();
  };
  const reject = () => {
    toast.current.show({
      severity: 'info',
      summary: 'Rechazada',
      detail: 'No se realizo ninguna acción',
      life: 3000,
    });
    cleanProducto();
  };*/
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
      <Container url="getProductos">
        <Toast ref={toast} />
        <div className="p-container-headerPrima">
          <div className="p-container-titulo">
            <h1 style={{color:'#04638A'}} className="container-titulo-table">Lista de Productos</h1>
          </div>
          <div className="container-descripcion">
            <div className="container-descripcion-table">
              <p>
                A continuación, se visualiza la lista de los productos
                registrados en el sistema.
              </p>
            </div>
            <div className="container-descripcion-button-add">
              <button
                onClick={() => {
                  navigate("createProducto");
                }}
                className="button button-crear"
              >
                Crear Producto <i className="pi pi-plus mr-2"></i>
              </button>
            </div>
          </div>
        </div>
        <ListProducto
          data={productos}
          selection={select}
          onSelectionChange={(e) => {
            setSelect(e.value);
          }}
          onClickRefresh={() => {
            getAllProductos();
          }}
          onInputSearch={(e) => setGlobalFilter(e.target.value)}
          valueGlobalFilter={globalFilter}
        >
          <Column field={"nombre"} header="Producto" className="column column-name" body={(rowData) => formatValue(rowData.nombre)} ></Column>
          <Column field={"stock"} header="Stock" className="column column-stock" body={(rowData) => formatValue(rowData.stock)}></Column>
          <Column field={"cantidad_base"} header="Cantidad Base" className="column column-quantity" body={(rowData) => formatValue(rowData.cantidad_base)}></Column>
          <Column field={"presentacion.nombre"} header="Presentación" className="column column-quantity" body={(rowData) => formatValue(rowData.presentacion.nombre)}></Column>
          <Column field={"tiempo_vida"} header="Tiempo de vida (días)" className="column column-time" body={(rowData) => formatValue(rowData.tiempo_vida)}></Column>
          <Column
            body={actionBodyTemplateUpdate}
            header="Editar"
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
        </ListProducto>

        <ConfirmDialog
          visible={visibleDelete}
          onHide={() => {
            setVisibleDelete(false);
            cleanProducto();
          }}
          message={`Esta seguro de eliminar el producto ${producto.nombre}`}
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