import React, { useState, useRef, useEffect } from "react";
import Estadistica from "../../Components/Estadistica/Estadistica";
import InputEstadistica from "../../Components/Estadistica/InputEstadistica";
import "./pageEstadistica.css";
import Container from "../../Components/Container/Container";
import ClienteService from "../../Services/ClienteService";
import ProductoService from "../../Services/ProductoService";
import EstadisticaService from "../../Services/EstadisticaService";
import { MultiSelect } from 'primereact/multiselect';
import { Toast } from "primereact/toast";
import AuthUser from '../../AuthUser';
import { useDispatch } from "react-redux";
import { logout } from "../../reducers/authSlices";

export default function PageEstadistica3() {
  const toast = useRef(null);
  const { http, getToken, deleteToken } = AuthUser();
  const [my, setMy] = useState(null);
  const [dataBars, setDataBars] = useState(null);
  const dispatch =useDispatch()
  const [filtro, setFiltro] = useState({
    fechaInicio: "",
    fechaFinal: "",
    cliente_id: null,
    producto_id: null,
    producto: null,
    cliente: null,
  });
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const getBars = (e) => {
    http.post("/estadistica/bars", filtro)
      .then((response) => {
        if (filtro.fechaInicio.length == 0) {
          showToast(
            "error",
            "Acceso Denegado",
            `Ingrese el filtro de fecha inicial`
          );
        } else if (filtro.fechaFinal.length == 0) {
          showToast(
            "error",
            "Acceso Denegado",
            `Ingrese el filtro de fecha Final`
          );
        } else if (
          new Date(filtro.fechaInicio) >= new Date(filtro.fechaFinal)
        ) {
          console.log("errrororororo");
          showToast(
            "error",
            "Acceso Denegado",
            `La fecha inicial es superior a la fecha inicial`
          );
        } else if (filtro.cliente == null) {
          showToast("error", "Acceso Denegado", `Ingrese el filtro de Cliente`);
        } else if (filtro.producto == null) {
          showToast(
            "error",
            "Acceso Denegado",
            `Ingrese el filtro de Producto`
          );
        } else {
          showToast("success", "Graficando..", `Graficando....`);
          setDataBars(response.data);
          console.log(dataBars);
        }
      })
      .catch((error) => {
        console.log(error);
        showToast("error", "Acceso Denegado", `Ingreso incorrecto de filtro`);
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
  const getAllClientes = () => {
    http.get("/clientes/get")
      .then((response) => {
        setClientes(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getAllProductos();
    getAllClientes();
  }, [setProductos, setClientes]);

  useEffect(() => {
    handleMy();
  }, []);
  

  const handleMy = async () => {
    try {


      const response = await http.post("/my");
      setMy(response.data);
      if (!response.data.status) {

      } else {
        // deleteToken();
        dispatch(logout())
      }
      console.log("promesa 2", response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleChangeFechaInicio = (e) => {
    setFiltro({
      fechaInicio: e.target.value,
      fechaFinal: filtro.fechaFinal,
      cliente_id: filtro.cliente_id,
      producto_id: filtro.producto_id,
      producto: filtro.producto,
      cliente: filtro.cliente,
    });
  };
  const handleChangeFechaFinal = (e) => {
    setFiltro({
      fechaInicio: filtro.fechaInicio,
      fechaFinal: e.target.value,
      cliente_id: filtro.cliente_id,
      producto_id: filtro.producto_id,
      producto: filtro.producto,
      cliente: filtro.cliente,
    });
  };
  const handleChangeCliente = (e) => {
    setFiltro({
      fechaInicio: filtro.fechaInicio,
      fechaFinal: filtro.fechaFinal,
      cliente_id: e.value == null ? null : e.value.id,
      producto_id: filtro.producto_id,
      producto: filtro.producto,
      cliente: e.value,
    });
  };
  const handleChangeProducto = (e) => {
    setFiltro({
      fechaInicio: filtro.fechaInicio,
      fechaFinal: filtro.fechaFinal,
      cliente_id: filtro.cliente_id,
      producto_id: e.value == null ? null : e.value.id,
      producto: e.value,
      cliente: filtro.cliente,
    });
  };
  const limpiar = (e) => {
    setFiltro({
      fechaInicio: "",
      fechaFinal: "",
      cliente_id: null,
      producto_id: null,
      producto: null,
      cliente: null,
    });
    setDataBars(null);
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
    <div className="pageEstadistica-general">
      <div className="page-estadisticas-title">
        <h1 className="page-estadisticas-h1"></h1>
        <p className="page-estadisticas-p" style={{ fontWeight: 'bold', color: '#6D6D6D' }}>
          A continuación, seleccione varios clientes y un producto.
        </p>
      </div>
      <div className="page-estadisticas-flex">
        <Toast ref={toast} />
        <div className="card__general-estadistica-existente">
          <div className="card__general-estadistica2">
            <div className="card__general-estadistica2 card__general-estadistica-menor12" >
              <div className="page-estadistica-input">
                <InputEstadistica
                  optionsProducto={productos}
                  optionLabelProducto={"nombre"}
                  optionsCliente={clientes}
                  optionLabelCliente={"razon_social"}
                  valueFechaInicio={filtro.fechaInicio}
                  onChangeFechaInicio={(e) => {
                    handleChangeFechaInicio(e);
                  }}
                  valueFechaFinal={filtro.fechaFinal}
                  onChangeFechaFinal={(e) => {
                    handleChangeFechaFinal(e);
                  }}
                  valueCliente={filtro.cliente}
                  onChangeCliente={(e) => {
                    handleChangeCliente(e);
                  }}
                  valueProducto={filtro.producto}
                  onChangeProducto={(e) => {
                    handleChangeProducto(e);
                  }}
                  onClickGraficar={(e) => {
                    getBars(e);
                  }}
                  onClickLimpiar={(e) => {
                    {
                      limpiar(e);
                    }
                  }}
                />
              </div>
            </div>
            <div className="card__general-estadistica3 card__general-estadistica-menor23">
              <Estadistica data={dataBars} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}