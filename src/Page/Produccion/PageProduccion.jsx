import React, { useEffect, useState, useRef } from "react";
import { Column } from "primereact/column";
import ListProduccion from "../../Components/Produccion/ListProduccion";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Outlet, useNavigate } from "react-router-dom";
import AuthUser from '../../AuthUser';
import Container from "../../Components/Container/Container";
import { InputText } from "primereact/inputtext";
import "./PageProduccion.css"
import { logout } from "../../reducers/authSlices";
import { useDispatch } from "react-redux";

export default function PageProduccion() {
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  const { httppdf, http, getToken, deleteToken } = AuthUser();
  const [my, setMy] = useState(null);
  const toast = useRef(null);
  const [producciones, setProducciones] = useState([]);
  const [observacion, setObservacion] = useState([]);
  const [produccion, setProduccion] = useState({
    id: 0,
    codigo_produccion: "",
    costo_total: "",
    estado_produccion: "",
    fecha_produccion: "",
    observaciones: "",
    produccion_ingrediente: null,
    produccion_maquina: null,
    produccion_responsable: null,
    producto: null,
    producto_id: null,
  });
  const [visibleIniciar, setVisibleIniciar] = useState(false);
  const [visibleObervacion, setVisibleObservacion] = useState(false);
  const [visibleAlmacen, setVisibleAlmacen] = useState(false);
  const [estado_merma, setEstado_merma] = useState(null);
  const [cantidad_merma, setCantidad_merma] = useState(0);
  const dispatch = useDispatch()

  const [visibleDelete, setVisibleDelete] = useState(false);
  const [select, setSelect] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [presentaciones, setPresentaciones] = useState(null);

  const getAllProducciones = () => {
    http.get("/producciones/get")
      .then((response) => {
        setProducciones(response.data.data);
        console.log(producciones);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //para traer presentaciones
  const getAllPresentaciones = () => {
    http.get("/presentaciones/get")
      .then((response) => {
        setPresentaciones(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getAllProducciones();
    getAllPresentaciones();
    handleMy();
  }, []);

  useEffect(() => {
    handleMy();
  }, []);

  useEffect(() => {
    setProduccion({
      "id": produccion.id,
      "cantidad": produccion.cantidad,
      "codigo_produccion": produccion.codigo_produccion,
      "producto_id": produccion.producto_id,
      "costo_total": produccion.costo_total,
      "estado_produccion": produccion.estado_produccion,
      "estado_consumo": produccion.estado_consumo,
      "fecha_produccion": produccion.fecha_produccion,
      "fecha_vencimiento": produccion.fecha_vencimiento,
      "observaciones": produccion.observaciones,
      "estado_calidad": produccion.estado_calidad,
      "cantidad_merma": cantidad_merma,
      "producto": produccion.producto,
      "produccion_ingrediente": produccion.produccion_ingrediente,
      "produccion_responsable": produccion.produccion_responsable,
      "produccion_maquina": produccion.produccion_responsable
    })
  }, [cantidad_merma])

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
  //necesario para el crud
  const mostrarPresentacion = (data) => {
    return (
      <>
        {presentaciones?.map(item => {
          if (item.id == data.producto.presentacion_id) {
            return (
              <p>{item.nombre}</p>
            )
          }
        })}
      </>
    )
  }

  const actionBodyTemplateIniciarProduccion = (rowData) => {
    return (
      <React.Fragment>
        {rowData.estado_produccion === "0" ? (
          <Button
            icon="pi pi-check-circle"
            tooltip="Habilitar para Producción"
            className="p-button-rounded p-button-warning "
            onClick={() => btnHabilitarProduccion(rowData)}
          />
        ) : rowData.estado_produccion === "1" ? (
          <Button
            icon="pi pi-play"
            tooltip="Iniciar producción"
            className="p-button-rounded p-button-warning "
            onClick={() => btnIniciarProduccion(rowData)}
          />
        ) : rowData.estado_produccion === "2" ?
          (
            <Button
              icon="pi pi-cog"
              tooltip="Finalizar Producción"
              className="p-button-rounded p-button-warning "
              onClick={() => btnDetenerProduccion(rowData)}
            />
          )
          : rowData.estado_produccion === "3" && rowData.estado_calidad === "0" ?
            (
              <Button
                icon="pi pi-check-circle"
                disabled
                className="p-button-rounded p-button-warning "
              />
            )
            : rowData.estado_produccion === "3" && rowData.estado_calidad === "1" ?
              (
                <Button
                  icon="pi pi-forward"
                  tooltip="Enviar almacén"
                  className="p-button-rounded p-button-success "
                  onClick={() => btnAlmacen(rowData)}
                />
              )
              : rowData.estado_produccion === "4" && rowData.estado_calidad === "1" ?
                (
                  <Button
                    icon="pi pi-home"
                    className="p-button-rounded p-button-success "
                    disabled
                  />
                )
                : rowData.estado_produccion === "5" && rowData.estado_calidad === "2" ?
                  (
                    <Button
                      icon="pi pi-refresh"
                      disabled
                      className="p-button-rounded p-button-secondary "
                    />
                  )
                  :
                  (
                    <Button
                      icon="pi pi-ban"
                      disabled
                      className="p-button-rounded p-button-danger "
                    />
                  )
        }
      </React.Fragment>
    );
  };

  //Estados de la producción
  const estadoProduccion = (data) => {
    const est = data?.estado_produccion;
    return (
      <>
        {est === "0" ?
          (<p>Programado</p>)
          : est === "1" ?
            (<p>Listo para Producción</p>)
            : est === "2" ?
              (<p>En producción</p>)
              : est === "3" && data.estado_calidad === "0" ?
                (<p>Producción Finalizada</p>)
                : est === "3" && data.estado_calidad === "1" ?
                  (<p>Listo para almacén</p>)
                  : est === "4" && data.estado_calidad === "1" ?
                    (<p>Almacenado</p>)
                    : est === "5" && data.estado_calidad === "2" ?
                      (<p>En reprocesamiento</p>)
                      :
                      (<p>Descartado</p>)
        }
      </>
    )
  }

  const actionBodyTemplateObservaciones = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-comment"
          className="p-button-rounded p-button-warning "
          onClick={() => btnObservacion(rowData)}
        />
      </React.Fragment>
    );
  };

  const env = import.meta.env.VITE_APP_API_URL;
  const exportPdf = async (datos, rutaPdf) => {
    try {
      console.log(datos)
      const url = `${env}/${rutaPdf}/${datos.id}`;
      setPdfUrl(url);
      setVisible(true);
    } catch (error) {
      console.log(error);
    }
  };

  const actionBodyTemplateDescargar = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-file-pdf"
          className="p-button-outlined p-button-rounded p-button-primary"
          onClick={() => exportPdf(rowData, "producciones/imprimirpdf")}
        />
      </React.Fragment>
    );
  };
  //aprobación de calidad pdf
  const actionPDFAprobaciónCalidad = (rowData) => {
    const estado = parseInt(rowData.estado_produccion);
    const calidad = parseInt(rowData.estado_calidad);
    return (
      <>{
        estado <= 3 && calidad == 0 ? (
          <Button
            icon="pi pi-file-pdf"
            className="p-button-outlined p-button-rounded p-button-primary"
            // onClick={() => exportPdf(rowData, "produccion/pdf")}
            disabled
          />
        )
          : (
            <Button
              icon="pi pi-file-pdf"
              className="p-button-outlined p-button-rounded p-button-primary"
              onClick={() => exportPdf(rowData, "produccion/pdf")}
            />
          )
      }

      </>
    );
  };


  const actionBodyTemplateEdit = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-danger "
          onClick={() => confirmDeleteTrabajador(rowData)}
        />
      </React.Fragment>
    );
  };


  const actionBodyTemplateDelete = (rowData) => {
    return (
      <React.Fragment>
        {rowData.estado_produccion == "2" || rowData.estado_produccion == "3" ?
          (<Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger "
            disabled
          />) :
          (<Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger " l
            onClick={() => confirmDeleteTrabajador(rowData)}
          />)
        }
      </React.Fragment>
    );
  };

  const btnHabilitarProduccion = (produccion_) => {
    setProduccion({
      id: produccion_.id,
      codigo_produccion: produccion_.codigo_produccion,
      costo_total: produccion_.costo_total,
      estado_produccion: "1",
      fecha_produccion: produccion_.fecha_produccion,
      observaciones: produccion_.observaciones,
      produccion_ingrediente: produccion_.produccion_ingrediente,
      produccion_maquina: produccion_.produccion_maquina,
      produccion_responsable: produccion_.produccion_responsable,
      producto: produccion_.producto,
      producto_id: produccion_.producto_id,
    });
    setVisibleIniciar(true);
  };
  const btnIniciarProduccion = (produccion_) => {
    setProduccion({
      id: produccion_.id,
      codigo_produccion: produccion_.codigo_produccion,
      costo_total: produccion_.costo_total,
      estado_produccion: "2",
      fecha_produccion: produccion_.fecha_produccion,
      observaciones: produccion_.observaciones,
      produccion_ingrediente: produccion_.produccion_ingrediente,
      produccion_maquina: produccion_.produccion_maquina,
      produccion_responsable: produccion_.produccion_responsable,
      producto: produccion_.producto,
      producto_id: produccion_.producto_id,
    });
    setVisibleIniciar(true);
  };
  const btnDetenerProduccion = (produccion_) => {
    setProduccion({
      id: produccion_.id,
      codigo_produccion: produccion_.codigo_produccion,
      costo_total: produccion_.costo_total,
      estado_produccion: "3",
      fecha_produccion: produccion_.fecha_produccion,
      observaciones: produccion_.observaciones,
      produccion_ingrediente: produccion_.produccion_ingrediente,
      produccion_maquina: produccion_.produccion_maquina,
      produccion_responsable: produccion_.produccion_responsable,
      producto: produccion_.producto,
      producto_id: produccion_.producto_id,
    });
    setVisibleIniciar(true);
  };

  const handleChangeMerma = (e) => {
    let value = e.target.value;

    value = value.replace(/[^0-9.]/g, '');

    const decimalPoints = (value.match(/\./g) || []).length;
    if (decimalPoints > 1) {
      console.log('Solo se permite un punto decimal.');
      return;
    }

    const [integerPart, decimalPart] = value.split('.');

    if (integerPart && integerPart.length > 18) {
      console.log('La parte entera no puede tener más de 18 dígitos.');
      return;
    }

    if (decimalPart && decimalPart.length > 2) {
      console.log('Solo se permiten hasta dos decimales.');
      return;
    }

    if (parseFloat(value) > produccion.cantidad) {
      console.log('El valor no puede ser mayor que la cantidad de producción.');
      return;
    }

    if (value.length > 20) {
      console.log('El valor no puede tener más de 20 caracteres.');
      return;
    }

    setCantidad_merma(value);
  };

  const btnAlmacen = (produccion_) => {
    setProduccion({
      "id": produccion_.id,
      "cantidad": produccion_.cantidad,
      "codigo_produccion": produccion_.codigo_produccion,
      "producto_id": produccion_.producto_id,
      "costo_total": produccion_.costo_total,
      "estado_produccion": produccion_.estado_produccion,
      "estado_consumo": produccion_.estado_consumo,
      "fecha_produccion": produccion_.fecha_produccion,
      "fecha_vencimiento": produccion_.fecha_vencimiento,
      "observaciones": produccion_.observaciones,
      "estado_calidad": produccion_.estado_calidad,
      "cantidad_merma": "0",
      "producto": produccion_.producto,
      "produccion_ingrediente": produccion_.produccion_ingrediente,
      "produccion_responsable": produccion_.produccion_responsable,
      "produccion_maquina": produccion_.produccion_responsable
    })

    setVisibleAlmacen(true);
  };

  const btnObservacion = (produccion_) => {
    setProduccion(produccion_);
    setVisibleObservacion(true);
  };



  const confirmDeleteTrabajador = (produccion_) => {
    setProduccion(produccion_);
    setVisibleDelete(true);
  };

  //para el modal de crear
  const hideDialog = () => {
    //setSubmitted(false);
    cleanTrabajador();
    setVisibleIniciar(false);
    setVisibleObservacion(false);
  };
  const hideDialogEdit = () => {
    //setSubmitted(false);
    cleanTrabajador();
    setVisibleObservacion(false);
  };

  const ObservacionDialogFooterUpdate = (
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
          if (observacion === null) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe ingresar una observación"
            );
          } else {
            console.log(observacion);
            handleSetObservacion();
            hideDialogEdit();
          }
        }}
      />
    </React.Fragment>
  );

  const [contador, setContador] = useState();
  const handleChangeObservacion = (e) => {
    let value = e.target.value;

    if (value.length > 255) {
      return;
    }

    const maxLength = 255;
    const remainingCharacters = maxLength - value.length;

    if (remainingCharacters < 0) {
      return;
    }
    setContador(remainingCharacters);
    setObservacion(e.target.value);
    setProduccion({
      id: produccion.id,
      codigo_produccion: produccion.codigo_produccion,
      costo_total: produccion.costo_total,
      estado_produccion: produccion.estado_produccion,
      fecha_produccion: produccion.fecha_produccion,
      observaciones: e.target.value,
      produccion_ingrediente: produccion.produccion_ingrediente,
      produccion_maquina: produccion.produccion_maquina,
      produccion_responsable: produccion.produccion_responsable,
      producto: produccion.producto,
      producto_id: produccion.producto_id,
    });
  };

  const cleanTrabajador = () => {
    setProduccion({
      id: 0,
      tipo_documento: "",
      tipo_documento_id: "",
      numero_documento: "",
      nombres: "",
      apellidos: "",
      tipo_trabajador: null,
      tipo_trabajador_id: null,
      sueldo: "",
    });
  };

  //función que actualiza los estados
  const actualizarEstados = () => {
    console.log(produccion.estado_produccion);
    handleInicioProduccion();
    setVisibleIniciar(false);
  }
  const acceptDelete = () => {
    handleSubmitDelete();
  };

  const hideDialogAlmacen = () => {
    setVisibleAlmacen(false);
    setEstado_merma(null);
    setCantidad_merma(null)
  }

  const reject = () => {
    toast.current.show({
      severity: "info",
      summary: "Rechazada",
      detail: "No se realizo ninguna acción",
      life: 3000,
    });
    setVisibleIniciar(false);
    setVisibleDelete(false);
  };

  const handleInicioProduccion = () => {
    http.put(`/producciones/changeestadoproduccion/${produccion.id}`, produccion)
      .then((response) => {
        showToast(
          "success",
          "Produccion iniciada",
          `Se inicio la producción ${produccion.codigo_produccion}`
        );

        getAllProducciones();
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "error",
          "Produccion no iniciada",
          `No se inició correctamente la producción ${produccion.codigo_produccion}`
        );
      });
  };

  const handleSubmitAlmacen = () => {
    http.post(`/almacenes/create/${produccion.id}`)
      .then((response) => {
        console.log(response.data);
        showToast(
          "success",
          "Produccion Almacenada Correctamente",
          `${response.data.resp}  ${produccion.codigo_produccion}`
        );
        getAllProducciones();
        setVisibleAlmacen(false);
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "error",
          "Trabajador No Eliminado",
          `No Se creo al trabajador ${produccion.codigo_produccion}`
        );
      });
  };

  const handleSubmitDelete = () => {
    http.delete(`/producciones/delete/${produccion.id}`)
      .then((response) => {
        showToast(
          "success",
          "Produccion Eliminada",
          `Se elimino correctamente la produccion ${produccion.codigo_produccion}`
        );
        getAllProducciones();
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "error",
          "Trabajador No Eliminado",
          `No Se creo al trabajador ${produccion.codigo_produccion}`
        );
      });
  };

  const handleSetObservacion = () => {
    http.put(`/producciones/setobservacion/${produccion.id}`, produccion)
      .then((response) => {
        showToast(
          "success",
          "Observación guardada ",
          `Se guardo la observación correctamente`
        );
        getAllProducciones();
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "error",
          "Observación no guardada",
          `No se pudo guardar la observacion de ${produccion.codigo_produccion}`
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
      return '---';
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

  const veri = () => {
    console.log(produccion);
  }

  return (
    <>
      <Container url="getProducciones">
        <Toast ref={toast} />
        <div className="p-container-header">
          <div className="p-container-titulo">
            <h1 style={{ color: '#04638A' }} className="container-titulo-table">Lista de Producción</h1>
            {/* <button onClick={veri} >Verificar</button> */}
          </div>
          <div className="container-descripcion">
            <div className="container-descripcion-table">
              <p>
                A continuación, se visualiza la lista de producciones
                registrados en el sistema
              </p>
            </div>
            <div className="container-descripcion-button-add">
              <button
                onClick={() => {
                  navigate("createProduccion");
                }}
                className="button button-crear"
              >
                Crear Producción <i className="pi pi-plus mr-2"></i>
              </button>
            </div>
          </div>
        </div>
        <ListProduccion
          onInputSearch={(e) => setGlobalFilter(e.target.value)}
          valueGlobalFilter={globalFilter}
          data={producciones}
          selection={select}
          onSelectionChange={(e) => {
            setSelect(e.value);
            console.log(e.value);
          }}
          onClickRefresh={getAllProducciones}
        >
          <Column
            field="codigo_produccion"
            header="Item"
            className="column column-item"
            body={(rowData) => formatValue(rowData.codigo_produccion)}
          ></Column>
          <Column
            field={"producto.nombre"}
            header="Producto"
            className="column column-name"
            body={(rowData) => formatValue(rowData.producto.nombre)}
          ></Column>
          <Column
            field={"fecha_produccion"}
            header="Fecha de Producción"
            className="column column-date"
            body={(rowData) => formatValue(rowData.fecha_produccion)}
          ></Column>
          <Column
            field="cantidad"
            header="Cantidad"
            className="column column-quantity"
            body={(rowData) => formatValue(rowData.cantidad)}
          ></Column>
          <Column
            body={(e) => mostrarPresentacion(e)}
            header="Presentación"
            className="column column-quantity"
          ></Column>
          <Column
            className="column column-state"
            header="Acciones"
            body={actionBodyTemplateIniciarProduccion}
            exportable={false}
            style={{ maxWidth: "auto" }}
          ></Column>
          <Column
            className="column column-state"
            header="Estado"
            body={(e) => estadoProduccion(e)}
            exportable={false}
            style={{ maxWidth: "auto" }}
          ></Column>
          <Column
            header="Observaciones"
            body={actionBodyTemplateObservaciones}
            exportable={false}
            style={{ maxWidth: "auto" }}
            className="column column-observations"
          ></Column>
          <Column
            header="Costo Produccion"
            field="costo_total"
            exportable={false}
            style={{ maxWidth: "auto" }}
            className="column column-cost"
            body={(rowData) => formatCurrency(rowData.costo_total)}
          ></Column>

          <Column
            header="Trazabilidad"
            body={actionBodyTemplateDescargar}
            exportable={false}
            style={{ maxWidth: "auto" }}
            className="column column-traceability"
          ></Column>

          <Column
            header="Aprobación de calidad"
            body={actionPDFAprobaciónCalidad}
            exportable={false}
            style={{ maxWidth: "auto" }}
            className="column column-traceability"
          ></Column>
          <Column
            body={actionBodyTemplateDelete}
            header="Eliminar"
            exportable={false}
            style={{ maxWidth: "auto" }}
            className="column column-delete"
          ></Column>
        </ListProduccion>

        <Dialog
          header={`Confirmación ${produccion.estado_produccion}`}
          icon="pi pi-exclamation-triangle"
          visible={visibleIniciar}
          onHide={() => {
            setVisibleIniciar(false);
            cleanTrabajador();
          }}
          footer={<>
            <Button onClick={() => reject()} label="No" icon="pi pi-times" className="p-button-danger " />
            <Button onClick={() => actualizarEstados()} label="Si" icon="pi pi-check" />
          </>}
        >
          {
            produccion.estado_produccion == "1"
              ? `¿Esta seguro que desea habilitar para producción ${produccion.codigo_produccion}?`
              : produccion.estado_produccion == "2" ?
                `¿Esta seguro que desea iniciar producción ${produccion.codigo_produccion}?`
                : produccion.estado_produccion == "3" ?
                  `¿Esta seguro que desea finalizar producción ${produccion.codigo_produccion}?`
                  : produccion.estado_produccion == "4" ?
                    `¿Esta seguro que desea iniciar producción ${produccion.codigo_produccion}?`
                    : `Esta seguro que desea almacenar la producción ${produccion.codigo_produccion}`
          }
        </Dialog>

        <Dialog
          style={{ width: "auto" }}
          visible={visibleAlmacen}
          onHide={() => hideDialogAlmacen()}
          header={<div><h4 style={{ margin: "0" }}>Enviar Almacén</h4></div>}
          footer={<div>
            <Button
              style={{ background: "white", color: "blue" }}
              onClick={() => hideDialogAlmacen()}>Cancelar</Button>
            <Button onClick={() => { handleInicioProduccion(), hideDialogAlmacen() }}>Enviar</Button>
          </div>}
        >
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
            <p>¿La producción generó merma?</p>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <input type="radio" value={"1"} onChange={(e) => setEstado_merma(e.target.value)} checked={estado_merma == 1} />
              <label htmlFor="opcion">Si</label>
              <input type="radio" value={"0"} onChange={(e) => setEstado_merma(e.target.value)} checked={estado_merma == 0} />
              <label htmlFor="opcion">No</label>
            </div>
          </div>
          {
            estado_merma == 1 ?
              (
                <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                  <p>Cantidad de merma: </p>
                  <InputText
                    value={cantidad_merma}
                    onChange={(e) => handleChangeMerma(e)}
                    keyfilter='num'
                  >
                  </InputText>
                  {presentaciones?.map(item => {
                    if (item.id == produccion?.producto?.presentacion_id) {
                      return (
                        <strong style={{ display: "flex", alignItems: "center" }}>{item.nombre}</strong>
                      )
                    }
                  })}
                </div>
              )
              :
              (
                <p></p>
              )
          }

        </Dialog>


        <Dialog header="Lista de ingredientes" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
          <iframe src={pdfUrl} width="100%" height="700px" title="PDF Viewer"></iframe>
        </Dialog>

        <Dialog
          visible={visibleObervacion}
          style={{ width: "450px" }}
          header={
            <>
              <i className="pi pi-briefcase icon-create-produccion"></i>{" "}
              Observaciones
            </>
          }
          modal
          className="p-fluid"
          footer={ObservacionDialogFooterUpdate}
          onHide={hideDialog}
        >
          
          <div className="field" style={{ position: 'relative' }}>
            <label htmlFor="observaciones">Detalles</label>
            <p className="contador">{contador}</p>
            <InputTextarea
              id="observaciones"
              value={produccion.observaciones}
              onChange={(e) => handleChangeObservacion(e)}
              rows={4}
              autoResize
              required
              autoComplete="off"
            />
          </div>
        </Dialog>

        <Dialog
          header={`Confirmación`}
          icon="pi pi-exclamation-triangle"
          visible={visibleDelete}
          onHide={() => {
            setVisibleDelete(false);
            cleanTrabajador();
          }}
          footer={<>
            <Button onClick={() => reject()} label="No" icon="pi pi-times" className="p-button-danger " />
            <Button onClick={() => acceptDelete()} label="Si" icon="pi pi-check" />
          </>}
        >
          {`¿Esta seguro de eliminar la producción ${produccion.codigo_produccion}?`}
        </Dialog>


      </Container>
    </>
  );
}

