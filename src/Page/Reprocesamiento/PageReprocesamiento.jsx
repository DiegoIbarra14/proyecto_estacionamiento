import React, { useEffect, useRef, useState } from 'react'
import Container from '../../Components/Container/Container';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';

import { InputTextarea } from 'primereact/inputtextarea';
import TableProduccion from '../../Components/Produccion/TableProduccion';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import './../../Components/Produccion/createProduccion.css';
import { useNavigate } from 'react-router-dom';
import AuthUser from '../../AuthUser';


import { ConfirmDialog } from 'primereact/confirmdialog';
import TextTrimmer from '../../Components/General/TextTrimmer';
import ListProduccion from '../../Components/Produccion/ListProduccion';
import TableIngredientes from '../../Components/Producto/TableIngredientes';


export const PageReprocesamiento = () => {

    // const { http } = AuthUser();
    const toast = useRef(null);
    const showToast = (tipo, titulo, detalle) => {
        toast.current.show({
            severity: tipo,
            summary: titulo,
            detail: detalle,
            life: 3000,
        });
    };


    //constantes para mis datos
    const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
    const [materiasPrimas, setMateriasPrimas] = useState(null);
    const [maquinaSeleccionada, setMaquinaSeleccionada] = useState(null);
    const [maquinas, setMaquinas] = useState(null);
    const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState(null);
    const [trabajadores, setTrabajadores] = useState([]);
    const [producciones, setProducciones] = useState(null);
    const [produccionesReproceso, setProduccionesReproceso] = useState(null);
    const [presentaciones, setPresentaciones] = useState(null);
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

    const getAllProducciones = () => {
        http.get("/producciones/get")
            .then((response) => {
                setProducciones(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    useEffect(() => {
        getAllProducciones();
        getAllPresentaciones();
        getAllMateriasPrimas();
        getAllMaquinas();
        getAllResponsables();
    }, []);

    //para filtrar las producciones de reprocesamiento
    useEffect(() => {
        if (producciones) {
            const produccionesReproceso = producciones.filter(item => item.estado_produccion === "5");
            setProduccionesReproceso(produccionesReproceso);//aca estoy seteando las producciones filtradas
            console.log("productos filtradossss: ", produccionesReproceso);
        }
    }, [producciones]);

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
    //para traer materias primas
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
      //para traer máquinas
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
      //para traer trabajadores
      const getAllResponsables = () => {
        http.get("/trabajadores/get")
            .then((response) => {
                const trabajadoresData = response.data.data.map(trabajador => ({
                    ...trabajador,
                    fullName: `${trabajador.nombres} ${trabajador.apellidos}`
                }));
                console.log("Trabajadores Data:", trabajadoresData);
                setTrabajadores(trabajadoresData);
            })
            .catch((error) => {
                console.log(error);
            });
    };
      

    //funciones para observaciones
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
    const hideDialog = () => {
        //setSubmitted(false);
        cleanTrabajador();
        setVisibleIniciar(false);
        setVisibleObservacion(false);
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

    //Columna Presentación
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
    // Dialog PDF
    const [visiblePDF, setVisiblePDF] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(false);
    const env = import.meta.env.VITE_APP_API_URL;
    const exportPdf = async (datos, rutaPdf) => {
      try {
        console.log(datos)
        const url = `${env}/${rutaPdf}/${datos.id}`;
        setPdfUrl(url);
        
      } catch (error) {
        console.log(error);
        setVisiblePDF(false);
      }
      
    };
     //columna Trazabilidad
    const actionTrazabilidad = (rowData) => {
      return (
        <React.Fragment>
          <Button
            icon="pi pi-file-pdf"
            className="p-button-outlined p-button-rounded p-button-secondary"
            onClick={() => exportPdf(rowData, "producciones/imprimirpdf")}
          />
        </React.Fragment>
      );
    };
    // columna aprobación de calidad pdf
    const actionPDFAprobaciónCalidad = (rowData) => {
      return (
        <React.Fragment>
          <Button
            icon="pi pi-file-pdf"
            className="p-button-outlined p-button-rounded p-button-primary"
            onClick={() => exportPdf(rowData, "produccion/pdf")}
          />
        </React.Fragment>
      );
    };
    //Columna Observaciones
    const [observacion, setObservacion] = useState([]);
    const [visibleObervacion, setVisibleObservacion] = useState(false);
    const btnObservacion = (produccion_) => {
        setProduccion(produccion_);
        setVisibleObservacion(true);
    };
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

    const handleChangeObservacion = (e) => {
        console.log(e.target.value);
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

    //Columna Acciones
    const [visibleAccion, setVisibleAccion] = useState(false);
    const botonesAcciones = (data) => {
        return (
            <>
                <Button
                    icon="pi pi-play"
                    tooltip="Alistar "
                    className="p-button-rounded p-button-warning "
                    onClick={() => setVisibleAccion(true)}
                />
            </>
        )
    }
    //Columna Estado Producción
    const mostrarEstadoProduccion = () => {
        return (
            <>
                <p>Alistar Requerimientos</p>
            </>
        )
    }

    const formatValue = (value) => {
        if (value === null || value === '' || value === undefined) {
          return '---';
        }
        return value;
      };



    return (
        <>
            <Container url={"getReprocesamiento"}>
                <Toast ref={toast} />
                <div className="p-container-header">
                    <div className="p-container-titulo">
                        <h1 style={{color:'#04638A'}} className="container-titulo-table">Módulo de Reprocesamiento</h1>
                    </div>
                    <div className="container-descripcion">
                        <div className="container-descripcion-table">
                            <p>
                                A continuación, se visualiza la lista de producciones que se tienen que reprocesar.
                            </p>
                        </div>
                    </div>
                </div>

                <ListProduccion
                    data={produccionesReproceso}
                //   onInputSearch={(e) => setGlobalFilter(e.target.value)}
                //   valueGlobalFilter={globalFilter}
                //   selection={select}
                //   onSelectionChange={(e) => {
                //     setSelect(e.value);
                //     console.log(e.value);
                //   }}
                // //   onClickRefresh={getAllProducciones}
                >
                    <Column
                        field="codigo_produccion"
                        header="Código"
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
                        // field="cantidad"
                        header="Fecha de Reprocesamiento"
                        className="column column-quantity"
                       
                    ></Column>
                    <Column
                        className="column column-state"
                        header="Cantidad"
                        field="cantidad"
                        // body={actionBodyTemplateIniciarProduccion}
                        exportable={false}
                        style={{ maxWidth: "auto" }}
                        body={(rowData) => formatValue(rowData.cantidad)}
                    ></Column>
                    <Column
                        className="column column-state"
                        header="Presentación"
                        body={(e) => mostrarPresentacion(e)}
                        // body={(e) => estadoProduccion(e)}
                        exportable={false}
                        style={{ maxWidth: "auto" }}
                    ></Column>
                    <Column
                        header="Acciones"
                        body={(e) => botonesAcciones(e)}
                        exportable={false}
                        style={{ maxWidth: "auto" }}
                        className="column column-observations"
                    ></Column>
                    <Column
                        header="Estado"
                        body={(e) => mostrarEstadoProduccion(e)}
                        exportable={false}
                        style={{ maxWidth: "auto" }}
                        className="column column-cost"
                    ></Column>

                    <Column
                        header="Observaciones"
                        body={actionBodyTemplateObservaciones}
                        exportable={false}
                        style={{ maxWidth: "auto" }}
                        className="column column-traceability"
                    ></Column>

                    <Column
                        header="Costo de Producción"
                        field="costo_total"
                        exportable={false}
                        style={{ maxWidth: "auto" }}
                        className="column column-traceability"
                        body={(rowData) => formatValue(rowData.costo_total)}
                    ></Column>
                    <Column
                        // body={actionBodyTemplateDelete}
                        header="Costo de Reprocesamiento"
                        exportable={false}
                        style={{ maxWidth: "auto" }}
                        className="column column-delete"
                    ></Column>
                    <Column
                        body={actionTrazabilidad}
                        header="Trazabilidad"
                        exportable={false}
                        style={{ maxWidth: "auto" }}
                        className="column column-delete"
                    ></Column>
                    <Column
                        body={actionPDFAprobaciónCalidad}
                        header="Aprobación de Calidad"
                        exportable={false}
                        style={{ maxWidth: "auto" }}
                        className="column column-delete"
                    ></Column>
                </ListProduccion>

                {/*DIALOGS DE LAS COLUMNAS */}
                <Dialog
                    header="Lista de ingredientes"
                    visible={visiblePDF}
                    style={{ width: '50vw' }}
                    onHide={() => setVisiblePDF(false)}
                >
                    <iframe src={pdfUrl} width="100%" height="700px" title="PDF Viewer"></iframe>
                </Dialog>

                <Dialog
                    visible={visibleObervacion}
                    style={{ width: "450px" }}
                    header={<><i className="pi pi-briefcase icon-create-produccion"></i>{" "} Observaciones </>}
                    modal
                    className="p-fluid"
                    footer={ObservacionDialogFooterUpdate}
                    onHide={hideDialog}
                >
                    <div className="field">
                        <label htmlFor="observaciones">Detalles</label>
                        <InputTextarea
                            id="observaciones"
                            value={produccion.observaciones}
                            onChange={(e) => handleChangeObservacion(e)}
                            rows={3}
                            autoResize
                            required
                            autoComplete="off"
                        />
                    </div>
                </Dialog>

                {/* Dialog para alistar requerimientos */}
                <Dialog
                    style={{ width: "65rem", height: "100%" }}
                    visible={visibleAccion}
                    onHide={() => setVisibleAccion(false)}
                    header={<><h3 style={{ margin: "0" }}>Seleccionar requirimientos</h3></>}
                    footer={<div>
                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            className="p-button-danger"
                            onClick={()=> setVisibleAccion(false)}
                        />
                        <Button
                            label="Aceptar"
                            icon="pi pi-check"
                            className="p-button-success"
                        />
                    </div>}
                >
                    <div className='seccion-reprocesamiento'>
                        <div className='repro'>
                            <p>Seleccionar insumos</p>
                            <div className='caja-select-input'>
                                <div className='dato'>
                                    <label>Materia Prima</label>
                                    <Dropdown
                                        placeholder="Seleccciona la materia prima"
                                        options={materiasPrimas}
                                        optionLabel='nombre_materia'
                                        filter
                                        value={materiaSeleccionada}
                                        onChange={(e)=> setMateriaSeleccionada(e.value)}
                                    />
                                </div>
                                <div className='dato'>
                                    <label>Cantidad de materia Prima</label>
                                    <div className='ctd-materia'>
                                        <InputText />
                                        <span className='unidad'>KG</span>
                                    </div>
                                </div>
                                <div className='dato'>
                                    <Button className='btn-agregar' icon='pi pi-plus' label='Agregar Insumo' />
                                </div>
                            </div>

                        </div>
                        <div className='repro'>
                            <label>Lista de insumos</label>
                            <TableIngredientes >
                                <Column
                                    // field={"materia_prima.nombre_materia"}
                                    header="Ingrediente"
                                ></Column>
                                <Column header="Cantidad"></Column>
                                <Column
                                    header="Unidad Medida"
                                ></Column>
                                <Column
                                    header="Eliminar"
                                    exportable={false}
                                    style={{ minWidth: "8rem" }}
                                ></Column>
                            </TableIngredientes>
                        </div>
                        <div className='repro'>
                            <p>Seleccionar máquinas</p>
                            <div className='caja-select-input'>
                                <div className='dato'>
                                    <label>Máquina</label>
                                    <Dropdown
                                        placeholder="Seleccciona la máquina"
                                        options={maquinas}
                                        optionLabel='nombre'
                                        filter
                                        value={maquinaSeleccionada}
                                        onChange={(e)=> setMaquinaSeleccionada(e.value)}
                                    />
                                </div>
                                <div className='dato'>
                                    <label>Cantidad de horas</label>
                                    <InputText />
                                </div>
                                <div className='dato'>
                                    <label>Batch</label>
                                    <InputText />
                                </div>
                                <div className='dato'>
                                    <Button className='btn-agregar' icon='pi pi-plus' label='Agregar Máquina' />
                                </div>

                            </div>

                        </div>
                        <div className='repro'>
                            <label>Lista de máquinas</label>
                            <TableIngredientes >
                                <Column
                                    // field={"materia_prima.nombre_materia"}
                                    header="Máquina"
                                ></Column>
                                <Column header="Horas"></Column>
                                <Column
                                    header="Batch"
                                ></Column>
                                <Column
                                    header="Servicio"
                                ></Column>
                                <Column
                                    header="Eliminar"
                                    exportable={false}
                                    style={{ minWidth: "8rem" }}
                                ></Column>
                            </TableIngredientes>
                        </div>
                        <div className='repro'>
                            <div className='dato'>
                                <label htmlFor='materia_prima'>Costo Total </label>
                                <InputText
                                    style={{ width: '25%' }}
                                    id='cantidad'
                                    // value={cantidadTotal}
                                    // onChange={(e) => handleChangeCantidad(e)}
                                    required
                                    step="0.01"
                                    presicion={2}
                                    keyfilter='num'
                                    autoComplete='off'
                                    disabled
                                    placeholder='Ingrese la cantidad de Producción.'
                                />
                            </div>
                        </div>
                        <div className='repro'>
                            <p>Seleccionar Responsables</p>
                            <div className='caja-select-input'>
                                <div className='dato'>
                                    <label>Trabajador</label>
                                    <Dropdown
                                        placeholder="Seleccciona trabajador"
                                        options={trabajadores}
                                        optionLabel={'fullName'}
                                        value={trabajadorSeleccionado}
                                        onChange={(e)=> setTrabajadorSeleccionado(e.value)}
                                        filter
                                    />
                                </div>
                                <div className='dato'>
                                    <label>Horas de trabajador</label>
                                    <InputText />
                                </div>
                                <div className='dato'>
                                    <Button className='btn-agregar' icon='pi pi-plus' label='Agregar Trabajador' />
                                </div>

                            </div>

                        </div>
                        <div className='repro'>
                            <label>Lista de los trabajadores responsables del reprocesamiento</label>
                            <TableIngredientes >
                                <Column
                                    // field={"materia_prima.nombre_materia"}
                                    header="Apellidos"
                                ></Column>
                                <Column header="Nombres"></Column>
                                <Column
                                    header="Horas"
                                ></Column>
                                <Column
                                    header="Eliminar"
                                    exportable={false}
                                    style={{ minWidth: "8rem" }}
                                ></Column>
                            </TableIngredientes>
                        </div>

                    </div>

                </Dialog>

            </Container>

        </>

    )
}
