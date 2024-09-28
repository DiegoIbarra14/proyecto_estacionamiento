import React, { useEffect, useState, useRef } from "react";
import http from "../../http-common";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import TableIngredientes from "./TableIngredientes";
import ListServiciosMaquinas from "./ListServiciosMaquinas";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "./createProducto.css";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "primereact/confirmdialog";
import AuthUser from '../../AuthUser';
import { logout } from "../../reducers/authSlices";

const CreateProducto = () => {
  let navigate = useNavigate();
  const { http, getToken, deleteToken } = AuthUser();
  const [my, setMy] = useState(null);
  const toast = useRef(null);
  const [presentaciones, setPresentaciones] = useState([]);
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [cantidad, setCantidad] = useState(0);
  const [producto, setProducto] = useState({
    nombre: "",
    cantidad_base: 0,
    presentacion_id: null,
    tiempo_vida: 0,
    ingredientes: [],
    maquinas: [],
  });
  const [servicios, setServicios] = useState([]);
  const [visibleMaquinaServicios, setVisibleMaquinaServicios] = useState(false);
  const [maquinaServicios, setMaquinaServicios] = useState([]);
  const [selectMaquinaServicio, setSelectMaquinaServicio] = useState(null);
  const [globalFilterMaquinaServicio, setGlobalFilterMaquinaServicio] = useState(null);
  const [presentacion, setPresentacion] = useState(null);
  const [materiaPrima, setMateriaPrima] = useState(null);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleDeleteMaquina, setVisibleDeleteMaquina] = useState(false);
  const [maquinas, setMaquinas] = useState([]);
  const [maquina, setMaquina] = useState(null);
  const [hora, setHora] = useState(0);
  const [batch, setBatch] = useState(0);
  const [loadingProducto, setLoadingProducto] = useState(false);

  const getAllMateriasPrimas = () => {
    http.get("/materiasprimas/get")
      .then((response) => {
        setMateriasPrimas(response.data.data); 
        console.log(materiasPrimas);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllPresentaciones = () => {
    http.get("/presentaciones/get")
      .then((response) => {
        setPresentaciones(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllMaquinas = () => {
    http.get("/maquinas/get")
      .then((response) => {
        setMaquinas(response.data.data);
        // console.log(maquinas,'getAllMaquinas');
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  const getAllMaquinasServicios = (id) => {
    http.get(`/maquinasservicios/get/${id}`)
      .then((response) => {
        setMaquinaServicios(response.data.data);
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

  useEffect(() => {
    getAllMateriasPrimas();
    getAllMaquinas();
    getAllPresentaciones();
    getAllMaquinasServicios();
    getAllServicios();
  }, [setMateriasPrimas]);

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
      }
      console.log("promesa 2", response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const serviciosMaquina = (data) => {
    setMaquina(data?.maquina);
    setVisibleMaquinaServicios(true);
    getAllMaquinasServicios(data?.maquina.id);
  };

  const hideDialogMaquinaServicios = () => {
    setVisibleMaquinaServicios(false);
  };

  //necesario para el crud
  const handleAddIngrediente = (materia_prima) => {
    if (materiaPrima === null) {
      showToast(
        "error",
        "Error al agregar Ingrediente",
        `Debe Seleccionar un Ingrediente o materia prima`
      );
    } else if (cantidad <= 0) {
      showToast(
        "error",
        "Error al agregar Ingrediente",
        `Debe ingresar una cantidad mayor a 0`
      );
    } else {
      const newIngrediente = {
        producto_id: 0,
        materia_prima_id: materiaPrima.id,
        cantidad: cantidad,
        materia_prima: materiaPrima,
      };
      let existe = false;
      const newIngredientes = producto.ingredientes.map((ingre) => {
        if (existe === false) {
          if (ingre.materia_prima_id === materia_prima.id) {
            existe = true;
            console.log(existe);
            return {
              ...ingre,
              cantidad: cantidad,
            };
          } else {
            existe = false;
            console.log(existe);
          }
        } else {
          return ingre;
        }
        return ingre;
      });
      if (!existe) {
        setProducto({
          nombre: producto.nombre,
          cantidad_base: producto.cantidad_base,
          presentacion_id: producto.presentacion_id,
          tiempo_vida: producto.tiempo_vida,
          ingredientes: [...producto.ingredientes, newIngrediente],
          maquinas: producto.maquinas,
        });
      } else {
        setProducto({
          nombre: producto.nombre,
          cantidad_base: producto.cantidad_base,
          presentacion_id: producto.presentacion_id,
          tiempo_vida: producto.tiempo_vida,
          ingredientes: newIngredientes,
          maquinas: producto.maquinas,
        });
      }

      setMateriaPrima(null);
      setCantidad(0);
    }
  };
  const handleAddMaquina = (machine) => {
    if (maquina === null) {
      showToast(
        "error",
        "Error al agregar Máquina",
        `Debe Seleccionar una Máquina`
      );
    } else if (hora <= 0) {
      showToast(
        "error",
        "Error al agregar Máquina",
        `Debe ingresar una cantidad de horas mayor a 0`
      );
    } else if (batch <= 0) {
      showToast(
        "error",
        "Error al agregar Máquina",
        `Debe ingresar un batch mayor a 0`
      );
    } else {
      const newMaquina = {
        producto_id: 0,
        maquina_id: maquina.id,
        cantidad_horas: hora,
        maquina: maquina,
        batch: batch,
      };
      let existe = false;
      const newMaquinas = producto.maquinas.map((maq) => {
        if (existe === false) {
          if (maq.maquina_id === machine.id) {
            existe = true;

            return {
              ...maq,
              cantidad_horas: hora,
              batch: batch,
            };
          } else {
            existe = false;
            console.log(existe);
          }
        } else {
          return maq;
        }
        return maq;
      });
      if (!existe) {
        setProducto({
          nombre: producto.nombre,
          cantidad_base: producto.cantidad_base,
          presentacion_id: producto.presentacion_id,
          tiempo_vida: producto.tiempo_vida,
          ingredientes: producto.ingredientes,
          maquinas: [...producto.maquinas, newMaquina],
        });
      } else {
        console.log("ingresa al else");
        setProducto({
          nombre: producto.nombre,
          cantidad_base: producto.cantidad_base,
          presentacion_id: producto.presentacion_id,
          tiempo_vida: producto.tiempo_vida,
          ingredientes: producto.ingredientes,
          maquinas: newMaquinas,
        });
      }
      setMaquina(null);
      setHora(0);
    }
  };
  const handleChangeNombreProducto = (e) => {
    setProducto({
      nombre: e.target.value,
      cantidad_base: producto.cantidad_base,
      //presentacion: producto.presentacion,
      presentacion_id: producto.presentacion_id,
      tiempo_vida: producto.tiempo_vida,
      ingredientes: producto.ingredientes,
      maquinas: producto.maquinas,
    });
  };
  const handleChangeCantidadBase = (e) => {
    setProducto({
      nombre: producto.nombre,
      cantidad_base: e.target.value,
      //presentacion: producto.presentacion,
      presentacion_id: producto.presentacion_id,
      tiempo_vida: producto.tiempo_vida,
      ingredientes: producto.ingredientes,
      maquinas: producto.maquinas,
    });
  };
  const handleChangePresentacion = (e) => {
    setPresentacion(e.value);
    setProducto({
      nombre: producto.nombre,
      cantidad_base: producto.cantidad_base,
      presentacion_id: e.value.id,
      // presentacion_id: e.value != null ? e.value.id : e.value,
      tiempo_vida: producto.tiempo_vida,
      ingredientes: producto.ingredientes,
      maquinas: producto.maquinas,
    });
  };
  const handleChangeVidaUtil = (e) => {
    setProducto({
      nombre: producto.nombre,
      cantidad_base: producto.cantidad_base,
      presentacion_id: producto.presentacion_id,
      tiempo_vida: e.target.value,
      ingredientes: producto.ingredientes,
      maquinas: producto.maquinas,
    });
  };
  const handleChangeMateriaPrima = (e) => {
    setMateriaPrima(e.value);
    setProducto({
      nombre: producto.nombre,
      cantidad_base: producto.cantidad_base,
      presentacion_id: producto.presentacion_id,
      tiempo_vida: producto.tiempo_vida,
      ingredientes: producto.ingredientes,
      maquinas: producto.maquinas,
    });
    console.log(e.value);
  };
  const handleChangeCantidad = (e) => {
    setCantidad(e.target.value);
  };
  const handleChangeMaquina = (e) => {
    setMaquina(e.value);
    setProducto({
      nombre: producto.nombre,
      cantidad_base: producto.cantidad_base,
      presentacion_id: producto.presentacion_id,
      tiempo_vida: producto.tiempo_vida,
      ingredientes: producto.ingredientes,
      maquinas: producto.maquinas,
    });
  };
  const handleChangeHora = (e) => {
    setHora(e.target.value);
  };
  const handleChangeBatch = (e) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) { 
      setBatch(value);
    }
  };
  const accept = () => {
    console.log(materiaPrima);
    deleteIngrediente(materiaPrima);
  };
  const reject = () => {
    toast.current.show({
      severity: "info",
      summary: "Rechazada",
      detail: "No se realizo ninguna acción",
      life: 3000,
    });
  };

  // console.log('Tumarido:', producto);

// Función para validar máquinas con servicios
const validarMaquinasConServicios = () => {
  return new Promise((resolve, reject) => {
    const errores = [];

    // Obtener servicios de una máquina por su ID
    const obtenerServiciosMaquina = (maquinaId) => {
      return new Promise((resolveMaquina, rejectMaquina) => {
        http.get(`/maquinasservicios/get/${maquinaId}`)
          .then((response) => {
            const servicios = response.data.data;
            const tieneServicio = servicios.some(servicio => servicio.servicio_id !== null);
            if (!tieneServicio) {
              resolveMaquina({ tieneServicio: false });
            } else {
              resolveMaquina({ tieneServicio: true });
            }
          })
          .catch((error) => {
            console.log(`Error al obtener servicios para la máquina ${maquinaId}:`, error);
            rejectMaquina(error);
          });
      });
    };

    // Array de promesas para validar cada máquina
    const promesasValidacion = producto.maquinas.map((maquina) => {
      return obtenerServiciosMaquina(maquina.maquina_id)
        .then((result) => {
          if (!result.tieneServicio) {
            errores.push(maquina.maquina.nombre);
          }
        })
        .catch((error) => {
          console.error(`Error al validar máquina ${maquina.maquina.nombre}:`, error);
          errores.push(maquina.maquina.nombre); 
        });
    });

    
    Promise.all(promesasValidacion)
      .then(() => {
        if (errores.length > 0) {
          reject(errores); // Rechazar con el array de nombres de máquinas sin servicios
        } else {
          resolve(); 
        }
      })
      .catch((error) => {
        reject([error]); //Errores inesperados
      });
  });
};

// Función para manejar la creación de productos
const handleSubmitCreate = () => {
  setLoadingProducto(true);
  validarMaquinasConServicios()
    .then(() => {
      
      if (producto.nombre.length === 0) {
        showToast("error", "Error al crear Producto", `Debe ingresar un nombre al producto`);
        return;
      }

      if (producto.cantidad_base <= 0) {
        showToast("error", "Error al crear Producto", `Debe ingresar una cantidad base mayor a 0`);
        return;
      }

      if (producto.presentacion_id === null) {
        showToast("error", "Error al crear Producto", `Debe seleccionar una presentación para el producto`);
        return;
      }

      if (producto.tiempo_vida <= 0) {
        showToast("error", "Error al crear Producto", `Debe ingresar una cantidad de vida útil mayor a 0`);
        return;
      }

      if (producto.ingredientes.length === 0) {
        showToast("error", "Error al crear Producto", `Debe ingresar al menos un ingrediente para el producto`);
        return;
      }

      if (producto.maquinas.length === 0) {
        showToast("error", "Error al crear Producto", `Debe ingresar al menos una máquina para el producto`);
        return;
      }
      http.post("/productos/create", producto)
        .then((response) => {
          navigate("/getProductos", { state: { message: `Se creó el producto ${producto.nombre} correctamente`, severity: 'success', title: 'Producto Creado' } });
        })
        .catch((error) => {
          console.log(error);
          showToast("error", "Producto No Creado", `No se creó el producto ${producto.nombre}`);
        })
    })
    .catch((errores) => {
      if (Array.isArray(errores) && errores.length > 0) {
        const maquinasSinServicioText = errores.join(', ');
        showToast("error", "Error al crear Producto", `Las siguientes máquinas no tienen servicios asociados: ${maquinasSinServicioText}`);
      } else {
        console.error("Error inesperado en la validación de máquinas:", errores);
        showToast("error", "Error al crear Producto", "Error inesperado al validar máquinas");
      }
    })
    .finally(() => {
      setTimeout(() => {
        setLoadingProducto(false);
      }, 5000);
    })
};
  
  // console.log(presentaciones);

  const showToast = (tipo, titulo, detalle) => {
    toast.current.show({
      severity: tipo,
      summary: titulo,
      detail: detalle,
      life: 3000,
    });
  };


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
    console.log(producto);
    setPresentacion(producto);
    setMateriaPrima(producto);
    setVisibleDelete(true);
  };
  const deleteIngrediente = (materia_prima) => {
    const newIngrediente = producto.ingredientes.filter(
      (ingre) => ingre.materia_prima_id !== materia_prima.materia_prima_id
    );
    //console.log(newIngrediente);
    setProducto({
      nombre: producto.nombre,
      cantidad_base: producto.cantidad_base,
      presentacion_id: producto.presentacion_id,
      tiempo_vida: producto.tiempo_vida,
      ingredientes: newIngrediente,
      maquinas: producto.maquinas,
    });
  };

  const actionBodyTemplateDeleteMaquina = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => confirmDeleteMaquina(rowData)}
        />
      </React.Fragment>
    );
  };
  const confirmDeleteMaquina = (maquina) => {
    setMaquina(maquina);
    setVisibleDeleteMaquina(true);
  };
  const deleteMaquina = (machine) => {
    const newMaquina = producto.maquinas.filter(
      (maq) => maq.maquina_id !== machine.maquina_id
    );
    //console.log(newIngrediente);
    setProducto({
      nombre: producto.nombre,
      cantidad_base: producto.cantidad_base,
      presentacion_id: producto.presentacion_id,
      tiempo_vida: producto.tiempo_vida,
      ingredientes: producto.ingredientes,
      maquinas: newMaquina,
    });
  };
  const acceptDeleteMaquina = () => {
    deleteMaquina(maquina);
  };
  const rejectDeleteMaquina = () => {
    toast.current.show({
      severity: "info",
      summary: "Rechazada",
      detail: "No se realizo ninguna acción",
      life: 3000,
    });
  };

  const actionBodyTemplateMaquinaServicios = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-info"
          className="p-button-rounded p-button-info"
          onClick={() => serviciosMaquina(rowData)}
        />
      </React.Fragment>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="section-crear-producto">
        <div className="title-crear-producto">
          <h1>Crear Producto</h1>
        </div>
        <div className="field section-input">
          <label htmlFor="nombre_producto">Nombre del Producto*</label>
          <InputText
            style={{ width: "100%" }}
            id="nombre_producto"
            value={producto.nombre}
            onChange={(e) => handleChangeNombreProducto(e)}
            required
            autoFocus
            autoComplete="off"
            placeholder="Ingrese Nombre del Producto..."
          />
        </div>
        <div className="contenedorHorizontal">
          <div className="field section-input flex-grow-1">
            <label htmlFor="cantidad_base">Cantidad Base*</label>
            <InputText
              style={{ width: "100%" }}
              id="cantidad_base"
              value={producto.cantidad_base}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^[0-9]{1,18}(\.[0-9]{0,2})?$/.test(value)) {
                  setProducto({
                    ...producto,
                    cantidad_base: value
                  });
                }
              }}
              required
              maxLength={20}
              inputMode="decimal"
              pattern="^[0-9]{1,18}(\.[0-9]{1,2})?$"
              autoComplete="off"
              placeholder="Ingrese Cantidad Base del Producto..."
            />
          </div>
          <div className="field section-input flex-grow-1">
            <label htmlFor="presentacion">Presentación</label>
            <Dropdown
            style={{ width: "100%" }}
            id="presentacion"
            value={producto.presentacion_id ? presentaciones.find(p => p.id === producto.presentacion_id) : null}
            onChange={handleChangePresentacion}
            options={presentaciones}
            optionLabel="nombre"
            placeholder="Seleccionar Presentación"
            filter
          />
          </div>
          <div className="field section-input flex-grow-1">
            <label htmlFor="cantidad_materia">Tiempo de vida útil (días)*</label>
            <InputText
              style={{ width: "100%" }}
              id="cantidad_materia"
              value={producto.tiempo_vida}
              onChange={(e) => handleChangeVidaUtil(e)}
              required
              keyfilter="pint"
              maxLength={20}
              autoComplete="off"
              placeholder="Ingrese tiempo de vida útil del producto en días..."
            />
          </div>
        </div>
        <div className="contenedorHorizontal">
          <div className="field section-input flex-grow-1">
            <label htmlFor="materia_prima">Materia Prima*</label>
            <Dropdown
              id="materia_prima"
              value={materiaPrima}
              options={materiasPrimas}
              onChange={(e) => {
                handleChangeMateriaPrima(e);
              }}
              optionLabel="nombre_materia"
              placeholder="Selecciona la Materia Prima"
              filter
              style={{ width: "100%" }}
            />
          </div>

          <div className="field section-input flex-grow-1">
            <label htmlFor="cantidad_materia">Cantidad de Materia Prima*</label>
            <div className="p-inputgroup">
              <InputText
                style={{ width: "100%" }}
                id="cantidad_materia"
                value={cantidad}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^[0-9]{1,18}(\.[0-9]{0,2})?$/.test(value)) {
                    setCantidad(value);
                  }
                }}
                required
                maxLength={22}
                inputMode="decimal"
                pattern="^[0-9]{1,18}(\.[0-9]{1,2})?$"
                autoComplete="off"
                placeholder="Ingrese Cantidad de Materia Prima..."
              />
              <span className="p-inputgroup-addon">
                {materiaPrima === null ||
                !materiaPrima.hasOwnProperty("unidad_medida")
                  ? ""
                  : materiaPrima.unidad_medida.abreviatura}
              </span>
            </div>
          </div>
        </div>
        <div className="section-button-add-ingrediente">
          <Button
            type="button"
            icon="pi pi-plus"
            label="Agregar Ingrediente"
            onClick={(e) => {
              handleAddIngrediente(materiaPrima);
            }}
          />
        </div>

        <div className="field">
          <label htmlFor="materia_prima">Lista de Ingredientes*</label>
          <TableIngredientes data={producto.ingredientes}>
            <Column
              field={"materia_prima.nombre_materia"}
              header="Ingrediente"
            ></Column>
            <Column field={"cantidad"} header="Cantidad"></Column>
            <Column
              field={"materia_prima.unidad_medida.abreviatura"}
              header="Unidad Medida"
            ></Column>
            <Column
              body={actionBodyTemplateDelete}
              header="Eliminar"
              exportable={false}
              style={{ minWidth: "8rem" }}
            ></Column>
          </TableIngredientes>
        </div>

        <div className="field section-input">
          <label htmlFor="maquinas">Máquinas*</label>
          <Dropdown
            id="maquinas"
            value={maquina}
            options={maquinas}
            onChange={(e) => {
              handleChangeMaquina(e);
            }}
            optionLabel="nombre"
            placeholder="Selecciona Una Máquina"
            filter
            required
            style={{ width: "100%" }}
          />
        </div>
        <div className="field section-input">
          <label htmlFor="horas">Cantidad de Horas*</label>
          <InputText
            style={{ width: "100%" }}
            id="horas"
            value={hora}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || /^[0-9]{1,18}(\.[0-9]{0,2})?$/.test(value)) { 
                handleChangeHora(e);
              }
            }}
            required
            maxLength={22} 
            inputMode="decimal" 
            pattern="^[0-9]{1,18}(\.[0-9]{1,2})?$" 
            autoComplete="off"
            placeholder="Ingrese Cantidad de Horas..."
          />
        </div>
        <div className="field section-input">
          <label htmlFor="horas">Batch*</label>
          <InputText
            style={{ width: "100%" }}
            id="horas"
            value={batch}
            onChange={(e) => handleChangeBatch(e)}
            required
            // keyfilter="num"
            maxLength={20}
            inputMode="numeric"
            autoComplete="off"
            placeholder="Ingrese Batch del Producto..."
          />
        </div>
        <div className="section-button-add-ingrediente">
          <Button
            type="button"
            icon="pi pi-plus"
            label="Agregar Máquina"
            onClick={(e) => {
              handleAddMaquina(maquina);
            }}
          />
        </div>

        <div className="field">
          <label htmlFor="materia_prima">Lista de Máquinas*</label>
          <TableIngredientes data={producto.maquinas}>
            <Column field={"maquina.nombre"} header="Máquina"></Column>
            <Column field={"cantidad_horas"} header="Horas"></Column>
            <Column field={"batch"} header="Batch"></Column>
            <Column
            body={actionBodyTemplateMaquinaServicios}
            header="Servicio"
            exportable={false}
            className="column column-detail"
          ></Column>
            <Column
              body={actionBodyTemplateDeleteMaquina}
              header="Eliminar"
              exportable={false}
              style={{ minWidth: "8rem" }}
            ></Column>
          </TableIngredientes>
        </div>

        <div className="section-button-submits">
          <Button
            type="button"
            icon="pi pi-save"
            disabled={loadingProducto}
            className="p-button-success"
            label="Crear Producto"
            style={{ marginRight: "20px" }}
            onClick={(e) => {
              handleSubmitCreate();
            }}
          />
          <Button
            type="button"
            icon="pi pi-arrow-left"
            className="p-button-danger"
            label="Retornar"
            onClick={(e) => {
              navigate("/getProductos");
            }}
          />
        </div>
        <ConfirmDialog
          visible={visibleDelete}
          onHide={() => {
            setVisibleDelete(false);
            //cleanProducto();
          }}
          message={`Esta seguro de eliminar el ingrediente ${""}`}
          header="Confirmación"
          icon="pi pi-exclamation-triangle"
          acceptLabel="Sí"
          accept={accept}
          reject={reject}
        />
        <ConfirmDialog
          visible={visibleDeleteMaquina}
          onHide={() => {
            setVisibleDeleteMaquina(false);
            //cleanProducto();
          }}
          message={`Esta seguro de eliminar la máquina ${""}`}
          header="Confirmación"
          icon="pi pi-exclamation-triangle"
          acceptLabel="Sí"
          accept={acceptDeleteMaquina}
          reject={rejectDeleteMaquina}
        />

        <Dialog
          visible={visibleMaquinaServicios}
          style={{ width: "50vw" }}
          onHide={hideDialogMaquinaServicios}
          header={`Servicios de la máquina ${maquina ? maquina.nombre : ''}`}
          modal
          className="p-fluid container-descripcion-modal-locales-dialog"
        >
          <div className="p-container-titulo">
            <h1 className="container-titulo-table">Lista de Servicios</h1>
          </div>
          <div className="container-descripcion-table">
            <p>
              A continuación, se visualiza los servicios de la máquina{" "}
              {maquina ? maquina.nombre : ''} registrados en el sistema.
            </p>
          </div>
          <ListServiciosMaquinas
            data={maquinaServicios}
            selection={selectMaquinaServicio}
            onSelectionChange={(e) => setSelectMaquinaServicio(e.value)}
            onClickRefresh={() => getAllMaquinasServicios(maquina.id)}
            onInputSearch={(e) => setGlobalFilterMaquinaServicio(e.target.value)}
            valueGlobalFilter={globalFilterMaquinaServicio}
          >
            <Column
              field={"servicio.nombre"}
              header="Nombre"
              className="column column-name"
            ></Column>
            <Column
              field={"consumo"}
              header="Consumo"
              className="column column-consumo"
            ></Column>
            <Column
              field={"servicio.unidad_medida_servicio.abreviatura"}
              header="Medida"
              className="column column-medida"
            ></Column>
          </ListServiciosMaquinas>
        </Dialog>
      </div>
    </>
  );
};

export default CreateProducto;
