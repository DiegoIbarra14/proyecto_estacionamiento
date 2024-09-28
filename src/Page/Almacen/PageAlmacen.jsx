import React, { useEffect, useState, useRef } from "react";
import ListAlmacen from "../../Components/Almacen/ListAlmacen";
import Container from "../../Components/Container/Container";
import { Toast } from "primereact/toast";
import { Column } from "primereact/column";
import ProductoService from "../../Services/ProductoService";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import AuthUser from '../../AuthUser';
import "./pageAlmacen.css";
import { useDispatch } from "react-redux";
import { logout } from "../../reducers/authSlices";


import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";

export default function PageAlmacen() {
  const { http, getToken, deleteToken } = AuthUser();
  const [my, setMy] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [globalFilterDetalle, setGlobalFilterDetalle] = useState(null);
  const [productos, setProductos] = useState([]);
  const [almacen, setAlmacen] = useState([]);
  const [visible, setVisible] = useState(false);
  const [desactivar, setDesactivar] = useState(false);
  const [loadingAlmacen, setLoadingAlmacen] = useState(false);
  const dispatch = useDispatch()

  const toast = useRef(null);
  const showToast = (tipo, titulo, detalle) => {
    toast.current.show({
      severity: tipo,
      summary: titulo,
      detail: detalle,
      life: 3000,
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
  }, [setProductos]);

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
    } catch (e) {
      console.log(e);
    }
  };

  const actionBodyTemplateUpdate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-info"
          className="p-button-rounded p-button-info"
          onClick={() => {
            getAllProductos();
            confirmInfoProducto(rowData);
          }}
        />
      </React.Fragment>
    );
  };

  //Columna Merma de Detalles

  //constantes para mi dialog de merma
  const [produccion, setProduccion] = useState(null);
  const [visibleRegistrarMerma, setVisibleRegistrarMerma] = useState(false);
  const [cabeza, setCabeza] = useState("");
  const [pieBoton, setPieBoton] = useState("");
  const [causa_merma, setCausaMerma] = useState("");
  const [cantidad_merma, setCantidadMerma] = useState(0);
  const [mensaje, setMensaje] = useState("");

  //funcion para abrir dialog de merma
  const abrirRegistrarMerma = (data, cabecera, buton) => {
    setItemProducto(data);
    setVisibleRegistrarMerma(true);
    setCabeza(cabecera)
    setPieBoton(buton)
  }
  //función para cerrar dialog de merma
  const hideDialogMerma = () => {
    setVisibleRegistrarMerma(false);
    setCantidadMerma("0");
    setCausaMerma("");
    setMensaje("");
  }

  //constante para mi dialog de historial
  const [visibleHistorialMerma, setVisibleHistorialMerma] = useState(false);

  //funcion para abrir historial de merma
  const abrirHistorial = (data) => {
    setItemProducto(data);
    setVisibleHistorialMerma(true);
    getHistorialMerma(data.id);
  }


  const botonesMerma = (data) => {
    if (productos.stock <= 0) {
      setDesactivar(true);
    }
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
        <Button
          onClick={() => abrirRegistrarMerma(data, "Registrar Merma", "Registrar")}
          tooltip="Registrar Merma"
          icon='pi pi-exclamation-circle'
          className="p-button-rounded p-button-danger" disabled={desactivar} />
        <Button
          onClick={() => abrirHistorial(data)}
          tooltip="Historial Merma"
          icon='pi pi-info'
          className="p-button-rounded p-button-warning " />
      </div>
    )
  }
  //columna de acciones de Historial Merma

  const [itemMerma, setItemMerma] = useState(null);
  const [visibleDeleteMerma, setVisibleDeleteMerma] = useState(null);
  const abrirEditarMerma = (data, cabecera, pieBoton) => {
    setItemMerma(data);
    setVisibleRegistrarMerma(true);
    setCabeza(cabecera);
    setPieBoton(pieBoton);
    setCausaMerma(data.motivo_merma);
    setCantidadMerma(data.cantidad_merma);
  }

  const botonesAccionMerma = (data) => {
    return (
      <div style={{ display: "flex", justifyContent: "start", gap: "5px" }}>
        <Button
          onClick={() => abrirEditarMerma(data, "Editar Merma", "Editar")}
          tooltip="Editar"
          icon='pi pi-pencil'
          className="p-button-rounded p-button-success" />
        <Button
          onClick={() => { setItemMerma(data); setVisibleDeleteMerma(true) }}
          tooltip="Eliminar"
          icon='pi pi-trash'
          className="p-button-rounded p-button-danger " />
      </div>
    )
  }

  //PARA EL DIALOG DEL PDF
  const [visiblePDF, setVisiblePDF] = useState(false)
  const [pdfUrl, setPdfUrl] = useState('');
  const env = import.meta.env.VITE_APP_API_URL;

  const exportPdf = async (datos, rutaPdf) => {
    try {
      const url = `${env}/${rutaPdf}/${datos.produccion_id}`;
      setPdfUrl(url);
      setVisiblePDF(true);
    } catch (error) {
      console.log(error);
    }
  };

  const mostrarTrazabilidad = (rowData) => {
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
  const mostrarAprobacion = (rowData) => {
    const estado = parseInt(rowData.produccion.estado_produccion);
    const calidad = parseInt(rowData.produccion.estado_calidad);
    return (
      <>{
        estado <= 3 && calidad == 0 ? (
          <Button
            icon="pi pi-file-pdf"
            className="p-button-outlined p-button-rounded p-button-primary"
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

  //columna presentación
  const [itemProducto, setItemProducto] = useState(null);

  //columna Detalle
  const confirmInfoProducto = (producto) => {
    setAlmacen(producto.almacen);
    setItemProducto(producto);
    setVisible(true);
  };
  const hideDialog = () => {
    setVisible(false);
  };
  const productDialogFooter = (
    <React.Fragment>
      <Button
        label="Cerrar"
        icon="pi pi-times"
        className="p-button-danger"
        onClick={hideDialog}
      />
    </React.Fragment>
  );

  //CRUD para merma
  const [mermaHistorial, setMermaHistorial] = useState(null);
  // const getHistorialMerma = (id) => {
  //   http.get(`producto/merma/get/${id}`)
  //     .then((response) => {
  //       setMermaHistorial(response.data.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const getHistorialMerma = async (id) => {
    try {
      const response = await http.get(`producto/merma/get/${id}`);
      setMermaHistorial(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };


  const registrarMerma = () => {
    const data = {
      "motivo_merma": causa_merma,
      "cantidad_merma": cantidad_merma
    }
    if (causa_merma != "" & cantidad_merma != "0") {
      setLoadingAlmacen(true);
      http.post(`producto/merma/create/${itemProducto.id}`, data)
        .then((response) => {
          showToast(
            "success",
            "Merma registrada",
            `Se registró merma en el producto ${itemProducto.nombre} correctamente`
          );
          hideDialogMerma();
          getAllProductos();
        })
        .catch((error) => {
          console.log(error);
          if (cantidad_merma > itemProducto.stock) {
            setMensaje("La cantidad ingresada excede al stock");
          }
          else {
            setMensaje("La cantidad debe ser un número entero");
          }
        })
        .finally(() => {
          setTimeout(() => {
            setLoadingAlmacen(false);
          }, 5000);
        })
        


    }

    else {
      setMensaje("Registra causa y cantidad de merma");
    }
  }

  // const actualizarMerma = () => {
  //   const data = {
  //     "motivo_merma": causa_merma,
  //     "cantidad_merma": cantidad_merma
  //   }
  //   if (causa_merma != "" & cantidad_merma != "0") {
  //     http.put(`producto/merma/update/${itemMerma.id}`, data)
  //       .then((response) => {
  //         showToast(
  //           "success",
  //           "Merma actualizada",
  //           `Se actualizó merma en ${itemProducto.nombre} correctamente`
  //         );
  //         getHistorialMerma(itemProducto.id);
  //         hideDialogMerma();
  //         getAllProductos();
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         if (cantidad_merma > itemProducto.stock) {
  //           setMensaje("La cantidad ingresada excede al stock");
  //         }
  //         else {
  //           setMensaje("La cantidad debe ser un número entero");
  //         }
  //       });

  //   }
  //   else {
  //     setMensaje("Registra causa y cantidad de merma");
  //   }
  // }

  const actualizarMerma = () => {
    // Obtener la cantidad total disponible
    const cantidadTotalDisponible = itemMerma.cantidad_total;

    // Calcular la nueva cantidad restante después de la merma
    const nuevaCantidadRestante = cantidadTotalDisponible - cantidad_merma;

    // Validar que la cantidad de merma no exceda la cantidad total disponible
    if (cantidad_merma > cantidadTotalDisponible) {
      setMensaje("La cantidad de merma no puede exceder la cantidad total disponible.");
      return;
    }

    // Validar que la cantidad restante no sea negativa
    if (nuevaCantidadRestante < 0) {
      setMensaje("La cantidad restante no puede ser negativa.");
      return;
    }

    const data = {
      "motivo_merma": causa_merma,
      "cantidad_merma": cantidad_merma
    };

    if (causa_merma !== "" && cantidad_merma !== "0") {
      http.put(`producto/merma/update/${itemMerma.id}`, data)

        .then((response) => {
          showToast(
            "success",
            "Merma actualizada",
            `Se actualizó la merma en ${itemProducto.nombre} correctamente`
          );
          const updatedMermaHistorial = mermaHistorial.map((merma, index) => {
            if (merma.id === itemMerma.id) {
              return {
                ...merma,
                cantidad_merma: cantidad_merma,
                cantidad_restante: nuevaCantidadRestante
              };
            }
            if (index > mermaHistorial.findIndex(m => m.id === itemMerma.id)) {
              return {
                ...merma,
                cantidad_total: merma.cantidad_total - (cantidad_merma - itemMerma.cantidad_merma)
              };
            }
            return merma;
          });
          setMermaHistorial(updatedMermaHistorial);
          getHistorialMerma(itemProducto.id);
          hideDialogMerma();
          getAllProductos();
        })
        .catch((error) => {
          console.log(error);
          setMensaje("Hubo un error al actualizar la merma.");
        });
    } else {
      setMensaje("Registra causa y cantidad de merma.");
    }
  };

  const deleteMerma = () => {
    http.delete(`producto/merma/delete/${itemMerma.id}`)
      .then((response) => {
        showToast(
          "success",
          "Merma Eliminada",
          `Se eliminó correctamente la merma de ${itemProducto.nombre}`
        );
        getHistorialMerma(itemProducto.id);
        setVisibleDeleteMerma(false);
        getAllProductos();
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "error",
          "Merma no eliminada",
          `No se eliminó merma en ${itemProducto.nombre}`
        );
      });
  }

  const formatValue = (value) => {
    if (value === null || value === '' || value === undefined) {
      return '---';
    }
    return value;
  };

  const [contador, setContador] = useState();
  const handleChangeMerma = (e) => {

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

    setCausaMerma(e.target.value)

  };

  return (


    <div className="container-alm"  >
      <Container url="getAlmacen" >
        <Toast ref={toast} />


        <h1 style={{ color: '#04638A' }}>Almacén</h1>
        <div >
          <ListAlmacen
            style={{ marginleft: "-7rem" }}
            title=""
            data={productos}
            onClickRefresh={() => {
              getAllProductos();
            }}
            onInputSearch={(e) => setGlobalFilter(e.target.value)}
            valueGlobalFilter={globalFilter}
            paginatorLeft
          >
            <Column
              field={"nombre"}
              header="Producto"
              className="column column-name"
              body={(rowData) => formatValue(rowData.nombre)}
            >
            </Column>
            <Column field={"stock"} header="Stock" className="column column-stock" body={(rowData) => formatValue(rowData.stock)}></Column>
            <Column
              body={(e) => botonesMerma(e)}
              header="Merma"
              className="column column-expiration_date"
            ></Column>
            <Column
              body={actionBodyTemplateUpdate}
              header="Detalle"
              exportable={false}
              style={{ minWidth: "8rem" }}
              className="column column-detail"
            ></Column>
          </ListAlmacen>
        </div>
        <Dialog
          visible={visible}
          style={{ Width: "600px" }}
          header={<><i className="pi pi-inbox icon-create-proveedor"></i>Detalle del almacén</>}
          modal
          className="p-fluid dialog-detalle-almacen"
          footer={productDialogFooter}
          onHide={hideDialog}

        >
          <div className="container-detalle-almacen" style={{ minWidth: "100px" }}>
            <ListAlmacen
              title="Detalle"
              data={almacen}
              onInputSearch={(e) => setGlobalFilterDetalle(e.target.value)}
              valueGlobalFilter={globalFilterDetalle}

            >
              <Column
                field={"produccion.codigo_produccion"}
                header="Código Producción"
                className="column column-code">
              </Column>
              <Column
                field={"fecha_produccion"}
                header="Fecha Producción"
                className="column column-production"
              ></Column>
              <Column
                field={"fecha_vencimiento"}
                header="Fecha Vencimiento"
                className="column column-date"
              ></Column>
              <Column
                field={"cantidad"}
                header="Cantidad real"
                style={{ minWidth: "100px" }}
                className="column column-quantity">
              </Column>
              <Column
                field={"produccion.cantidad"}
                header="Cantidad esperada"
                style={{ minWidth: "100px" }}
                className="column column-quantity">
              </Column>
              <Column
                field={"produccion.cantidad_merma"}
                header="Cantidad Merma"
                style={{ minWidth: "100px" }}
                className="column column-quantity">
              </Column>
              <Column
                body={itemProducto?.presentacion?.nombre}
                header="Presentación"
                style={{ minWidth: "100px" }}
                className="column column-quantity">
              </Column>

              <Column
                header="Trazabilidad"
                body={mostrarTrazabilidad}
                style={{ minWidth: "100px" }}
                className="column column-quantity">
              </Column>
              <Column
                body={mostrarAprobacion}
                header="Aprobación de calidad"
                style={{ minWidth: "100px" }}
                className="column column-quantity">
              </Column>
            </ListAlmacen>
          </div>

          <Dialog
            header="Lista de ingredientes"
            visible={visiblePDF}
            style={{ width: '50vw' }}
            onHide={() => setVisiblePDF(false)}>
            <iframe src={pdfUrl} width="100%" height="700px" title="PDF Viewer"></iframe>
          </Dialog>

        </Dialog>

        {/* Dialod para merma */}
        <Dialog
          visible={visibleRegistrarMerma}
          onHide={() => hideDialogMerma()}
          header={<h2 style={{ margin: "0px" }}>{cabeza}</h2>}
          footer={
            <>
              <Button
                label="Cerrar"
                icon="pi pi-times"
                className="p-button-danger"
                onClick={() => hideDialogMerma()}
              />
              <Button
                label={pieBoton}
                disabled={loadingAlmacen}
                icon="pi pi-check"
                className="p-button-success"
                onClick={() => pieBoton == "Registrar" ? registrarMerma() : actualizarMerma()}
              />
            </>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", marginBottom: "20px", position: 'relative' }}>
            <p>¿Cuál es la causa de la merma?</p>
            <p className="contador">{contador}</p>
            <InputTextarea value={causa_merma} onChange={handleChangeMerma} rows={5} cols={30} />
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center", justifyContent: "center" }}>
            <p>Cantidad</p>
            <InputText
              required
              keyfilter="pint" // Solo permite números enteros positivos
              autoComplete="off"
              maxLength={20} // Limita a 20 caracteres
              placeholder="Ingrese la cantidad de merma"
              value={cantidad_merma}
              onChange={(e) => setCantidadMerma(e.target.value)}
              inputMode="numeric" // Asegura el teclado numérico en dispositivos móviles

            />



            <strong>{itemProducto?.presentacion.nombre}</strong>
          </div>
          <small style={{ color: "red" }}>{mensaje}</small>
        </Dialog>

        {/* Historial Merma */}
        <Dialog
          style={{ width: "60vw", padding: "0", margin: "0" }}
          visible={visibleHistorialMerma}
          onHide={() => setVisibleHistorialMerma(false)}
          header={<><h3 style={{ margin: "0px" }}>Historial de Merma</h3></>}
          footer={
            <>
              <Button
                label="Cerrar"
                icon="pi pi-times"
                className="p-button-danger"
                onClick={() => setVisibleHistorialMerma(false)}
              />
            </>
          }
        >
          <div style={{ margin: "10px 0px" }}>
            <p style={{ margin: "0px" }}>
              A continuación, se visualiza el historial de merma del producto {itemProducto?.nombre}
            </p>
          </div>
          <DataTable value={mermaHistorial} paginator rows={4} emptyMessage="No se encontraron resultados">
            <Column body={itemProducto?.presentacion.nombre} header="Presentación"></Column>
            <Column body={(data) => (<>{data.cantidad_total} </>)} header="Cantidad Total"></Column>
            <Column body={(data) => (<>{data.cantidad_merma} </>)} header="Cantidad Merma"></Column>
            <Column body={(data) => (<>{data.cantidad_restante} </>)} header="Cantidad Disponible"></Column>
            <Column field="fecha" header="Fecha"></Column>
            <Column field="motivo_merma" header="Motivo"></Column>
            <Column body={(e) => botonesAccionMerma(e)} header="Acciones"></Column>
          </DataTable>

        </Dialog>

        {/* Dialog para eliminar merma */}
        <Dialog
          visible={visibleDeleteMerma}
          onHide={() => setVisibleDeleteMerma(false)}
          header={<h3 style={{ margin: "0" }}>¿Desea eliminar este registro del historial?</h3>}
          footer={<>
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-danger p-button-text"
              onClick={() => setVisibleDeleteMerma(false)}
            />
            <Button
              label="Eliminar"
              icon="pi pi-check"
              className="p-button-danger"
              onClick={() => deleteMerma()}
            />
          </>}
        >
          {`Eliminarás esta merma de ${itemProducto?.nombre}`}
        </Dialog>

      </Container>
    </div>


  );
}