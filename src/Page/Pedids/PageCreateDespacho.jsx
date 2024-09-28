import React, { useEffect, useRef, useState } from 'react';
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import ListCreateDespachos from "../../Components/Pedido/ListCreateDespachos";
import AuthUser from "../../AuthUser";
import { Toast } from "primereact/toast";
import ProduccionDialog from "../../Components/Pedido/ProduccionDialog";
import { InputNumber } from "primereact/inputnumber";
import { DataTable } from 'primereact/datatable';
import './PageCreateDespacho.css';

const PageCreateDespacho = ({ visible, setVisible, data, loadData }) => {

  const [datos, setDatos] = useState([]);
  const [inventariosData, setInventariosData] = useState({
    titulo: '',
    archivo: null,
  });

  //modal para crear Producto
  const [visibleModalCuentas, setVisibleModalCuentas] = useState(false);

  const { http } = AuthUser();
  const toast = useRef(null);

  const [rowData, setRowData] = useState(null);

  const [fechaEntrega, setFechaEntrega] = useState(null);
  const [documento, setDocumento] = useState('');

  const [despachos, setDespachos] = useState(null);
  const [objectCreateDespacho, setObjectCreateDespacho] = useState({
    fecha_entrega: "",
    documento_referencia: "",
    despachos: [],
    despachos_produccion: [],
    documentos: [],
  });
  const [selectPedidoDetalle, setSelectPedidoDetalle] = useState(null);

  const [visibleProduccion, setVisibleProduccion] = useState(false);

  const showToast = (tipo, titulo, detalle) => {
    toast.current.show({
      severity: tipo,
      summary: titulo,
      detail: detalle,
      life: 3000,
    });
  };
  const textEditor = (options) => {
    return (
      <InputNumber
        value={parseInt(options.value)}

        min={0}
        max={options.rowData.producto.stock < options.rowData.cantidad_pendiente ? options.rowData.producto.stock : options.rowData.cantidad_pendiente}
      // keyfilter="num"
      />
    );
  };
  const hideDialog = () => {
    setVisible(false)
  };

  const actionBodyProduccion = (rowData) => {
    return (
      <div>
        <Button
          type="button"
          icon="pi pi-th-large"
          className={(rowData.estado === 0 || rowData.estado === 1) ? "p-button-success" : "p-button-danger"}
          title="Producción"
          style={{ marginRight: '.5em', borderRadius: '100%' }}
          onClick={() => {
            setVisibleProduccion(true)
            setRowData(rowData)
            let datosAux = objectCreateDespacho?.despachos_produccion.filter((objeto) => objeto.producto_id !== rowData.producto_id)
            setObjectCreateDespacho(
              { ...objectCreateDespacho, despachos_produccion: datosAux }
            );
          }}
          disabled={rowData?.estado === 0}
        />
      </div>
    )
  };

  const onRowEditComplete1 = (e) => {
    console.log(e);
    let desp = [...despachos];
    let { newData, index } = e;
    desp[index] = {
      pedido_id: newData.pedido_id,
      pedido_detalle_id: newData.pedido_detalle_id,
      producto: newData.producto,
      //trabajador: null,
      //trabajador_id: null,
      producto_id: newData.producto_id,
      cantidad_entregada: newData.cantidad_entregada,
      cantidad_solicitada: newData.cantidad_solicitada,
      cantidad_pendiente: newData.cantidad_pendiente,
      cantidad_restante:
        newData.cantidad_pendiente - newData.cantidad_entregada,
      estado_entrega: newData.estado_entrega,
      estado: parseInt(newData.cantidad_entregada) === 0 ? 0 : 2
      //fecha_emision: newData.fecha_emision,
      //fecha_entrega: newData.fecha_entrega,
      //documento_referencia: newData.documento_referencia,
    };
    setDespachos(desp);
    setObjectCreateDespacho({
      pedido_id: data.pedido_id,
      documento_referencia: documento,
      fecha_entrega: fechaEntrega,
      despachos: desp,
      despachos_produccion: objectCreateDespacho.despachos_produccion,
      documentos: objectCreateDespacho.documentos,
    });
  };

  function handleCreate() {
    let todo_asigando = false;
    let hay_producto_con_cantidad_cero = false;

    objectCreateDespacho.despachos.forEach(_despacho => {
      if (_despacho.estado === 2) {
        todo_asigando = true;
      }
      if (parseInt(_despacho.cantidad_entregada) === 0) {
        hay_producto_con_cantidad_cero = true;
      }
    });

    if (!fechaEntrega) {
      showToast(
        "error",
        "Error al crear Despacho",
        `Debe ingresar una fecha de entrega`
      );
    } else if (!documento) {
      showToast(
        "error",
        "Error al crear Despacho",
        `Debe Ingresar documento de referencia`
      );
    } else if (todo_asigando) {
      showToast(
        'error',
        'Error al crear Despacho',
        `Falta seleccionar producciones`,
      );
    } else if (hay_producto_con_cantidad_cero) {
      showToast(
        'error',
        'Error al crear Despacho',
        `No se puede crear un despacho con productos de cantidad 0`,
      );
    } else {

      const formData = new FormData();

      // Agrega datos no relacionados con archivos
      formData.append('pedido_id', objectCreateDespacho.pedido_id);
      formData.append('documento_referencia', objectCreateDespacho.documento_referencia);
      formData.append('fecha_entrega', objectCreateDespacho.fecha_entrega);

      // Agrega los documentos al FormData
      objectCreateDespacho.documentos.forEach((doc, index) => {
        formData.append(`documentos[${index}][titulo]`, doc.titulo);
        formData.append(`documentos[${index}][archivo]`, doc.archivo);
      });

      // Agrega los despachos al FormData, incluyendo la iteración sobre productos
      objectCreateDespacho.despachos.forEach((despacho, index) => {
        formData.append(`despachos[${index}][cantidad_entregada]`, despacho.cantidad_entregada);
        formData.append(`despachos[${index}][cantidad_pendiente]`, despacho.cantidad_pendiente);
        formData.append(`despachos[${index}][cantidad_restante]`, despacho.cantidad_restante);
        formData.append(`despachos[${index}][cantidad_solicitada]`, despacho.cantidad_solicitada);
        formData.append(`despachos[${index}][estado]`, despacho.estado);
        formData.append(`despachos[${index}][estado_entrega]`, despacho.estado_entrega);
        formData.append(`despachos[${index}][pedido_detalle_id]`, despacho.pedido_detalle_id);
        formData.append(`despachos[${index}][pedido_id]`, despacho.pedido_id);
        formData.append(`despachos[${index}][producto_id]`, despacho.producto_id);

        // Si `producto` es un array, iterar sobre cada producto
        // formData.append(`despachos[productos][${index}][id]`, despacho.producto.id);
        // formData.append(`despachos[productos][${index}][nombre]`, despacho.producto.nombre);
        // formData.append(`despachos[productos][${index}][stock]`, despacho.producto.stock);
        // formData.append(`despachos[productos][${index}][cantidad_base]`, despacho.producto.cantidad_base);
        // formData.append(`despachos[productos][${index}][tiempo_vida]`, despacho.producto.tiempo_vida);
        // formData.append(`despachos[productos][${index}][estado_registro]`, despacho.producto.estado_registro);
        // formData.append(`despachos[productos][${index}][estado_reserva]`, despacho.producto.estado_reserva);
        // formData.append(`despachos[productos][${index}][presentacion_id]`, despacho.producto.presentacion_id);
      });

      // Agrega los despachos_produccion al FormData
      objectCreateDespacho.despachos_produccion.forEach((despachoProduccion, index) => {
        formData.append(`despachos_produccion[${index}][cantidad_produccion]`, despachoProduccion.cantidad_produccion);
        formData.append(`despachos_produccion[${index}][estado]`, despachoProduccion.estado);
        formData.append(`despachos_produccion[${index}][produccion_id]`, despachoProduccion.produccion_id);
        formData.append(`despachos_produccion[${index}][producto_id]`, despachoProduccion.producto_id);
      });
      http
        .post("/pedidos/despachos/create", formData)
        .then((response) => {
          showToast(
            "success",
            "Despacho Creado",
            `Se creo el despacho correctamente`
          );
          loadData();
          hideDialog();
          setDatos([]);

        })
        .catch((error) => {
          console.log(error);
          showToast("error", "Despacho No Creado", `No Se creo el despacho`);
        });
    }
  }

  const dialogHeader = (
    <>
      <i className="pi pi-users icon-create-proveedor"></i>Crear Despacho
    </>
  )

  const dialogFooter = (
    <>
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Button
          label="Cancelar"
          icon="pi pi-times"
          className="p-button-danger"
          onClick={hideDialog}
        />
        <Button
          label="Guardar"
          icon="pi pi-check"
          className="p-button-success"
          type="submit"
          onClick={handleCreate}
        />
      </div>
    </>
  );

  const dialogContent = (
    <>
      <ListCreateDespachos
        data={despachos}
        selection={selectPedidoDetalle}
        onSelectionChange={(e) => {
          setSelectPedidoDetalle(e.value);
        }}
        onClickRefresh={() => getDespachos()}
        //onInputSearch={(e) => setGlobalFilterPedidoDetalle(e.target.value)}
        //valueGlobalFilter={globalFilterPedidoDetalle}
        editMode="row"
        onRowEditComplete={onRowEditComplete1}
      /*responsiveLayout="scroll"*/
      >
        <Column field={"producto.nombre"} header="Productos"></Column>
        <Column
          field={"producto.stock"}
          header="Cantidades de Productos"
        ></Column>
        <Column
          field={"cantidad_pendiente"}
          header="Cantidad Pendiente"
        ></Column>
        <Column
          field={"cantidad_entregada"}
          header="Cantidad a Entregar"
          editor={(options) => textEditor(options)}
        // onChange={(e) => handleChangeCantidadEntregada(e)}
        ></Column>
        <Column
          field={"cantidad_restante"}
          header="Cantidad Restante"
          //onChange={handleChangeCantidadPendiente}
          disable
        ></Column>

        <Column
          rowEditor
          headerStyle={{ width: "10%", minWidth: "8rem" }}
          bodyStyle={{ textAlign: "center" }}
          disable
        ></Column>

        <Column
          body={actionBodyProduccion} style={{ textAlign: 'center', width: '10rem' }}
        />

      </ListCreateDespachos>
    </>
  )


  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "documento") {
      setInventariosData({
        ...inventariosData,
        archivo: files[0]
      });
    } else {
      setInventariosData({
        ...inventariosData,
        [name]: value
      });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const archivo = e.dataTransfer.files[0];
    setInventariosData({
      ...inventariosData,
      archivo
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const agregarDato = () => {
    if (!inventariosData.titulo || !inventariosData.archivo) {
      alert('Por favor, completa todos los campos antes de agregar.');
      return;
    }
    const nombreExistente = datos.some(dato => dato.titulo === inventariosData.titulo);
    const archivoExistente = datos.some(dato => dato.archivo && dato.archivo.name === inventariosData.archivo?.name);

    if (nombreExistente) {
      alert('El titulo ya existe. Por favor, elige otro titulo.');
      return;
    }

    if (archivoExistente) {
      alert('El archivo ya existe. Por favor, elige otro archivo.');
      return;
    }

    const nuevoDato = {
      id: Date.now(),
      titulo: inventariosData.titulo,
      archivo: inventariosData.archivo
    };
    setDatos([...datos, nuevoDato]);
    setInventariosData({ titulo: '', archivo: null });
  };
  const guardarDatos = () => {
    setObjectCreateDespacho(prevState => ({
      ...prevState,
      documentos: datos
    }));
    setVisibleModalCuentas(false);
    console.log("Datos a guardar:", datos);
  };

  const deleteDato = (rowData) => {
    const nuevosDatos = datos.filter(dato => dato.id !== rowData.id);
    setDatos(nuevosDatos);
  };

  const deleteInventario = (rowData) => {
    return (
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger"
        onClick={() => deleteDato(rowData)}
      />
    );
  };

  const cancelarArchivos = () => {
    setVisibleModalCuentas(false);
    setDatos([]);
  }

  const footerContent = (
    <div className='contenedor-modal-Productoes__footer'>
      <Button className='boton-general-para-cancelar' label="Cancelar" icon="pi pi-times" autoFocus onClick={cancelarArchivos} />
      <Button
        label="Guardar"
        icon="pi pi-save"
        onClick={guardarDatos}
        disabled={datos.length === 0}
        className="p-button-primary"
      />
    </div>
  );

  const dialogUpContent = (
    <>
      <div className="flex-crear-despacho">
        <div className="field field-despacho">
          <label htmlFor="estado_mantenimiento">Fecha de Entrega</label>
          <InputText
            placeholder="Ingresar Fecha de Entrega"
            onChange={e => setFechaEntrega(e.target.value)}
            value={fechaEntrega === null ? "" : fechaEntrega} // Condición para valor null
            type="date"
          />

        </div>
        <div className="field field-despacho margin-despacho">
          <label htmlFor="estado_mantenimiento">Documentos</label>
          <Button label='Cargar Documentos.' icon="pi pi-folder-open" onClick={() => setVisibleModalCuentas(true)} />
        </div>
        <div className="field field-despacho margin-despacho">
          <label htmlFor="estado_mantenimiento">Documento de Referencia</label>
          <InputText
            placeholder="Ingresar Documento de Referencia"
            onChange={e => setDocumento(e.target.value)}
            value={documento === null ? "" : documento}
            maxLength={20}
          />
        </div>
      </div>
    </>
  );


  const getDespachos = () => {
    http
      .get(`/pedidos/despachosdetalles/get/${data?.pedido_id}`)
      .then((response) => {
        var newResponse = response?.data?.data.map(despacho => {
          despacho = { ...despacho, estado: 0 }
          return despacho;
        })
        setDespachos(newResponse);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getDespachos();
  }, [visible])

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={visible}
        style={{ width: "1000px" }}
        breakpoints={{ '960px': '75vw', '640px': '100vw' }}
        className="p-fluid"
        closable={false}
        draggable={false}
        modal
        onHide={hideDialog}
        header={dialogHeader}
        footer={dialogFooter}
      >
        {dialogUpContent}
        {dialogContent}

        <ProduccionDialog
          visible={visibleProduccion}
          setVisible={setVisibleProduccion}
          rowData={rowData}
          setRowData={setRowData}
          objData={objectCreateDespacho}
          setObjData={setObjectCreateDespacho}
        />

      </Dialog>

      <Dialog visible={visibleModalCuentas} header="Carga documentos" footer={footerContent} modal style={{ width: '55rem', height: 'auto' }}
        onHide={() => {
          if (!visibleModalCuentas) return;
          setVisibleModalCuentas(false);
        }}>
        <div className="contenedor-modal">
          <div className="p-field">
            <div className="contenedor-group nombre">

              <label htmlFor="titulo">Titulo documento</label>
              <InputText
                name="titulo"
                value={inventariosData.titulo}
                onChange={handleInputChange}
                className="p-inputtext"
              />
            </div>
            <div className="contenedor-group archivo" onDrop={handleDrop} onDragOver={handleDragOver} style={{ border: '2px dashed #ccc', textAlign: 'center' }}>
              <input
                type="file"
                name="documento"
                onChange={handleInputChange}
                className="p-inputtext"
                style={{ display: 'none' }}
                id="fileInput"
                accept=".pdf,.png,.jpg,.jpeg,.gif"
              />
              <div
                onClick={() => document.getElementById('fileInput').click()}
                style={{ cursor: 'pointer', padding: '22px', background: 'white' }}
              >
                {inventariosData.archivo ? inventariosData.archivo.name : 'Seleccionar o Arrastre Archivo'}
              </div>
            </div>

            <div className="contenedor-group boton">
              <Button
                label="Agregar"
                icon="pi pi-plus"
                onClick={agregarDato}
                className="p-button-success"
                style={{ width: '100%' }}
              />
            </div>
          </div>
          <div className="contenedor-modal">
            <DataTable value={datos} className="mi-datatable">
              <Column field="titulo" header="Titulo documento" />
              <Column
                field="archivo.name"
                header="Archivo"

              />
              <Column header="Eliminar" style={{ width: '5%' }} body={deleteInventario} />
            </DataTable>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default PageCreateDespacho;