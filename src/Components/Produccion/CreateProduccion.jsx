import React, { useEffect, useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import TableProduccion from "./TableProduccion";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "./createProduccion.css";
import { useNavigate } from "react-router-dom";
import AuthUser from "../../AuthUser";
import { ConfirmDialog } from "primereact/confirmdialog";
import TextTrimmer from "../General/TextTrimmer";
const CreateProduccion = () => {
  let navigate = useNavigate();
  const { http, getToken, deleteToken } = AuthUser();
  const toast = useRef(null);
  const [visibleLotes, setVisibleLotes] = useState(false);
  const [visibleServicios, setVisibleServicios] = useState(false);
  const [selectedLotes, setSelectedLotes] = useState(null);
  const [suma, setSuma] = useState(0);
  const [codigoOrden, setCodigoOrden] = useState(null);
  const [ordenProduccion, setOrdenProduccion] = useState(null);
  const [ordenes, setOrdenes] = useState([
    { id: 1, nombre: "A pedido" },
    { id: 2, nombre: "A stock" },
  ]);
  const [productos, setProductos] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [producto, setProducto] = useState(null);
  const [responsable, setResponsable] = useState(null);
  const [cantidad, setCantidad] = useState(0);
  const [horas, setHoras] = useState(0);
  const [totalMateriaPrima, setTotalMateriaPrima] = useState(0);
  const [totalTrabajador, setTotalTrabajador] = useState(0);
  const [totalMaquina, setTotalMaquina] = useState(0);
  const [cantidadTotal, setCantidadTotal] = useState(0);
  const [produccionIngredientes, setProduccionIngredientes] = useState([]);
  const [produccionMaquinas, setProduccionMaquinas] = useState([]);
  const [produccionResponsable, setProduccionResponsable] = useState([]);
  const [visibleDeleteResponsable, setVisibleDeleteResponsable] =
    useState(false);
  const [servicios, setServicios] = useState([]);
  const [allServicios, setAllServicios] = useState([]);
  const [tempSelectedLotes, setTempSelectedLotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const optionTemplate = (option) => {
    return (
      <div>
        {option.nombres} {option.apellidos}
      </div>
    );
  };
  const valueTemplate = (option) => {
    if (option) {
      return (
        <div>
          {option.nombres} {option.apellidos}
        </div>
      );
    }
    return <span>Seleccion Responsable</span>;
  };
  const [produccion, setProduccion] = useState({
    id: "0",
    cantidad: cantidad,
    codigo_orden: codigoOrden,
    orden_produccion_id: ordenProduccion?.id,
    codigo_produccion: "",
    producto_id: null,
    producto: null,
    costo_total: 0,
    estado_produccion: "1",
    produccion_ingredientes: [],
    produccion_maquinas: [],
    produccion_responsables: [],
    lotes: null,
  });
  const getAllProductos = () => {
    http
      .get("/productos/get")
      .then((response) => {
        setProductos(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllResponsables = () => {
    http
      .get("/trabajadores/get")
      .then((response) => {
        console.log(response.data.data);
        setResponsables(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllLotes = (id) => {
    http
      .get(`/producciones/getlotes/${id}`)
      .then((response) => {
        setLotes(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllMaquinaServicios = (id) => {
    http
      .get(`/producciones/getservicios/${id}`)
      .then((response) => {
        setServicios(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllServicios = async (response, maquinas) => {
    try {
      if (response.data.data) {
        let totalServicios = 0;
        let _producccion = produccion;
        let services = response.data.data.map((_servicios) => {
          let batchfinal = Math.ceil(
            (produccion.cantidad * _servicios.batch) / producto?.cantidad_base
          );
          totalServicios =
            totalServicios +
            _servicios.tarifa *
              1 *
              (_servicios.consumo * 1) *
              (_servicios.cantidad_horas * 1) *
              batchfinal;
          return { ..._servicios };
        });
        let maq_service = maquinas;
        let maquinaProduccion = maq_service.map((maq) => {
          let _batch = Math.ceil(
            (produccion.cantidad * maq?.batch) / producto?.cantidad_base
          );
          let horasTotales = _batch * maq?.horas;
          return { ...maq, total_horas: horasTotales, totalBatch: _batch };
        });
        setTotalMaquina(totalServicios);
        setCantidadTotal(
          (totalServicios + totalMateriaPrima + totalTrabajador).toFixed(2)
        );
        setAllServicios(services);
        return maquinaProduccion;
      }
    } catch (error) {}
  };

  useEffect(() => {
    getAllProductos();
    getAllResponsables();
  }, []);

  const actionBodyTemplateLote = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className={
            rowData.estado == 1
              ? "p-button-rounded p-button-success"
              : "p-button-rounded p-button-danger"
          }
          onClick={() => confirmAgregarLote(rowData)}
        />
      </React.Fragment>
    );
  };

  const actionBodyTemplateServicio = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-info"
          className="p-button-rounded p-button-info"
          onClick={() => confirmVerServicios(rowData)}
        />
      </React.Fragment>
    );
  };

  const setProducciones = async (id) => {
    setLoading(true);
    try {
      const [response, response2, response3] = await Promise.all([
        http.get(`/producciones/produccionesingredientes/${id}`),
        http.get(`/producciones/produccionesmaquinas/${id}`),
        http.get(`/producciones/getallservicios/${id}`),
      ]);
      const produccion_maquinas = await getAllServicios(
        response3,
        response2?.data?.data
      );
      response.data.data.map((_materia) => {
        _materia.cantidad = (
          (_materia.cantidad * produccion.cantidad) /
          cantidad
        ).toFixed(2);
      });
      setProduccion({
        id: produccion.id,
        cantidad: produccion.cantidad,
        codigo_orden: codigoOrden,
        orden_produccion_id: ordenProduccion?.id,
        codigo_produccion: produccion.codigo_produccion,
        producto_id: produccion.producto_id,
        producto: produccion.producto,
        costo_total: produccion.costo_total,
        estado_produccion: "1",
        produccion_ingredientes: response.data.data,
        produccion_maquinas: produccion_maquinas,
        produccion_responsables: produccion.produccion_responsables,
        lotes: produccion.lotes,
      });
      console.log("res", produccion_maquinas);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateTrabajadorCosto();
  }, [produccionResponsable]);

  useEffect(() => {
    calculateMateriaPrimaCosto();
  }, []);

  useEffect(() => {
    comprobarLote();
  }, [selectedLotes, visibleLotes]);

  useEffect(() => {
    setProduccion({
      id: produccion.id,
      cantidad: produccion.cantidad,
      codigo_orden: codigoOrden,
      orden_produccion_id: ordenProduccion?.id,
      codigo_produccion: produccion.codigo_produccion,
      producto_id: produccion.producto_id,
      producto: produccion.producto,
      costo_total: produccion.costo_total,
      estado_produccion: "1",
      produccion_ingredientes: produccion.produccion_ingredientes,
      produccion_maquinas: produccion.produccion_maquinas,
      produccion_responsables: produccion.produccion_responsables,
      lotes: produccion.lotes,
    });
  }, [codigoOrden, ordenProduccion]);

  const handleChangeCantidad = (e) => {
    let value = e.target.value;

    value = value.replace(/[^0-9.]/g, "");

    const decimalPoints = (value.match(/\./g) || []).length;
    if (decimalPoints > 1) {
      setError("Solo se permite un punto decimal.");
      return;
    }

    const [integerPart, decimalPart] = value.split(".");

    if (integerPart && integerPart.length > 18) {
      setError("La parte entera no puede tener más de 18 dígitos.");
      return;
    }

    if (decimalPart && decimalPart.length > 2) {
      setError("Solo se permiten hasta dos decimales.");
      return;
    }

    if (value.length > 20) {
      setError("El valor no puede tener más de 20 caracteres.");
      return;
    }

    setProduccion({
      id: produccion.id,
      cantidad: value,
      codigo_orden: codigoOrden,
      orden_produccion_id: ordenProduccion?.id,
      codigo_produccion: produccion.codigo_produccion,
      producto_id: produccion.producto_id,
      producto: produccion.producto,
      costo_total: produccion.costo_total,
      estado_produccion: "1",
      produccion_ingredientes: produccion.produccion_ingredientes,
      produccion_maquinas: produccion.produccion_maquinas,
      produccion_responsables: produccion.produccion_responsables,
      lotes: produccion.lotes,
    });
  };
  const handleChangeCodigoProduccion = (e) => {
    setProduccion({
      id: produccion.id,
      cantidad: produccion.cantidad,
      codigo_orden: codigoOrden,
      orden_produccion_id: ordenProduccion?.id,
      codigo_produccion: e.target.value,
      producto_id: produccion.producto_id,
      producto: produccion.producto,
      costo_total: produccion.costo_total,
      estado_produccion: "1",
      produccion_ingredientes: produccion.produccion_ingredientes,
      produccion_maquinas: produccion.produccion_maquinas,
      produccion_responsables: produccion.produccion_responsables,
      lotes: produccion.lotes,
    });
  };
  const handleChangeProducto = (e) => {
    setProducto(e.value);
    setCantidad(e.value.cantidad_base);
    setProduccion({
      id: produccion.id,
      cantidad: e.value.cantidad_base,
      codigo_orden: codigoOrden,
      orden_produccion_id: ordenProduccion?.id,
      codigo_produccion: produccion.codigo_produccion,
      producto_id: e.value != null ? e.value.id : e.value,
      producto: e.value,
      costo_total: produccion.costo_total,
      estado_produccion: "1",
      produccion_ingredientes: produccion.produccion_ingredientes,
      produccion_maquinas: produccion.produccion_maquinas,
      produccion_responsables: produccion.produccion_responsables,
      lotes: produccion.lotes,
    });
  };
  const handleChangeResponsable = (e) => {
    setResponsable(e.value);
    setProduccion({
      id: produccion.id,
      cantidad: produccion.cantidad,
      codigo_orden: codigoOrden,
      orden_produccion_id: ordenProduccion?.id,
      codigo_produccion: produccion.codigo_produccion,
      producto_id: produccion.producto_id,
      producto: produccion.producto,
      costo_total: produccion.costo_total,
      estado_produccion: "1",
      produccion_ingredientes: produccion.produccion_ingredientes,
      produccion_maquinas: produccion.produccion_maquinas,
      produccion_responsables: produccion.produccion_responsables,
      lotes: produccion.lotes,
    });
  };
  const handleChangeHora = (e) => {
    let value = e.target.value;

    // Remove all non-numeric characters except dot
    value = value.replace(/[^0-9.]/g, "");

    // Ensure only one dot is present
    const decimalPoints = (value.match(/\./g) || []).length;
    if (decimalPoints > 1) {
      setError("Solo se permite un punto decimal.");
      return;
    }

    const [integerPart, decimalPart] = value.split(".");

    // Ensure integer part length
    if (integerPart && integerPart.length > 18) {
      setError("La parte entera no puede tener más de 18 dígitos.");
      return;
    }

    // Ensure decimal part length
    if (decimalPart && decimalPart.length > 2) {
      setError("Solo se permiten hasta dos decimales.");
      return;
    }

    // Ensure total length
    if (value.length > 20) {
      setError("El valor no puede tener más de 20 caracteres.");
      return;
    }

    setHoras(value);
  };

  const handleChangeLotes = (e) => {
    setProduccion({
      id: produccion.id,
      cantidad: produccion.cantidad,
      codigo_orden: codigoOrden,
      orden_produccion_id: ordenProduccion?.id,
      codigo_produccion: produccion.codigo_produccion,
      producto_id: produccion.producto_id,
      producto: produccion.producto,
      costo_total: produccion.costo_total,
      estado_produccion: "1",
      produccion_ingredientes: produccion.produccion_ingredientes,
      produccion_maquinas: produccion.produccion_maquinas,
      produccion_responsables: produccion.produccion_responsables,
      lotes: e,
    });
  };

  function comprobarLote() {
    if (selectedLotes) {
      let _suma = 0;
      selectedLotes
        .filter(
          (lote) =>
            lote.materia_prima_id == produccionIngredientes.materia_prima_id
        )
        .map((filterLote) => {
          _suma = _suma + filterLote.stock * 1;
        });
      setSuma(_suma);
      return _suma;
    }
  }

  function calculateMateriaPrimaCosto() {
    if (selectedLotes) {
      let valorMateriaPrima = 0;
      selectedLotes.map((_lote) => {
        let mp = produccion.produccion_ingredientes.find(
          (element) => element.materia_prima_id === _lote.materia_prima_id
        );
        valorMateriaPrima =
          valorMateriaPrima +
          (_lote.costo_materia_prima * mp.cantidad) / _lote.cantidad;
      });
      setTotalMateriaPrima(valorMateriaPrima);
      setCantidadTotal(
        (totalMaquina + valorMateriaPrima + totalTrabajador).toFixed(2)
      );
      setProduccion({
        id: produccion.id,
        cantidad: produccion.cantidad,
        codigo_orden: codigoOrden,
        orden_produccion_id: ordenProduccion?.id,
        codigo_produccion: produccion.codigo_produccion,
        producto_id: produccion.producto_id,
        producto: produccion.producto,
        costo_total: (
          totalMaquina +
          valorMateriaPrima +
          totalTrabajador
        ).toFixed(2),
        estado_produccion: produccion.estado_produccion,
        produccion_ingredientes: produccion.produccion_ingredientes,
        produccion_maquinas: produccion.produccion_maquinas,
        produccion_responsables: produccion.produccion_responsables,
        lotes: produccion.lotes,
      });
    }
  }

  function calculateTrabajadorCosto() {
    let valortrabajador = 0;
    produccion.produccion_responsables.map((trabajador) => {
      valortrabajador =
        valortrabajador +
        (trabajador.trabajador.sueldo * trabajador.horas_empleadas) /
          trabajador.trabajador.horas_mes;
    });
    setTotalTrabajador(valortrabajador);
    setCantidadTotal(
      (totalMaquina + valortrabajador + totalMateriaPrima).toFixed(2)
    );
    setProduccion({
      id: produccion.id,
      cantidad: produccion.cantidad,
      codigo_orden: codigoOrden,
      orden_produccion_id: ordenProduccion?.id,
      codigo_produccion: produccion.codigo_produccion,
      producto_id: produccion.producto_id,
      producto: produccion.producto,
      costo_total: (totalMaquina + valortrabajador + totalMateriaPrima).toFixed(
        2
      ),
      estado_produccion: produccion.estado_produccion,
      produccion_ingredientes: produccion.produccion_ingredientes,
      produccion_maquinas: produccion.produccion_maquinas,
      produccion_responsables: produccion.produccion_responsables,
      lotes: produccion.lotes,
    });
  }
  const handleSubmitCalcular = () => {
    if (produccion.producto_id === null) {
      showToast(
        "error",
        "Error  crear Producto",
        `Debe seleccionar un Producto`
      );
    } else if (produccion.codigo_orden === null) {
      showToast(
        "error",
        "Error al crear Producto",
        `Ingrese un codigo de orden.`
      );
    } else if (produccion.cantidad <= 0) {
      showToast(
        "error",
        "Error al crear Producto",
        `La cantidad debe ser mayor a 0`
      );
    } else if (produccion.codigo_produccion.length === 0) {
      showToast(
        "error",
        "Error al crear Producto",
        `Ingrese un codigo de producción`
      );
    } else {
      setProducciones(producto.id);
      setSelectedLotes(null);
    }
  };

  const confirmAgregarLote = (produccion_) => {
    setProduccionIngredientes(produccion_);
    getAllLotes(produccion_.materia_prima_id);
    setVisibleLotes(true);
    setSelectedLotes(produccion.lotes);
    console.log("data", produccion.lotes);
  };

  const confirmVerServicios = (maquina_) => {
    getAllMaquinaServicios(maquina_.maquina_id);
    setVisibleServicios(true);
  };
  const hideDialog = () => {
    setSuma(0);
    setVisibleLotes(false);
  };
  const hideServicios = () => {
    setVisibleServicios(false);
  };
  const deleteSelectedLotes = () => {
    let _lotes = lotes.filter((val) => !selectedLotes.includes(val));

    setSelectedLotes(null);
  };

  const LoteDialogFooterUpdate = (
    <React.Fragment>
      <Button
        label="Guardar"
        icon="pi pi-save"
        className="p-button-success"
        onClick={() => {
          hideDialog();
          calculateMateriaPrimaCosto();
          if (suma >= produccionIngredientes.cantidad * 1) {
            produccionIngredientes.estado = 1;
            handleChangeLotes(selectedLotes);
            showToast(
              "success",
              "Asignación correcta",
              "Se agrego correctamente la cantidad"
            );
          } else {
            produccionIngredientes.estado = 0;
            handleChangeLotes(selectedLotes);
            showToast(
              "error",
              "Error selección",
              "Falta agregar lotes para la materia prima"
            );
          }
        }}
      />
    </React.Fragment>
  );

  const ServicioDialogFooterUpdate = (
    <React.Fragment>
      <Button
        label="Cerrar"
        icon="pi pi-times"
        className="p-button-danger"
        onClick={() => {
          hideServicios();
        }}
      />
    </React.Fragment>
  );

  const handleAddResponsable = (responsable_produccion) => {
    if (responsable === null) {
      showToast(
        "error",
        "Error al agregar Responsable",
        `Debe seleccionar un Trabajador`
      );
    } else if (horas <= 0) {
      showToast(
        "error",
        "Error al agregar Responsable",
        `Las horas del trabajador deben ser mayor a 0`
      );
    } else {
      const newResponsable = {
        produccion_id: 0,
        trabajador_id: responsable.id,
        trabajador: responsable,
        horas_empleadas: horas,
      };
      let existe = false;
      const newResponsables = produccionResponsable.map((trabajador) => {
        if (existe === false) {
          if (trabajador.trabajador_id === responsable_produccion.id) {
            existe = true;
            return {
              ...trabajador,
              horas_empleadas: horas,
            };
          }
        }
        return trabajador;
      });
      if (!existe) {
        setProduccionResponsable([...produccionResponsable, newResponsable]);
      } else {
        setProduccionResponsable(newResponsables);
      }
      setResponsable(null);
      setHoras(0);
    }
  }

  const [Desabilitar, setDesabilitar] = useState(false)

  const handleSubmitCreate = () => {
    const alterProduccion = produccion;
    alterProduccion.produccion_responsables = produccionResponsable;
    let todo_asignado = false;
    alterProduccion.produccion_ingredientes.map((ingredientes_) => {
      if (ingredientes_.estado == 0) {
        todo_asignado = true;
      }
    });
    if (alterProduccion.cantidad <= 0) {
      showToast(
        "error",
        "Error al crear Producto",
        `La cantidad debe ser mayor a 0`
      );
    }
    if (todo_asignado) {
      showToast(
        "error",
        "Producción no creada",
        `Falta seleccionar Lotes en la Producción`
      );
    } else if (ordenProduccion === null) {
      showToast(
        "error",
        "Producción no creada",
        `Falta seleccionar tipo de producción`
      );
    } else if (codigoOrden == "") {
      showToast(
        "error",
        "Producción no creada",
        `Falta ingresar código de orden`
      );
    } else if (alterProduccion.produccion_ingredientes.length == 0) {
      showToast(
        "error",
        "Producción no creada",
        `Falta seleccionar ingredientes en la Producción`
      );
    } else if (!selectedLotes || selectedLotes.length == 0) {
      showToast(
        "error",
        "Producción no creada",
        `Falta seleccionar lotes en la Producción`
      );
    } else if (alterProduccion.produccion_responsables.length == 0) {
      showToast(
        "error",
        "Producción no creada",
        `Falta seleccionar responsables en la Producción`
      );
    } else {
      setDesabilitar(false)
      http.post("/producciones/create", alterProduccion)

        .then((response) => {
          showToast(
            "success",
            "Producto Creado",
            `Se creo la Producción ${alterProduccion.codigo_produccion} correctamente`
          );
          navigate("/getProducciones");
        })
        .catch((error) => {
          console.log(error);
          showToast(
            "error",
            "Producto No Creado",
            `No se creo la Producción ${alterProduccion.codigo_produccion}`
          );
        })
        .finally(()=>{
          setTimeout(() => {
            setDesabilitar(false);
          }, 5000);
        })
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

  const isRowSelectable = (event) => {
    const data = event.data;
    return isSelectable(data.id, "id");
  };

  const isSelectable = (value, field) => {
    let isSelectable = true;
    if (selectedLotes) {
      if (suma >= produccionIngredientes.cantidad * 1) {
        isSelectable = false;
        selectedLotes.map((lote) => {
          if (isSelectable == false) {
            if (lote.id == value) {
              isSelectable = true;
              return isSelectable;
            } else {
              isSelectable = false;
            }
          } else {
            return isSelectable;
          }
        });
      }
    }
    return isSelectable;
  };

  const actionBodyTemplateDeleteResponsable = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => confirmDeleteResponsable(rowData)}
        />
      </React.Fragment>
    );
  };

  const confirmDeleteResponsable = (_responsable) => {
    setResponsable(_responsable);
    setVisibleDeleteResponsable(true);
  };
  const deleteResponsable = (_responsable) => {
    const newResponsable = produccionResponsable.filter(
      (trabajador) => trabajador.trabajador_id !== _responsable.trabajador_id
    );
    setProduccionResponsable(newResponsable);
  };
  const acceptDeleteResponsable = () => {
    deleteResponsable(responsable);
  };
  const rejectDeleteResponsable = () => {
    toast.current.show({
      severity: "info",
      summary: "Rechazada",
      detail: "No se realizo ninguna acción",
      life: 3000,
    });
  };
  const TemplateValuePresentacion = (options, value) => {};

  return (
    <>
      <Toast ref={toast} />
      <div className="section-crear-produccion">
        <div className="title-crear-produccion">
          <h1>Creación de nueva Producción</h1>
        </div>
        <div className="xl:flex xl:gap-2 w-full ">
          <div className="field section-input flex-1">
            <label htmlFor="cantidad_materia">Orden de producción</label>
            <InputText
              style={{ width: "100%" }}
              id="cantidad_materia"
              value={codigoOrden}
              onChange={(e) => setCodigoOrden(e.target.value)}
              required
              disabled={loading}
              autoComplete="off"
              placeholder="Código de orden"
            />
          </div>
          <div className="field section-input  flex-1">
            <label htmlFor="materia_prima">Tipo de producción</label>
            <Dropdown
              id="materia_prima"
              value={ordenProduccion}
              options={ordenes}
              onChange={(e) => setOrdenProduccion(e.value)}
              optionLabel="nombre"
              placeholder="Seleccione orden de producción"
              disabled={loading}
              autoFocus
              filter
              style={{ width: "100%" }}
            />
          </div>
          <div className="field section-input  flex-1">
            <label htmlFor="materia_prima">Seleccionar Producto*</label>
            <Dropdown
              id="materia_prima"
              value={producto}
              disabled={loading}
              options={productos}
              onChange={(e) => {
                handleChangeProducto(e);
              }}
              optionLabel="nombre"
              placeholder="Seleccione un Producto"
              autoFocus
              filter
              style={{ width: "100%" }}
            />
          </div>
          <div className="field section-input flex-1">
            <label htmlFor="cantidad">Cantidad*</label>
            <div className="field field-input-quantity-product">
              <InputText
                style={{ width: "100%", paddingRight: "15px", height: "47px" }}
                id="cantidad"
                value={produccion.cantidad}
                disabled={loading}
                onChange={(e) => handleChangeCantidad(e)}
                required
                keyfilter="num"
                autoComplete="off"
                placeholder="Ingrese la cantidad de Producción."
                className="bg-success input-quantity"
              />

              <span
                className="p-inputgroup-addon flex justify-content-center relative bottom-0 align-items-center "
                style={{
                  height: "47px",
                  padding: "0px 25px",
                  marginLeft: "-2px",
                }}
              >
                {/* {} */}
                <TextTrimmer
                  className="text-bold-500 align-items-center "
                  text={producto?.presentacion?.nombre}
                  maxLength={10}
                />
              </span>
            </div>
          </div>
          <div className="field section-input flex-1">
            <label htmlFor="cantidad_materia">Código de Producción*</label>
            <InputText
              style={{ width: "100%" }}
              disabled={loading}
              id="cantidad_materia"
              value={produccion.codigo_produccion}
              onChange={(e) => handleChangeCodigoProduccion(e)}
              required
              autoComplete="off"
              placeholder="Ingrese el código de producción"
            />
          </div>
        </div>

        <div className="section-button-add-ingrediente">
          <Button
            type="button"
            icon="pi pi-plus"
            label="Calcular"
            disabled={loading}
            onClick={() => {
              handleSubmitCalcular();
            }}
          />
        </div>

        <div className="title-crear-produccion">
          <h3>Requerimientos</h3>
        </div>

        <div className="section-table-information">
          <TableProduccion
            data={produccion.produccion_ingredientes}
            header="Materia Prima"
          >
            <Column field={"nombre_materia_prima"} header="Nombre"></Column>
            <Column
              header="Lote"
              body={actionBodyTemplateLote}
              exportable={false}
              style={{ minWidth: "8rem" }}
            ></Column>
            <Column field={"cantidad"} header="Cantidad"></Column>
            <Column field={"unidad_medida"} header="Unidad"></Column>
          </TableProduccion>
        </div>

        <div className="section-table-information">
          <TableProduccion
            data={produccion.produccion_maquinas}
            header="Máquinas"
          >
            <Column field={"nombre"} header="Nombre"></Column>
            <Column field={"totalBatch"} header="Batch"></Column>
            <Column field={"total_horas"} header="Horas"></Column>
            <Column
              header="Servicio"
              body={actionBodyTemplateServicio}
              exportable={false}
              style={{ minWidth: "8rem" }}
            ></Column>
            {/*<Column field={'electricidad'} header='Electricidad(kW/h)'></Column>
            <Column field={'gas'} header='Gas(m3/h)'></Column>*/}
          </TableProduccion>
        </div>

        <div>
          <label htmlFor="materia_prima">Costo Total </label>
          <InputText
            style={{ width: "25%" }}
            id="cantidad"
            value={cantidadTotal}
            onChange={(e) => handleChangeCantidad(e)}
            required
            step="0.01"
            presicion={2}
            keyfilter="num"
            autoComplete="off"
            disabled
            placeholder="Ingrese la cantidad de Producción."
          />
        </div>

        <div className="section-table-information">
          <div className="title-crear-produccion">
            <h3>Responsables</h3>
          </div>
          <div
            className="field section-input"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <label htmlFor="materia_prima">Seleccionar Trabajador* </label>
            <Dropdown
              id="materia_prima"
              value={responsable}
              options={responsables}
              onChange={(e) => {
                handleChangeResponsable(e);
              }}
              optionLabel="nombres"
              itemTemplate={optionTemplate}
              valueTemplate={valueTemplate}
              placeholder="Seleccion Responsable"
              filter
              filterBy="nombres,apellidos"
              style={{ width: "50%" }}
            />
          </div>
          <div
            className="field section-input"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <label htmlFor="horas_trabajador">Horas de Trabajador </label>
            <InputText
              style={{ width: "50%" }}
              id="horas_trabajador"
              value={horas}
              onChange={(e) => handleChangeHora(e)}
              required
              keyfilter="num"
              autoComplete="off"
              placeholder="Ingrese holas del trabajador..."
            />
          </div>
          <div className="section-button-add-ingrediente">
            <Button
              type="button"
              icon="pi pi-plus"
              label="Agregar"
              onClick={(e) => {
                handleAddResponsable(responsable);
              }}
            />
          </div>
          <TableProduccion data={produccionResponsable} header="Trabajadores">
            <Column field={"trabajador.nombres"} header="Nombres"></Column>
            <Column field={"trabajador.apellidos"} header="Apellidos"></Column>
            <Column
              field={"trabajador.tipo_trabajador.nombre"}
              header="Tipo de Trabajador"
            ></Column>
            <Column field={"horas_empleadas"} header="Horas"></Column>
            <Column
              body={actionBodyTemplateDeleteResponsable}
              header="Eliminar"
              exportable={false}
              style={{ minWidth: "8rem" }}
            ></Column>
          </TableProduccion>
        </div>

        <div className="section-button-submits">
          <Button
            type="button"
            icon="pi pi-save"
            className="p-button-success"
            label="Crear"
            style={{ marginRight: "20px" }}
            onClick={(e) => {
              handleSubmitCreate();
            }}
            disabled={Desabilitar}
          />
          <Button
            type="button"
            icon="pi pi-arrow-left"
            className="p-button-danger"
            label="Retornar"
            onClick={(e) => {
              navigate("/getProducciones");
            }}
          />
        </div>
      </div>

      <Dialog
        visible={visibleLotes}
        style={{ width: "80vw" }}
        header={
          <>
            <i className="pi pi-briefcase icon-create-produccion"></i> Lotes
          </>
        }
        modal
        className="p-fluid"
        footer={LoteDialogFooterUpdate}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="observaciones">Detalles</label>
          <TableProduccion
            data={produccionIngredientes.lotes}
            selection={selectedLotes}
            isRowSelectable={isRowSelectable}
            selectionMode="multiple"
            onSelectionChange={(e) => {
              setSelectedLotes(e.value);
            }}
          >
            <Column field={"lote_interno"} header="Lote"></Column>
            <Column
              field={"fecha_vencimiento"}
              header="Fecha de Vencimiento"
            ></Column>
            <Column field={"stock"} header="Stock"></Column>
            <Column field={"nombre"} header="Unidad"></Column>
          </TableProduccion>
        </div>
      </Dialog>

      <Dialog
        visible={visibleServicios}
        style={{ width: "80vw" }}
        header={
          <>
            <i className="pi pi-briefcase icon-create-produccion"></i> Servicios
          </>
        }
        modal
        className="p-fluid"
        footer={ServicioDialogFooterUpdate}
        onHide={hideServicios}
      >
        <div className="field">
          <label htmlFor="observaciones">Detalles</label>
          <TableProduccion data={servicios}>
            <Column field={"servicio.nombre"} header="Nombre"></Column>
            <Column field={"consumo"} header="Consumo"></Column>
          </TableProduccion>
        </div>
      </Dialog>
      <ConfirmDialog
        visible={visibleDeleteResponsable}
        onHide={() => {
          setVisibleDeleteResponsable(false);
          //cleanProducto();
        }}
        message={`Esta seguro de eliminar `}
        header="Confirmación"
        icon="pi pi-exclamation-triangle"
        acceptLabel="Sí"
        accept={acceptDeleteResponsable}
        reject={rejectDeleteResponsable}
      />
    </>
  );
};

export default CreateProduccion;
