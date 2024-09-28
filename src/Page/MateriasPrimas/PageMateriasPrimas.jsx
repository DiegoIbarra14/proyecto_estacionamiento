import React, { useEffect, useState, useRef } from "react";
import { Column } from "primereact/column";
import ListMateriaPrima from "../../Components/MateriaPrima/ListMateriaPrima";
import ListProveedor from "../../Components/MateriaPrima/ListProveedor";
import ListHistorial from "../../Components/MateriaPrima/ListHistorial";
import { ConfirmDialog } from "primereact/confirmdialog";
import { FileUpload } from "primereact/fileupload";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import PageMateriaIngreso from "./PageMateriaIngreso";
import "./pageMateriasPrimas.css";
import Container from "../../Components/Container/Container";
import AuthUser from '../../AuthUser';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNotificaciones } from '../../NotificacionesContext';
import { RadioButton } from "primereact/radiobutton";
import { DataTable } from "primereact/datatable";
import { InputTextarea } from "primereact/inputtextarea";
import { useDispatch } from "react-redux";
import { logout } from "../../reducers/authSlices";

import useFormValidation from "../../hooks/useFormValidation";
import { MultiSelect } from 'primereact/multiselect';
import { InputNumber } from "primereact/inputnumber";

import InputInteger from "../../Components/General/Inputs/InputNumberInteger/InputInteger";
import schemaMateriaPrima from "../../validationRules/MateriasPrimas/MateriaPrima";
import useValidation from "../../hooks/useValidation";
import schemaMateriaPrimaIngresos from "../../validationRules/MateriasPrimas/MateriaPrimaIngresos";
import InputDecimal from "../../Components/General/Inputs/InputNumberDecimal/InputDecimal";
import { materiaPrimaService } from "../../Services/MateriaPrimaService";
import TextTrimmer from "../../Components/General/TextTrimmer";
export default function PageMateriasPrimas() {
  const [Desabilitar, setDesabilitar] = useState(false)
  const { http, getToken, deleteToken } = AuthUser();
  const toast = useRef(null);
  const [my, setMy] = useState(null);
  const [unidadesMedidas, setUnidadesMedidas] = useState([]);
  const [preguntaUno, setPreguntaUno] = useState(null);
  const [preguntaDos, setPreguntaDos] = useState(null);
  const [selectedMateria, setSelectedMateria] = useState(null);
  const { errors: errorsMateriaPrima, validate:
    validateMateriPrima, clearFieldError: clearFieldErrorMateriaPrima
    , clearAllFieldsError: clearAllFieldsErrorMP }
    = useValidation(schemaMateriaPrima)

  const addUnidadMedida = (nuevaUnidad) => {
    const nuevaListaUnidades = [...unidadesMedidas, nuevaUnidad];
    setUnidadesMedidas(nuevaListaUnidades);
  };
  const { errors: errorsMateriaPrimaIngreso, validate:
    validateMateriPrimaIngreso, clearFieldError: clearFieldErrorMateriaPrimaIngreso
    , clearAllFieldsError: clearAllFieldsErrorMPIngreso } =
    useValidation(schemaMateriaPrimaIngresos)

  const [correo, setCorreo] = useState({
    id: 0,
    correo: '',
    tipo_correo: 1
  });
  const [presentaciones, setPresentaciones] = useState([]);
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [materiaProveedores, setMateriaProveedores] = useState([]);
  const [dataExport, setDataExport] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [proveedor, setProveedor] = useState({
    id: 0,
    tipo_documento: null,
    numero_documento: "",
    tipo_documento_id: null,
    razon_social: "",
    direccion: "",
    telefono: "",
    contacto: "",
    correo: "",
  });
  const [materiaIngreso, setMateriaIngreso] = useState({
    materia_proveedor_id: null,
    fecha_vencimiento: null,
    fecha_emision: null,
    fecha_ingreso: null,
    estado_ingreso: 1,
    lote_interno: null,
    costo_materia_prima: null,
    lote_produccion: null,
    cantidad: null,
  });

  const [materiaPrima, setMateriaPrima] = useState({
    id: 0,
    unidad_medida: null,
    nombre_materia: "",
    unidad_medida_id: null,
    presentacion: "",
    presentacion_id: null,
    cantidad: 0,
    cantidad_minima: "",
    documento_calidad: ""
  });
  const [materiaProveedor, setMateriaProveedor] = useState({
    materia_prima_id: materiaPrima.id,
    materia_prima: materiaPrima,
    id: 0,
    proveedor_id: null,
    proveedor: "",
    cantidad: "null",
  });

  const [visibleCreate, setVisibleCreate] = useState(false);
  const [visibleCreateMateriaProveedor, setVisibleCreateMateriaProveedor] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleEditMateriaProveedor, setVisibleEditMateriaProveedor] = useState(false);
  const [visibleEditMateriaIngreso, setVisibleEditMateriaIngreso] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleDeleteMateriaProveedor, setVisibleDeleteMateriaProveedor] = useState(false);
  const [visibleDeleteHistorial, setVisibleDeleteHistorial] = useState(false);
  const [visibleMateriaProveedor, setVisibleMateriaProveedor] = useState(false);
  const [visibleHistorial, setVisibleHistorial] = useState(false);
  const [select, setSelect] = useState(null);
  const [selectMateriaProveedor, setSelectMateriaProveedor] = useState(null);
  const [selectHistorial, setSelectHistorial] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [globalFilterProveedor, setGlobalFilterProveedor] = useState(null);
  const [globalFilterHistorial, setGlobalFilterHistorial] = useState(null);
  const dispatch = useDispatch()
  const [visibleEditDialog, setVisibleEditDialog] = useState(false);
  // const { values: valuesMateriaPrima, handleChange: handleChangeMateriaPrima,
  //   validate: validateValueMateriaPrima, errors: errorsMateriaPrima,
  //   cleanValues: cleanValuesMateriaPrima
  //   , setErrors: setErrorsMateriaPrima, setValues: setValuesMateriaPrima } = useFormValidation(initialValuesMateriaPrima, materiaPrimaValidationRules)
  const [visiblePdf, setVisiblePdf] = useState(false);

  //variables para generear el modal
  const [visibleExcel, setVisibleExcel] = useState(false);

  const handleClickOpenExcel = () => {
    setVisibleExcel(true);
  };



  const handleCloseExcel = () => {
    setVisibleExcel(false);
  };

  //guardar y exportar excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(materiasPrimas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Materias Primas");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const blob = new Blob([excelBuffer], { type: fileType });
    saveAs(blob, `materias_primas${fileExtension}`);
  };

  const getAllUnidadesMedidas = () => {
    http.get("/unidadesmedida/get")
      .then((response) => {
        setUnidadesMedidas(response.data.data);
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
  const getAllMateriasPrimas = async () => {
    // http.get("/materiasprimas/get")
    //   .then((response) => {
    //     setMateriasPrimas(response.data.data);
    //     console.log(response.data.data);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    let data = await materiaPrimaService.getAllMateriaPrima()
    console.log("datass", data)
    setMateriasPrimas(data)
  };
  useEffect(() => {
    getAllMateriasPrimas();
  }, []);


  const getAllMateriasProveedores = (id) => {
    http.get(`/materiaproveedor/getproveedores/${id}`)
      .then((response) => {
        setMateriaProveedores(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllProveedores = () => {
    http.get('/proveedores/get')
      .then((response) => {
        setProveedores(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllHistorial = (id) => {
    http.get(`/materiasprimas/historia/${id}`)
      .then((response) => {
        setHistorial(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCorreoMateria = () => {
    http.get("/mails/get/1")
      .then((response) => {
        setCorreo(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getCorreoMateria();
    getAllUnidadesMedidas();
    getAllMateriasPrimas();
    getAllPresentaciones();
  }, [setUnidadesMedidas]);

  // useEffect(() => {
  //   handleMy();
  // }, []);

  // const handleMy = async () => {
  //   try {
  //     const response = await http.post("/my");
  //     setMy(response.data);
  //     if (!response.data.status) {

  //     } else {
  //       dispatch(logout())
  //       // deleteToken();
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  const proveedoresConContacto = proveedores.map((proveedor) => {
    if (!proveedor.contactos || proveedor.contactos.length === 0) {
      return {
        ...proveedor,
        contactos: [{ contacto: "Este proveedor no cuenta con contacto(s)", disabled: true }]
      };
    }
    return proveedor;
  });
  const itemTemplateDropdownProveedor = (option) => (
    <div>
      <span>{option.contacto} </span>
      <TextTrimmer style={{ color: "#04638a", display: "inline" }} maxLength={30} text={option.comentario ? `| ${option.comentario}` : ""}></TextTrimmer>

    </div>
  )
  //necesario para el crud
  const confirmDeleteMateriaPrima = (_materiaPrima) => {
    setMateriaPrima(_materiaPrima);
    setVisibleDelete(true);
  };

  const handleEditClick = (materia) => {
     const unidadMedidaId = materia?.unidad_medida?.id || null; 

    setMateriaPrima({
      ...materia,
      unidad_medida_id: unidadMedidaId, 
      presentacion_id: materia?.presentacion?.id || null, 
    });
    setSelectedMateria(materia); 
    setVisibleEditDialog(true); 
    
  };
  const confirmAsignacionProveedor = (_materiaPrima) => {
    setMateriaPrima(_materiaPrima);
    getAllProveedores();
    setMateriaProveedor({
      proveedor_id: null,
      proveedor: "",
      materia_prima_id: _materiaPrima.id,
      materia_prima: _materiaPrima,
      cantidad: "null",
    });
    getAllMateriasProveedores(_materiaPrima.id);
    setVisibleMateriaProveedor(true);
  };

  const confirmDeleteMateriaProveedor = (materiaProveedor) => {
    setMateriaProveedor(materiaProveedor);
    setVisibleDeleteMateriaProveedor(true);
  };

  const confirmEditMateriaProveedor = (materiaProveedor) => {
    setMateriaProveedor(materiaProveedor);
    //setVisibleEditMateriaProveedor(true);
  };

  //MATERIAL INGRESO
  const confirmEditMateriaIngreso = (materiaProveedor) => {
    setMateriaProveedor(materiaProveedor);
    setProveedor(materiaProveedor.proveedor);
    setVisibleEditMateriaIngreso(true);
  };

  //HISTORIAL
  const confirmDeleteHistoria = (materiaIngreso) => {
    setMateriaIngreso(materiaIngreso);
    setVisibleDeleteHistorial(true);
  };
  const confirmHistorial = (materia_Prima) => {
    getAllHistorial(materia_Prima.id);
    setMateriaPrima(materia_Prima);
    setVisibleHistorial(true);
  };


  const actionBodyTemplateDelete = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => confirmDeleteMateriaPrima(rowData)}
        />
      </React.Fragment>
    );
  };

  const actionBodyTemplateEditMateriaProveedor = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmEditMateriaProveedor(rowData)}
        />
      </React.Fragment>
    );
  };

  //MATERIA INGRESO
  const actionBodyTemplateMateriaIngreso = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-angle-double-down"
          className="p-button-rounded p-button-warning "
          onClick={() => {
            confirmEditMateriaIngreso(rowData);
            cleanMateriaIngreso();
          }}
        />
      </React.Fragment>
    );
  };
  //HISTORIAL

  // Columna Merma Historial

  const [mermaHistorial, setMermaHistorial] = useState(null);
  const getHistorialMerma = (id) => {
    http.get(`historial/merma/${id}`)
      .then((response) => {
        setMermaHistorial(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //api para registrar merma -----------
  const [mensaje, setMensaje] = useState("");
  const registrarMerma = () => {
    const data = {
      "motivo_merma": causa_merma,
      "cantidad_merma": cantidad_merma
    }
    if (causa_merma != "" & cantidad_merma != 0) {
      http.post(`materia/create/merma/${materia_ingreso.id}`, data)
        .then((response) => {
          showToast(
            "success",
            "Merma registrada",
            `Se registró merma en Lote ${materia_ingreso.lote_produccion} correctamente`
          );
          hideDialogMerma();
        })
        .catch((error) => {
          console.log(error);
          setMensaje("La cantidad debe ser un número entero");
        });

    }
    else {
      setMensaje("Registra causa y cantidad de merma");
    }
  }

  const [materia_ingreso, setMateria_Ingreso] = useState(null);
  const [visibleMerma, setVisibleMerma] = useState(false);
  const [causa_merma, setCausaMerma] = useState("");
  const [cantidad_merma, setCantidadMerma] = useState("0");
  const [visibleHstMerma, setVisibleHstMerma] = useState(false);

  const [headerDialogMerma, setHeaderDialogMerma] = useState("")
  const [footerButton, setFooterButton] = useState("")

  const abrirRegistrarMerma = (data, cabecera, pieBoton) => {
    setMateria_Ingreso(data);
    setVisibleMerma(true);
    setHeaderDialogMerma(cabecera);
    setFooterButton(pieBoton);
  }

  //Columna Merma de Historial de Materia Prima
  const botonesMerma = (data) => {
    console.log("data-me", data)
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
        <Button
          onClick={() => abrirRegistrarMerma(data, "Registrar Merma", "Registrar")}
          tooltip="Registrar Merma"
          icon='pi pi-exclamation-circle'
          className="p-button-rounded p-button-danger" />
        <Button
          onClick={() => { setVisibleHstMerma(true); setMateria_Ingreso(data); getHistorialMerma(data.id); }}
          tooltip="Historial Merma"
          icon='pi pi-info'
          className="p-button-rounded p-button-warning " />

      </div>
    )
  }

  //funciones para actualizar merma
  const abrirEditarMerma = (data, cabecera, pieBoton) => {
    setMermaObject(data);
    setVisibleMerma(true);
    setHeaderDialogMerma(cabecera);
    setFooterButton(pieBoton);
    setCausaMerma(data.motivo_merma);
    setCantidadMerma(data.cantidad_merma);
    setMateria_Ingreso({ ...materia_ingreso, stock: data.cantidad_total })

  }

  const [mermaObject, setMermaObject] = useState(null);
  const actualizarMerma = () => {
    const data = {
      "motivo_merma": causa_merma,
      "cantidad_merma": cantidad_merma
    }
    if (causa_merma != "" & cantidad_merma != "0") {
      http.put(`materia/merma/update/${mermaObject.id}`, data)
        .then((response) => {
          showToast(
            "success",
            "Merma actualizada",
            `Se actualizó merma en Lote ${materia_ingreso.lote_produccion} correctamente`
          );
          getHistorialMerma(materia_ingreso.id);
          hideDialogMerma();
        })
        .catch((error) => {
          console.log(error);
          setMensaje("La cantidad debe ser un número entero");
        });

    }
    else {
      setMensaje("Registra causa y cantidad de merma");
    }
  }
  //función para eliminar merma
  const [visibleDeleteMerma, setVisibleDeleteMerma] = useState(false);
  const deleteMerma = () => {
    http.delete(`materia/merma/delete/${mermaObject.id}`)
      .then((response) => {
        showToast(
          "success",
          "Merma Eliminada",
          `Se eliminó correctamente la merma del lote ${materia_ingreso.lote_produccion}`
        );
        getHistorialMerma(materia_ingreso.id);
        setVisibleDeleteMerma(false);
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "error",
          "Merma no eliminada",
          `No se eliminó merma en ${materia_ingreso.lote_produccion}`
        );
      });
  }
  //columna de Acciones dentro de Historial de Merma
  const botonesAccionMerma = (data) => {
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
        <Button
          onClick={() => abrirEditarMerma(data, "Editar Merma", "Editar")}
          tooltip="Editar"
          icon='pi pi-pencil'
          className="p-button-rounded p-button-success" />
        <Button
          onClick={() => { setMermaObject(data); setVisibleDeleteMerma(true) }}
          tooltip="Eliminar"
          icon='pi pi-trash'
          className="p-button-rounded p-button-danger " />
      </div>
    )
  }

  const actionBodyTemplateHistorial = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-history"
          className="p-button-rounded p-button-warning "
          onClick={() => confirmHistorial(rowData)}
        />
      </React.Fragment>
    );
  };

  const actionBodyTemplateDeleteMateriaProveedor = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => confirmDeleteMateriaProveedor(rowData)}
        />
      </React.Fragment>
    );
  };

  const actionBodyTemplateDeleteHistorial = (rowData) => {
    return (
      <>
        {
          rowData.estado_eliminacion == 1 ? (
            <Button
              icon="pi pi-trash"
              className="p-button-rounded p-button-danger "
              onClick={() => confirmDeleteHistoria(rowData)}
            />
          )
            : (
              <Button
                icon="pi pi-trash"
                tooltip="No se puede eliminar este ingreso porque ha sido usado en una producción "
                className="p-button-rounded"
                style={{ backgroundColor: "#EDACAC", border: "none" }}
              />
            )
        }
      </>
    )
  }
  const actionBodyTemplateMateriaProveedor = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-user"
          className="p-button-rounded p-button-success"
          onClick={() => confirmAsignacionProveedor(rowData)}
        ></Button>
      </React.Fragment>
    );
  };



  const actionBodyTemplateDocumento = (rowData) => (
    <Button
      className={"p-button-rounded p-button-help"}
      icon={rowData.documento_calidad === null ? "pi pi-eye-slash" : "pi pi-eye"}
      disabled={rowData.documento_calidad === null ? true : false}
      onClick={() => handleDialogVer(rowData)}
    />
  );



  const handleDialogVer = (rowData) => {
    console.log(rowData)
    setMateriaPrima(rowData);
    setVisiblePdf(true);
  };

  //función para limpiar y ocultar el modal de registro merma
  const hideDialogMerma = () => {
    setVisibleMerma(false);
    setCantidadMerma("0");
    setCausaMerma("");
    setMensaje("");
    getAllHistorial(materiaPrima.id);
  }
  const ocultarHistorialMerma = () => {
    setVisibleHstMerma(false);
    setMateria_Ingreso(null);
    setMermaHistorial(null);
    getAllHistorial(materiaPrima.id);
  }

  //para el modal de crear
  const hideDialog = () => {
    //setSubmitted(false);
    setVisibleCreate(false);
    setVisibleEdit(false);
    setVisibleEditDialog(false);
    setVisibleMateriaProveedor(false);
    clearAllFieldsErrorMP()
  };

  const hideDialogEdit = () => {
    //setSubmitted(false);
    setVisibleCreate(false);
    setVisibleEdit(false);
    setVisibleEditDialog(false);
    setVisibleMateriaProveedor(false);
  };

  const hideDialogProveedor = () => {
    setVisibleCreate(false);
    setVisibleEdit(false);
    setVisibleMateriaProveedor(false);
  };

  const hideDialogMateriaProveedor = () => {
    setVisibleCreateMateriaProveedor(false);
    setVisibleDeleteMateriaProveedor(false);
    //setVisibleEditMateriaProveedor(false);
    setVisibleEditMateriaIngreso(false);
  };

  const hideDialogHistorial = () => {
    setVisibleDeleteHistorial(false);
    setVisibleHistorial(false);
    getAllMateriasPrimas();
  };

  const productDialogFooter = (
    <React.Fragment>
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
        
        onClick={() => {
          if (materiaPrima.nombre_materia == 0) {
            showToast(
              "error",
              "Error al crear",
              "Debe ingresar un nombre de Materia Prima"
            );
          } else if (materiaPrima.cantidad_minima <= 0) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe ingresar un monto minimo de materia prima"
            );
          }
          else if (materiaPrima.unidad_medida_id == null) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe seleccionar una unidad de medida"
            );
          } else if (materiaPrima.presentacion_id == null) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe seleccionar una presentación"
            );
          }

          else {
            handleSubmitCreate();
            hideDialog();

          }
        }}
        disabled={Desabilitar}

      />
    </React.Fragment>
  );

  const MateriaPrimaDialogFooterUpdate = (
    <React.Fragment>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-danger"
        onClick={hideDialogEdit}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        className="p-button-success"
        onClick={() => {
          console.log("Unidad de medida: ", materiaPrima.unidad_medida);
          if (materiaPrima.nombre_materia == 0) {
            showToast(
              "error",
              "Error al crear",
              "Debe ingresar un nombre de Materia Prima"
            );
          } else if (materiaPrima.cantidad_minima <= 0) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe ingresar un monto minimo de materia prima"
            );
          } else if (materiaPrima.unidad_medida_id == null) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe seleccionar una unidad de medida"
            );
          } else if (materiaPrima.presentacion_id == null) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe seleccionar una presentación"
            );
          } else {
            
            handleSubmitUpdate();
            //hideDialogEdit();
            setVisibleEditDialog(false);
            console.log("data: ", materiaPrima);
          } 
        }}
      />
    </React.Fragment>
  );
  // FOOTER TABLA MATERIA PROVEEDOR
  const MateriaProveedorDialgogFooterAsignar = (
    <React.Fragment>
      <Button
        label="Cerrar"
        icon="pi pi-times"
        className="p-button-danger"
        onClick={hideDialogProveedor}
      />
    </React.Fragment>
  );
  // FOOTER TABLA HISTORIAL
  const HistorialDialgogFooterAsignar = (
    <React.Fragment>
      <Button
        label="Cerrar"
        icon="pi pi-times"
        className="p-button-danger"
        onClick={hideDialogHistorial}
      />
    </React.Fragment>
  );

  const productDialogCreateMateriaProveedor = (
    <React.Fragment>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-danger"
        onClick={hideDialogMateriaProveedor}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        className="p-button-success"
        onClick={() => {
          if (materiaProveedor.proveedor === null) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe ingresar un proveedor"
            );
          } else {
            handleSubmitCreateMateriaProveedor();
            hideDialogMateriaProveedor();
          }
        }}
      />
    </React.Fragment>
  );

  const productDialogEditMateriaProveedor = (
    <React.Fragment>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-danger"
        onClick={() => {
          hideDialogMateriaProveedor();
        }}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        className="p-button-success"
        onClick={() => {
          if (materiaPrima.nombre_materia == 0) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe ingresar un nombre de Materia Prima"
            );
          } else {
            handleSubmitUpdateMateriaProveedor();
            hideDialogMateriaProveedor();
          }
        }}
      />
    </React.Fragment>
  );

  //MATERIA INGRESO

  const productDialogCreateMateriaIngreso = (
    <React.Fragment>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-danger"
        onClick={() => {
          hideDialogMateriaProveedor();
          cleanMateriaIngreso();
        }}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        className="p-button-success"
        onClick={() => {
          if (materiaProveedor.proveedor === null) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe ingresar un proveedor"
            );
          }
          else {
            handleSubmitCreateMateriaIngreso();
          }
        }}
      />
    </React.Fragment>
  );
  const handleChangeUnidadMedida = (e) => {
    const selectedUnidad = unidadesMedidas.find((unidad) => unidad.id === e.value); // Busca el objeto completo por su ID
  
    setMateriaPrima({
      ...materiaPrima,
      unidad_medida: selectedUnidad, // Guarda el objeto completo
      unidad_medida_id: selectedUnidad?.id, // Guarda también el ID del objeto
    });
  };
  useEffect(() => {
    if (materiaPrima.unidad_medida && materiaPrima.unidad_medida.id) {
      setMateriaPrima((prevState) => ({
        ...prevState,
        unidad_medida_id: prevState.unidad_medida.id, // Asigna el id de unidad_medida a unidad_medida_id
      }));
    }
  }, [materiaPrima.unidad_medida]); // Se ejecuta cada vez que unidad_medida cambia
    
  useEffect(() => {
    if (materiaPrima.presentacion && materiaPrima.presentacion.id) {
      setMateriaPrima((prevState) => ({
        ...prevState,
        presentacion_id: prevState.presentacion.id,
      }));
    }
  }, [materiaPrima.presentacion]);
  
  const handleChangePresentacion = (e) => {
    const selectedPresentacion = presentaciones.find((presentacion) => presentacion.id === e.value);
    setMateriaPrima({
      ...materiaPrima,
      presentacion: selectedPresentacion,
      presentacion_id: selectedPresentacion?.id,
    });
  };
  const handleChangePresentacionCreate = (e) => {
    console.log("Presentación seleccionada:", e.value); // Revisa el valor que estás obteniendo
    setMateriaPrima({
      ...materiaPrima,
      presentacion: e.value,
      presentacion_id: e.value.id
    });
  };
  const handleChangeUnidadMedidaCreate = (e) => {
    console.log("Unidad seleccionada:", e.value); // Revisa el valor que estás obteniendo
    setMateriaPrima({
      ...materiaPrima,
      unidad_medida: e.value,
      unidad_medida_id: e.value.id
    });
  };
  
  const handleChangeNombreMateria = (e) => {
  setMateriaPrima(prevState => ({
    ...prevState, // Mantén todas las demás propiedades
    nombre_materia: e.target.value // Solo actualiza el nombre
  }));
};

// Al actualizar la cantidad mínima
const handleChangeCantidadMinima = (e) => {
  setMateriaPrima(prevState => ({
    ...prevState, // Mantén todas las demás propiedades
    cantidad_minima: e.target.value // Solo actualiza la cantidad mínima
  }));
};

  const handleChangeCorreo = (e) => {
    setCorreo({
      tipo_correo: 1,
      correo: e.target.value
    });
  };

  const cleanMateriaPrima = () => {
    setMateriaPrima({
      id: 0,
      nombre_materia: "",
      unidad_medida: null,
      unidad_medida_id: null,
      presentacion: null,
      presentacion_id: null,
      cantidad: 0,
      cantidad_minima: "",
      documento_calidad: ""
    });
  };

  const cleanProveedor = () => {
    setProveedor({
      id: 0,
      tipo_documento: null,
      numero_documento: "",
      tipo_documento_id: null,
      razon_social: "",
      direccion: "",
      telefono: "",
      contacto: "",
      correo: "",
    });
  };

  const handleChangeProveedor = (e) => {
    console.log("add-proveedor",e)
    setMateriaProveedor({
      id: materiaProveedor.id,
      materia_prima_id: materiaProveedor.materia_prima_id,
      materia_prima: materiaProveedor.materia,
      proveedor: e.value,
      proveedor_id: e.value.proveedor_id != null ? e.value.proveedor_id :null,
      cantidad: null,
    });
    
  };

  const cleanMateriaProveedor = () => {
    setMateriaProveedor({
      id: 0,
      materia_prima_id: materiaPrima.id,
      materia_prima: materiaPrima,
      proveedor_id: null,
      proveedor: null,
      cantidad: null,
    });
  };

  //CHANGE MATERIA INGRESO
  const handleChangeQuestionOne = (e) => {
    if (e.target.value == "si") {
      setMateriaIngreso(prevState => ({ ...prevState, fecha_emision: "" }))
    } else {
      setMateriaIngreso(prevState => ({ ...prevState, fecha_emision: null }))
    }
    setPreguntaUno(e.target.value)
    if (errorsMateriaPrimaIngreso?.hasOwnProperty("question_one")) {
      clearFieldErrorMateriaPrimaIngreso("question_one")
    }


  }
  const handleChangeQuestionTwo = (e) => {
    if (e.target.value == "si") {
      setMateriaIngreso(prevState => ({ ...prevState, fecha_vencimiento: "" }))
    } else {
      setMateriaIngreso(prevState => ({ ...prevState, fecha_vencimiento: null }))
    }
    setPreguntaDos(e.target.value)
    if (errorsMateriaPrimaIngreso?.hasOwnProperty("question_two")) {
      clearFieldErrorMateriaPrimaIngreso("question_two")
    }

  }

  const handleChangeFechaVencimiento = (e) => {
    setMateriaIngreso({
      materia_proveedor_id: materiaProveedor.id,
      fecha_vencimiento: e.target.value,
      fecha_emision: materiaIngreso.fecha_emision,
      fecha_ingreso: materiaIngreso.fecha_ingreso,
      estado_ingreso: "1",
      lote_interno: materiaIngreso.lote_interno,
      costo_materia_prima: materiaIngreso.costo_materia_prima,
      lote_produccion: materiaIngreso.lote_produccion,
      cantidad: materiaIngreso.cantidad,
    });
    if (errorsMateriaPrimaIngreso.hasOwnProperty("fecha_vencimiento")) {
      clearFieldErrorMateriaPrimaIngreso("fecha_vencimiento")
    }

  };
  const handleChangeFechaEmision = (e) => {
    setMateriaIngreso({
      materia_proveedor_id: materiaProveedor.id,
      fecha_vencimiento: materiaIngreso.fecha_vencimiento,
      fecha_emision: e.target.value,
      fecha_ingreso: materiaIngreso.fecha_ingreso,
      estado_ingreso: "1",
      lote_interno: materiaIngreso.lote_interno,
      costo_materia_prima: materiaIngreso.costo_materia_prima,
      lote_produccion: materiaIngreso.lote_produccion,
      cantidad: materiaIngreso.cantidad,
    });
    if (errorsMateriaPrimaIngreso.hasOwnProperty("fecha_emision")) {
      clearFieldErrorMateriaPrimaIngreso("fecha_emision")
    }

  };
  const handleChangeFechaIngreso = (e) => {
    setMateriaIngreso({
      materia_proveedor_id: materiaProveedor.id,
      fecha_vencimiento: materiaIngreso.fecha_vencimiento,
      fecha_emision: materiaIngreso.fecha_emision,
      fecha_ingreso: e.target.value,
      estado_ingreso: "1",
      lote_interno: materiaIngreso.lote_interno,
      costo_materia_prima: materiaIngreso.costo_materia_prima,
      lote_produccion: materiaIngreso.lote_produccion,
      cantidad: materiaIngreso.cantidad,
    });
    if (errorsMateriaPrimaIngreso.hasOwnProperty("fecha_ingreso")) {
      clearFieldErrorMateriaPrimaIngreso("fecha_ingreso")
    }

  };
  const handleChangeLoteInterno = (e) => {
    setMateriaIngreso({
      materia_proveedor_id: materiaProveedor.id,
      fecha_vencimiento: materiaIngreso.fecha_vencimiento,
      fecha_emision: materiaIngreso.fecha_emision,
      fecha_ingreso: materiaIngreso.fecha_ingreso,
      estado_ingreso: "1",
      lote_interno: e.target.value,
      costo_materia_prima: materiaIngreso.costo_materia_prima,
      lote_produccion: materiaIngreso.lote_produccion,
      cantidad: materiaIngreso.cantidad,
    });
    if (errorsMateriaPrimaIngreso.hasOwnProperty("lote_interno")) {
      clearFieldErrorMateriaPrimaIngreso("lote_interno")
    }

  };
  const handleChangeCosto = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value) || value < 0) {
      setMateriaIngreso({
        materia_proveedor_id: materiaProveedor.id,
        fecha_vencimiento: materiaIngreso.fecha_vencimiento,
        fecha_emision: materiaIngreso.fecha_emision,
        fecha_ingreso: materiaIngreso.fecha_ingreso,
        estado_ingreso: "1",
        lote_interno: materiaIngreso.lote_interno,
        costo_materia_prima: "",
        lote_produccion: materiaIngreso.lote_produccion,
        cantidad: materiaIngreso.cantidad,
      });
    }
    else {
      setMateriaIngreso({
        materia_proveedor_id: materiaProveedor.id,
        fecha_vencimiento: materiaIngreso.fecha_vencimiento,
        fecha_emision: materiaIngreso.fecha_emision,
        fecha_ingreso: materiaIngreso.fecha_ingreso,
        estado_ingreso: "1",
        lote_interno: materiaIngreso.lote_interno,
        costo_materia_prima: e.target.value,
        lote_produccion: materiaIngreso.lote_produccion,
        cantidad: materiaIngreso.cantidad,
      });
      clearFieldErrorMateriaPrimaIngreso("costo_materia_prima")

    }

  };
  const handleChangeLoteProduccion = (e) => {
    setMateriaIngreso({
      materia_proveedor_id: materiaProveedor.id,
      fecha_vencimiento: materiaIngreso.fecha_vencimiento,
      fecha_emision: materiaIngreso.fecha_emision,
      fecha_ingreso: materiaIngreso.fecha_ingreso,
      estado_ingreso: "1",
      lote_interno: materiaIngreso.lote_interno,
      costo_materia_prima: materiaIngreso.costo_materia_prima,
      lote_produccion: e.target.value,
      cantidad: materiaIngreso.cantidad,
    });
    clearFieldErrorMateriaPrimaIngreso("lote_produccion")

  };
  const handleChangeCantidadIngreso = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value) || value < 0) {
      setMateriaIngreso({
        materia_proveedor_id: materiaProveedor.id,
        fecha_vencimiento: materiaIngreso.fecha_vencimiento,
        fecha_emision: materiaIngreso.fecha_emision,
        fecha_ingreso: materiaIngreso.fecha_ingreso,
        estado_ingreso: "1",
        lote_interno: materiaIngreso.lote_interno,
        costo_materia_prima: materiaIngreso.costo_materia_prima,
        lote_produccion: materiaIngreso.lote_produccion,
        cantidad: "",
      });

    }
    else {
      setMateriaIngreso({
        materia_proveedor_id: materiaProveedor.id,
        fecha_vencimiento: materiaIngreso.fecha_vencimiento,
        fecha_emision: materiaIngreso.fecha_emision,
        fecha_ingreso: materiaIngreso.fecha_ingreso,
        estado_ingreso: "1",
        lote_interno: materiaIngreso.lote_interno,
        costo_materia_prima: materiaIngreso.costo_materia_prima,
        lote_produccion: materiaIngreso.lote_produccion,
        cantidad: e.target.value,
      });
      clearFieldErrorMateriaPrimaIngreso("cantidad")
    }

  };
  const cleanMateriaIngreso = () => {
    setMateriaIngreso({
      materia_proveedor_id: materiaProveedor.id,
      fecha_vencimiento: null,
      fecha_emision: null,
      fecha_ingreso: null,
      estado_ingreso: 1,
      lote_interno: null,
      costo_materia_prima: null,
      lote_produccion: null,
      cantidad: null,
    });
    setPreguntaUno(null)
    setPreguntaDos(null)
    clearAllFieldsErrorMPIngreso()
  };

  const reject = () => {
    toast.current.show({
      severity: "info",
      summary: "Rechazada",
      detail: "No se realizo ninguna acción",
      life: 3000,
    });
  };

  const rejectMateriaProveedor = () => {
    toast.current.show({
      severity: "info",
      summary: "Rechazada",
      detail: "No se realizo ninguna acción",
      life: 3000,
    });
  };

  const rejectHistorial = () => {
    toast.current.show({
      severity: "info",
      summary: "Rechazada",
      detail: "No se realizo ninguna acción",
      life: 3000,
    });
  };

  const createMateriaPrima = async () => {
    let isSend = await materiaPrimaService.createMateria(materiaPrima)
    if (isSend) {
      getAllMateriasPrimas()
      showToast(
        "success",
        "Materia Prima Creado",
        `Se creo Materia Prima ${materiaPrima.nombre_materia} correctamente`
      )
    } else {
      showToast(
        "danger",
        "Materia Prima No Creado",
        `No Se creo Materia Prima ${materiaPrima.nombre_materia}`
      );
    }
  }
  const clearErrorMateriaPrima = (field) => {
    clearFieldErrorMateriaPrima(field)
  }

  const handleSubmitCreate = () => {
    let isvalidate = validateMateriPrima(materiaPrima)
    if (isvalidate) {
      createMateriaPrima()
    }
  };

  const updateMateriaPrima = async () => {
    const filteredMateriaPrima = {
      id: materiaPrima.id,
      nombre_materia: materiaPrima.nombre_materia,
      cantidad_minima: materiaPrima.cantidad_minima, 
      unidad_medida_id: materiaPrima.unidad_medida_id, 
      presentacion_id: materiaPrima.presentacion_id, 
      documento_calidad: materiaPrima.documento_calidad, 
    };
  
    let isSend = await materiaPrimaService.updateMateriaPrima(filteredMateriaPrima);
  
    console.log("revisando datos");
    if (isSend) {
      getAllMateriasPrimas();
      console.log(filteredMateriaPrima);
      showToast(
        "success",
        "Materia Prima Editada",
        `Se Edito Materia Prima ${materiaPrima.nombre_materia} correctamente`
      );
    } else {
      console.log("datos no enviados");
      showToast(
        "error",
        "Materia Prima no Creada",
        `No Se creó Materia Prima ${materiaPrima.nombre_materia}`
      );
    }
  };
  

  const handleSubmitUpdate = () => {
    if (!materiaPrima.unidad_medida_id) {
      showToast("error", "Error de ingreso", "Debe seleccionar una unidad de medida válida");
      return;
    }
    
    let isvalidate = validateMateriPrima(materiaPrima);
    if (isvalidate) {
      updateMateriaPrima();
    }
  };

  const prepareDataMateriaProveedor = () => {
    let newData = {
      id: materiaProveedor.id,
      proveedor_id: materiaProveedor.proveedor_id,
      contacto: materiaProveedor.proveedor.contacto,
      correo: materiaProveedor.proveedor.correo,
      telefono: materiaProveedor.proveedor.telefono,
      materia_prima_id: materiaProveedor.materia_prima_id
    }
    return newData
  }

  const handleSubmitCreateMateriaProveedor = () => {
    const data = prepareDataMateriaProveedor()
    http.post(`/materiaproveedor/create`, data)
      .then((response) => {
        showToast("success", "Proveedor añadido", `Se añadió correctamente`);
        getAllMateriasProveedores(materiaPrima.id);
      })
      .catch((error) => {
        console.log(error);
        showToast("error", "Materia Prima no Eliminado", `No se pudo crear`);
      });
  };

  const handleSubmitUpdateMateriaProveedor = () => {
    http.put(`/materiaproveedor/update/${materiaProveedor.id}`, materiaProveedor)
      .then((response) => {
        showToast("success", "Proveedor actualizado", `Se editó correctamente`);
        getAllMateriasProveedores(materiaPrima.id);
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "error",
          "Proveedor no actualizado",
          `No se editó correctamente`
        );
      });
  };

  const handleSubmitDelete = () => {
    http.delete(`/materiasprimas/delete/${materiaPrima.id}`)
      .then((response) => {
        showToast(
          "success",
          "Materia Prima Eliminado",
          `Se elimino correctamente la Materia Prima ${materiaPrima.nombre_materia}`
        );
        getAllMateriasPrimas();
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "error",
          "Materia Prima no Eliminado",
          `No Se creo Materia Prima ${materiaPrima.nombre_materia}`
        );
      });
  };

  const handleSubmitDeleteMateriaProveedor = () => {
    http.delete(`/materiaproveedor/delete/${materiaProveedor.id}`)
      .then((response) => {
        showToast("success", "Proveedor Elminado", `Se elimino correctamente`);
        getAllMateriasProveedores(materiaPrima.id);
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "error",
          "Proveedor no eliminado",
          `No se eliminó correctamente`
        );
      });
  };

  const handleSubmitCreateCorreo = (data) => {
    http.post("/mails/create", data)
      .then((response) => {
        showToast("success", "Correo Grabado", `Se Grabo correctamente el correo`);
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "error",
          "Proveedor no eliminado",
          `No se eliminó correctamente`
        );
      });
  };

  //FILEUPLOAD

  const headerTemplate = (options) => {
    const { className, chooseButton } = options;
    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}
      </div>
    );
  };
  const onTemplateRemove = (file, callback) => {
    setMateriaPrima((prevState) => ({
      ...prevState,
      documento_calidad: null, 
    }));
    callback();
  };
  const ExisteDocumentoTemplate = (_materia_Prima) => {
    return (
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", width: "65%" }}>
          <i className="pi pi-file-pdf" style={{ color: "green" }} />

          <span
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
              marginLeft: "1rem",
            }}
          >
            {`Ficha Técnica de ${materiaPrima?.nombre_materia}`}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <div style={{ width: "35%" }}></div>
      </div>
    );
  };
  const getFileNameFromUrl = (url) => {
    return url.split('/').pop(); // Extrae el nombre del archivo desde la URL
  };

  
  const emptyTemplate = () => {
    if (materiaPrima.documento_calidad) {
      const fileName = getFileNameFromUrl(materiaPrima.documento_calidad);
      return (
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", width: "65%" }}>
            <i className="pi pi-file-pdf" style={{ color: "green" }} />
            <span
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
                marginLeft: "1rem",
              }}
            >
              <a
                href={materiaPrima.documento_calidad}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "blue", textDecoration: "underline" }}
              >
                {fileName}
              </a>
              <small>{new Date().toLocaleDateString()}</small>
            </span>
          </div>
          <div style={{ width: "35%" }}></div>
        </div>
      );
    } else {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            border: "2px dashed #ccc",
            padding: "1rem",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            cursor: "pointer",
          }}
        >
          <i
            className="pi pi-file-pdf"
            style={{
              fontSize: "2em",
              borderRadius: "50%",
              backgroundColor: "var(--surface-b)",
              color: "var(--surface-d)",
              marginTop: "1rem",
              padding: "1rem",
            }}
          ></i>
          <span
            style={{
              fontSize: "1.0em",
              color: "var(--text-color-secondary)",
              margin: "1rem 2rem",
            }}
          >
            Arrastra o suelta un archivo aquí.
          </span>
        </div>
      );
    }
  };
  
  useEffect(() => {
    console.log('Valor de documento_calidad:', materiaPrima.documento_calidad);
  }, [materiaPrima.documento_calidad]);
  
  const chooseOptions = {
    icon: "pi pi-fw pi-images",
    iconOnly: false,
    label: "Seleccionar un archivo",
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  }

  const chooseOptionsEditar = {
    icon: "pi pi-file-pdf",
    iconOnly: false,
    label: "Editar archivo",
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  };

  const filtrarProveedores = (event) => {
    const filtro = event.query.toLowerCase();
    return proveedores.filter((proveedor) => {
      const contactosStr = proveedor.contactos.map(contacto => contacto.contacto.toLowerCase()).join(' ');
      return (
        proveedor.razon_social.toLowerCase().includes(filtro) ||
        contactosStr.includes(filtro)
      );
    });
  };
  const onTemplateClear = () => { };
  const itemTemplate = (file, props) => {
    return (
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", width: "65%" }}>
          <i className="pi pi-file-pdf"></i>
          <span
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
              marginLeft: "1rem",
              marginRight: "1rem",
              fontSize: "clamp(8px, 2vw, 15px)",
              paddingRight: "10px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <div style={{ width: "35%", display: "flex", flexDirection: "row", gap: "5px" }}>
          <Tag
            value={props.formatSize}
            severity="warning"
          />
          <Button
            type="button"
            icon="pi pi-times"
            style={{ borderRadius: "200px", padding: "0px 5px", background: "#EF4444", border: "none" }}
            onClick={() => onTemplateRemove(file, props.onRemove)}
          />
        </div>
      </div>
    );
  };

  const changeFile = (e) => {
    console.log('Nuevo archivo:', e?.files[0]);
    setMateriaPrima({
      id: materiaPrima.id,
      nombre_materia: materiaPrima.nombre_materia,
      unidad_medida: materiaPrima.unidad_medida,
      unidad_medida_id: materiaPrima.unidad_medida_id,
      presentacion: materiaPrima.presentacion,
      presentacion_id: materiaPrima.presentacion_id,
      cantidad: materiaPrima.cantidad,
      cantidad_minima: materiaPrima.cantidad_minima,
      documento_calidad: e?.files[0],
    });
  };

  //PDF

  const hideDialogPDF = () => {
    setVisiblePdf(false);
  }

  const dialogHeader = (
    <>

      <span>{`Ficha Técnica de ${materiaPrima.nombre_materia}`}</span>

    </>
  );

  const dialogFooter = (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          label="Cerrar"
          icon="pi pi-times"
          className="p-button-danger "
          onClick={hideDialogPDF}
        />
      </div>
    </>
  );



  const dialogBody = (
    <React.Fragment>
      <iframe src={materiaPrima?.documento_calidad} width="100%" height="100%" title="PDF Viewer"></iframe>
    </React.Fragment>
  );

  //MATERIA INGRESO
  const prepareDataMateriaPrimaIngreso = () => {
    let newData = { ...materiaIngreso, "question_one": preguntaUno, "question_two": preguntaDos }
    return newData
  }

  const handleSubmitCreateMateriaIngreso = () => {
    let data = prepareDataMateriaPrimaIngreso()
    console.log("mat", data)

    const isValid = validateMateriPrimaIngreso(data)
    console.log("valod", errorsMateriaPrimaIngreso)
    if (isValid) {
      createMateriaIngreso()
    }

  };
  const createMateriaIngreso = () => {
    http.post(`/materiaingreso/create`, materiaIngreso)
      .then((response) => {
        showToast("success", "Ingreso de Materia", `Se añadió correctamente`);
        getAllMateriasProveedores(materiaPrima.id);
        getAllMateriasPrimas();
        hideDialogMateriaProveedor();
      })
      .catch((error) => {
        console.log(error);
        showToast("error", "Materia Ingresada", `No se pudo crear`);
      });
  }

  const handleDeleteMateriaIngreso = () => {
    http.delete(`/materiaingreso/delete/${materiaIngreso.id}`)
      .then((response) => {
        showToast("success", "Historia Elminada", `Se elimino correctamente`);
        getAllHistorial(materiaPrima.id);
        getAllMateriasPrimas();
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "error",
          "Historia no eliminada",
          `No se eliminó correctamente`
        );
      });
  };

  const accept = () => {
    handleSubmitDelete();
  };

  const acceptMateriaProveedor = () => {
    handleSubmitDeleteMateriaProveedor();
  };

  const acceptHistorial = () => {
    handleDeleteMateriaIngreso();
  };

  const showToast = (tipo, titulo, detalle) => {
    toast.current.show({
      severity: tipo,
      summary: titulo,
      detail: detalle,
      life: 3000,
    });
  };

  const { notificaciones, generarNotificacion } = useNotificaciones();

  useEffect(() => {
    const datosMateriasPrimas = materiasPrimas.map((materiaPrima) => {
      const cantAlarma = materiaPrima.cantidad - materiaPrima.cantidad_minima;
      const alarm = cantAlarma <= 0; // true si cantAlarma es igual o menor a 0, false si es mayor

      return {
        nombre: materiaPrima.nombre_materia,
        cantidad: materiaPrima.cantidad,
        cantidadMinima: materiaPrima.cantidad_minima,
        cantAlarma: cantAlarma,
        alarm: alarm,
      };
    });


    console.log('Nombres de Materias Primas:', datosMateriasPrimas);
  }, [materiasPrimas]);


  //funcion para manejar la descarga de excel
  const manejaModalExcel = () => {
    exportToExcel();
    handleCloseExcel();


  }

  const formatValue = (value) => {
    if (value === null || value === '' || value === undefined) {
      return '---';
    }
    return value;
  };
  const handleChangeCantidadMerma = (e) => {
    let regex = /^(?!0\d)(\d+(\.\d{0,2})?|0?\.\d{0,2})?$/

    if (regex.test(e.target.value)) {
      let value = parseFloat(e.target.value);
      if (value > parseFloat(materia_ingreso?.stock)) {
        console.log("Value exceeds stock:", materia_ingreso?.stock.toString());
        value = materia_ingreso?.stock.toString();
        setCantidadMerma(value)
      } else {
        setCantidadMerma(e.target.value);
      }
    }

    setMensaje("")

  };
  useEffect(() => {
    if (materiaPrima.unidad_medida && materiaPrima.unidad_medida.id) {
      setMateriaPrima((prevState) => ({
        ...prevState,
        unidad_medida_id: prevState.unidad_medida.id, 
      }));
    }
  }, [materiaPrima.unidad_medida, unidadesMedidas]); 
  
  return (
    <>
      <Container url="getMateriasPrimas">
        <Toast ref={toast} />
        <div className="p-container-headerPrima">
          <div className="p-container-titulo">
            <h1 style={{ color: '#04638A' }} className="container-titulo-table">Almacén de Materias Primas</h1>
          </div>
          <div className="container-descripcion-materia">
            <div className="container-descripcion-table">
              <p>
                A continuación, se visualiza la lista de almacenes de Materias
                Primas
              </p>
            </div>
            {/* <div className="container-descripcion-button-add-materia">

              <Button label="Descargar" icon="pi pi-file-excel mr-2" onClick={handleClickOpenExcel} style={{ backgroundColor: 'green' }} />
            </div> */}
            <div className="container-descripcion-button-add-excel">
              <button
                onClick={() => {
                  cleanMateriaPrima();
                  setVisibleCreate(true);
                }}
                className="button button-crear"
              >
                Crear Materia <i className="pi pi-plus mr-2"></i>
              </button>
            </div>
          </div>
        </div>

        <ListMateriaPrima
          onInputSearch={(e) => setGlobalFilter(e.target.value)}
          valueGlobalFilter={globalFilter}
          data={materiasPrimas}
          selection={select}
          onSelectionChange={(e) => {
            setSelect(e.value);
          }}
          onClickRefresh={() => getAllMateriasPrimas()}
        >
          <Column
            field={"nombre_materia"}
            header="Nombre"
            className="column column-name"
            body={(rowData) => formatValue(rowData.nombre_materia)}
          ></Column>
          <Column
            field={
              "presentacion" != null ? "presentacion.nombre" : "presentacion"
            }
            header="Presentación"
            className="column column-presentation"
          ></Column>
          <Column
            field="cantidad"
            header="Cantidad"
            className="column column-quantity"
            body={(rowData) => formatValue(rowData.cantidad)}
          ></Column>
          <Column
            field="cantidad_minima"
            header="Cantidad Mínima"
            className="column column-minimum"
            body={(rowData) => formatValue(rowData.cantidad_minima)}
          ></Column>
          <Column
            field={"unidad_medida" != null ? "unidad_medida.nombre" : "unidad_medida"}
            header="Unidad Medida"
            className="column column-unit"
            
          >
            
          </Column>

          <Column
            header="Ingresos"
            body={actionBodyTemplateMateriaProveedor}
            xportable={false}
            className="column column-provider"
          ></Column>

          <Column
            header="Historial"
            body={actionBodyTemplateHistorial}
            exportable={false}
            className="column column-record"
          ></Column>

          <Column
            header="Ficha Técnica"
            body={actionBodyTemplateDocumento}
            exportable={false}
            className="column column-document"
          ></Column>

          <Column
            header="Editar"
            body={(rowData)=> ( <Button
              icon="pi pi-pencil"
              className="p-button-rounded p-button-warning"
              onClick={() => handleEditClick(rowData)} // Al hacer clic en "Editar", se abre el diálogo con los datos de esa fila
            />)}
            exportable={false}
            className="column column-edit"
          ></Column>
          <Column
            body={actionBodyTemplateDelete}
            header="Eliminar"
            exportable={false}
            className="column column-delete"
          ></Column>
        </ListMateriaPrima>
        <div className="p-container-footer">
          <div className="container-descripcion-footer">
            <div className="field">
              <label htmlFor="nombre_materia">Al tener falta de stock se enviará un correo a: </label>
              <InputText
                id="nombre_materia"
                value={correo != null ? correo.correo : ''}
                onChange={(e) => handleChangeCorreo(e)}
                required
                autoComplete="off"
              />
              <Button
                icon="pi pi-save"
                className="p-button-rounded p-button-danger"
                onClick={() => handleSubmitCreateCorreo(correo)}
              />
            </div>
          </div>
        </div>
        <Dialog
          visible={visibleExcel}
          modal
          onHide={handleCloseExcel}
          style={{ width: '400px', height: '450px' }}
        >
          <div>
            <div className="field">
              <label htmlFor="startDate" className="block" >
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold' }}>RANGO DE FECHAS</span><br />
                  Seleccione el rango de fechas a descargar*
                </div>
              </label>
            </div>
            <div className="field">
              <label htmlFor="startDate" className="block">
                Desde*
              </label>
              <InputText
                id="username1"
                aria-describedby="username1-help"
                className="block"
                type="date"
                style={{ width: "100%" }}
              />
            </div>
            <div className="field">
              <label htmlFor="startDate" className="block">
                Hasta*
              </label>
              <InputText
                id="username1"
                aria-describedby="username1-help"
                className="block"
                type="date"
                style={{ width: "100%" }}
              />
            </div>
            <div className="field" style={{ display: 'flex', gap: 50, justifyContent: 'center', alignItems: 'center' }}>
              <Button label="Cancelar" icon="pi pi-align-center" style={{ backgroundColor: 'orange', border: 'none' }} onClick={handleCloseExcel} />
              <Button label="Descargar" icon="pi pi-align-center" style={{ backgroundColor: 'green', border: 'none' }} onClick={manejaModalExcel} />
            </div>
          </div>
        </Dialog>

        <Dialog
          visible={visibleCreate}
          style={{ width: "450px" }}
          header={<><i className="pi pi-briefcase icon-create-proveedor"></i>Crear Materias Prima</>}
          modal
          className="p-fluid"
          footer={productDialogFooter}
          onHide={hideDialog}
        >
          <div className="field">
            <label htmlFor="nombre_materia">Nombre de la Materia Prima*</label>
            <InputText
              id="nombre_materia"
              value={materiaPrima.nombre_materia}
              onChange={(e) => handleChangeNombreMateria(e)}
              required
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label htmlFor="unidad_medida">Unidad de Medida*</label>
            <Dropdown
              id="unidad_medida"
              value={materiaPrima.unidad_medida}
              options={unidadesMedidas}
              onChange={handleChangeUnidadMedidaCreate}
              optionLabel="nombre"
              placeholder="Selecciona un tipo de medida"
              filter
            />
          </div>
          <div>
            <label htmlFor="presentacion">Presentación*</label>
            <Dropdown
              id="presentacion"
              value={materiaPrima.presentacion}
              options={presentaciones}
              onChange={handleChangePresentacionCreate}
              optionLabel="nombre"
              placeholder="Seleccion un tipo de presentación"
              filter
            />
          </div>
          <div className="field">
          </div>

          <div className="cantidad-uni">
            <div className="flex-1">
              <label htmlFor="cantidadminima">Cantidad Mínima*</label>
              <div className="field-cant-uni ">
                <InputInteger id="cantidadminima"
                  value={materiaPrima.cantidad_minima}
                  onChange={(e) => handleChangeCantidadMinima(e)}
                  required
                  autoComplete="off"
                  name="cantidad_minima"
                  maxLength={10}
                  containerClass={"w-full"}
                  valueError={errorsMateriaPrima?.cantidad_minima}


                />
              </div>
              {/* {errorsMateriaPrima?.cantidad_minima && <p style={{ color: "red" }}>{errorsMateriaPrima?.cantidad_minima}</p>} */}

            </div>
            <span>{unidadesMedidas?.map(item => {
              if (item.id == materiaPrima.unidad_medida_id) {
                return (<strong key={item.id}>{item.abreviatura}</strong>)
              }
            })}</span>
          </div>

          <div className="field">
            <label htmlFor="documento_calidad">Ficha Técnica</label>
            <FileUpload
              name="documento_calidad"
              accept="application/pdf"
              maxFileSize="1000000"
              auto
              customUpload
              uploadHandler={changeFile}
              onError={onTemplateClear}
              onClear={onTemplateClear}
              headerTemplate={headerTemplate}
              itemTemplate={itemTemplate}
              emptyTemplate={emptyTemplate}
              chooseOptions={chooseOptions}
            />
          </div>
        </Dialog>

        <Dialog
          visible={visibleEditDialog}
          style={{ width: "450px" }}
          header={
            <>
              <i className="pi pi-briefcase icon-create-proveedor"></i>Editar Materia Prima
            </>
          }
          modal
          className="p-fluid"
          footer={MateriaPrimaDialogFooterUpdate}
          onHide={hideDialog}
        >
            {selectedMateria && (
            <>
              <div className="field">
            <label htmlFor="nombre_materia">Nombre de la Materia Prima*</label>
            <InputText
              id="nombre_materia"
              value={materiaPrima.nombre_materia}
              onChange={(e) => handleChangeNombreMateria(e)}
              required
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label htmlFor="unidad_medida">Unidad de Medida*</label>
            <Dropdown
                 id="unidad_medida"
                 value={materiaPrima.unidad_medida?.id} // Sigue utilizando el ID del objeto unidad_medida
                 options={unidadesMedidas.map((unidad) => ({
                   label: unidad.nombre,
                   value: unidad.id, // El valor es el ID de la unidad de medida
                }))}
                 onChange={handleChangeUnidadMedida}
                 placeholder="Seleccione una unidad de medida"
           />

            {/* <Button
              label="Agregar Unidad de Medida"
              onClick={() => addUnidadMedida({ nombre: 'Nueva Unidad' })}
            /> */}
          </div>

          <div>
            <label htmlFor="presentacion">Presentación*</label>
            <Dropdown
                  id="presentacion"
                  value={materiaPrima.presentacion?.id} // Muestra la presentación seleccionada por su id
                  options={presentaciones.map((presentacion) => ({
                    label: presentacion.nombre,
                    value: presentacion.id, // Se usa el ID para seleccionar la presentación
                  }))}
                  onChange={handleChangePresentacion}
                  placeholder="Seleccione una presentación"
                />
          </div>

          <div className="field">
            {/* <label htmlFor="cantidad">Cantidad</label>
            <InputText
              id="cantidad"
              value={materiaPrima.cantidad}
              onChange={(e) => handleChangeCantidad(e)}
              required
              disabled
              keyfilter="num"
              autoComplete="off"
            /> */}
          </div>
          <div className="cantidad-uni">
            <div className="flex-1">
              <label htmlFor="cantidadminima">Cantidad Mínima*</label>
              <div className="field-cant-uni ">
                <InputInteger id="cantidadminima"
                  value={materiaPrima.cantidad_minima}
                  onChange={(e) => handleChangeCantidadMinima(e)}
                  required
                  autoComplete="off"
                  name="cantidad_minima"
                  maxLength={10}
                  containerClass={"w-full"}
                  valueError={errorsMateriaPrima?.cantidad_minima}


                />
              </div>
              {/* {errorsMateriaPrima?.cantidad_minima && <p style={{ color: "red" }}>{errorsMateriaPrima?.cantidad_minima}</p>} */}

            </div>
            <span>{unidadesMedidas?.map(item => {
              if (item.id == materiaPrima.unidad_medida_id) {
                return (<strong key={item.id}>{item.abreviatura}</strong>)
              }
            })}</span>
          </div>
          <div className="field">
            <label htmlFor="documento_calidad">Ficha Técnica</label>
            <FileUpload
              name="documento_calidad"
              accept="application/pdf"
              maxFileSize="1000000"
              auto
              customUpload
              uploadHandler={changeFile}
              onError={onTemplateClear}
              onClear={onTemplateClear}
              headerTemplate={headerTemplate}
              itemTemplate={itemTemplate}
              emptyTemplate={emptyTemplate}
              chooseOptions={materiaPrima.documento_calidad === null ? chooseOptions : chooseOptionsEditar}
            />
          </div>
            </>
          )}
        </Dialog>

        <Dialog
          visible={visibleCreateMateriaProveedor}
          style={{ width: "500px" }}
          header={
            <>
              <i className="pi pi-briefcase icon-create-proveedor"></i>
              Seleccionar Proveedor
            </>
          }
          modal
          className="p-fluid"
          footer={productDialogCreateMateriaProveedor}
          onHide={hideDialogMateriaProveedor}
        >
          <div className="field">
            <label htmlFor="razon_social">Razón Social</label>
            <Dropdown
              id="proveedor"
              value={materiaProveedor.proveedor}
              options={proveedoresConContacto}
              onChange={handleChangeProveedor}
              optionLabel="contacto"
              placeholder="Selecciona un proveedor"
              filter
              filterBy="proveedor,contacto"
              optionGroupLabel="razon_social"
              optionGroupChildren="contactos"
              itemTemplate={itemTemplateDropdownProveedor}
              emptyMessage="No hay opciones disponibles"
            />
          </div>
        </Dialog>

        <Dialog
          visible={visibleEditMateriaProveedor}
          style={{ width: "450px" }}
          header={
            <>
              <i className="pi pi-briefcase icon-create-proveedor"></i>
              Seleccionar Proveedor*
            </>
          }
          modal
          className="p-fluid"
          footer={productDialogEditMateriaProveedor}
          onHide={hideDialogMateriaProveedor}
        >
          <div className="field">
            <label htmlFor="razon_social">Razón Social</label>
            <Dropdown
              id="proveedor"
              value={materiaProveedor.proveedor}
              options={proveedores}
              onChange={handleChangeProveedor}
              optionLabel="razon_social"
              placeholder="Selecciona un proveedor"
            />
          </div>
        </Dialog>

        <Dialog
          visible={visibleEditMateriaIngreso}
          style={{ width: "450px" }}
          header={
            <>
              <i className="pi pi-briefcase icon-create-proveedor"></i>
              Nuevo Ingreso
            </>
          }
          modal
          className="p-fluid"
          footer={productDialogCreateMateriaIngreso}
          onHide={() => {
            hideDialogMateriaProveedor(true);
            cleanMateriaIngreso();
          }}
        >
          <div className="field">
            <PageMateriaIngreso
              fecha_ingreso={materiaIngreso.fecha_ingreso}
              materia_ingreso={materiaIngreso}
              nombre_materia={materiaPrima.nombre_materia}
              unidad_medida={materiaPrima.unidad_medida}
              nombre_proveedor={proveedor.razon_social}
              materia_proveedor_id={materiaProveedor.id}
              cantidad={materiaIngreso.cantidad}
              costo_materia_prima={materiaIngreso.costo_materia_prima}
              fecha_vencimiento={materiaIngreso.fecha_vencimiento}
              lote_interno={materiaIngreso.lote_interno}
              lote_produccion={materiaIngreso.lote_produccion}
              fecha_emision={materiaIngreso.fecha_emision}
              handleChangeFechaVencimiento={handleChangeFechaVencimiento}
              handleChangeFechaEmision={handleChangeFechaEmision}
              handleChangeFechaIngreso={handleChangeFechaIngreso}
              handleChangeLoteInterno={handleChangeLoteInterno}
              handleChangeCosto={handleChangeCosto}
              handleChangeLoteProduccion={handleChangeLoteProduccion}
              handleChangeCantidadIngreso={handleChangeCantidadIngreso}
              setMateriaIngreso={setMateriaIngreso}
              errorsMPIngreso={errorsMateriaPrimaIngreso}
              preguntaUno={preguntaUno}
              setPreguntaUno={setPreguntaUno}
              preguntaDos={preguntaDos}
              setPreguntaDos={setPreguntaDos}
              handleChangeQuestionOne={handleChangeQuestionOne}
              handleChangeQuestionTwo={handleChangeQuestionTwo}
            ></PageMateriaIngreso>
          </div>
        </Dialog>

        {/*DIALOG MATERIA PROVEEDOR TABLA*/}
        <Dialog
          visible={visibleMateriaProveedor}
          style={{ width: "90vw" }}
          header={
            <>
              <i className="pi pi-briefcase icon-create-proveedor"></i>
              Seleccionar Proveedores
            </>
          }
          footer={MateriaProveedorDialgogFooterAsignar}
          onHide={hideDialogProveedor}
          className="material-proveedor"
        >
          <div className="p-container-titulo">
            <h1 className="container-titulo-table">Lista de Proveedores</h1>
          </div>
          <div className="container-descripcion container-descripcion-modal-proveedores">
            <div className="container-descripcion-table">
              <p>
                A continuación, se visualiza la lista de proveedores asignados a{" "}
                {materiaPrima.nombre_materia}
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "end" }}>
              <button
                onClick={() => {
                  setVisibleCreateMateriaProveedor(true);
                  cleanMateriaProveedor();
                }}
                className="button button-crear"
              >
                Seleccionar Proveedor <i className="pi pi-plus mr-2"></i>
              </button>
            </div>
          </div>
          <div className="materia-proveedor-container">
            <div className="materia-table-proveedores">
              <div className="card-table-proveedores">
                <ListProveedor
                  onInputSearch={(e) => setGlobalFilterProveedor(e.target.value)}
                  valueGlobalFilter={globalFilterProveedor}
                  data={materiaProveedores}
                  dataMateria={materiaPrima}
                  selection={selectMateriaProveedor}
                  onSelectionChange={(e) => {
                    setSelectMateriaProveedor(e.value);
                  }}
                  onClickRefresh={() =>
                    getAllMateriasProveedores(materiaPrima.id)
                  }
                >
                  <Column
                    field={"proveedor.razon_social"}
                    header="Proveedor"
                    className="column column-provider"
                  ></Column>
                  <Column
                    field={"contacto"}
                    header="Contacto"
                    className="column column-contact"
                  ></Column>

                  <Column
                    field={"telefono"}
                    header="Teléfono"
                    className="column column-phone"
                  ></Column>

                  <Column
                    field={"correo"}
                    header="Correo"
                    className="column column-mail">
                  </Column>


                  {/*<Column
                    header='Editar'
                    body={actionBodyTemplateEditMateriaProveedor}
                    exportable={false}
                    style={{ maxWidth: '8rem' }}
                  ></Column>*/}

                  <Column
                    header="Materia Ingreso"
                    body={actionBodyTemplateMateriaIngreso}
                    exportable={false}
                    style={{ maxWidth: "8rem" }}
                    className="column column-material"
                  ></Column>

                  <Column
                    body={actionBodyTemplateDeleteMateriaProveedor}
                    header="Eliminar"
                    exportable={false}
                    style={{ maxWidth: "8rem" }}
                    className="column column-delete"
                  ></Column>
                </ListProveedor>
              </div>
            </div>
          </div>
        </Dialog>

        {/*DIALOG HISTORIAL TABLA*/}
        <Dialog
          visible={visibleHistorial}
          style={{ width: "80vw" }}
          header={
            <>
              <i className="pi pi-briefcase icon-create-proveedor"></i>Lista de
              Historial
            </>
          }
          footer={HistorialDialgogFooterAsignar}
          onHide={hideDialogHistorial}
          className="material-historial"
        >
          <div className="container-descripcion container-descripcion-modal-proveedores">
            <div className="container-descripcion-table">
              <p>
              A continuación, se visualiza el historial de ingresos de la materia prima{" "}
                <span className="font-bold">{materiaPrima.nombre_materia}</span>
                
              </p>
            </div>
          </div>
          <div className="materia-proveedor-container">
            <div className="materia-table-proveedores">
              <div className="card-table-proveedores">
                <ListHistorial
                  data={historial}
                  selection={selectHistorial}
                  onSelectionChange={(e) => {
                    setSelectHistorial(e.value);
                    console.log(e.value);
                  }}
                  onClickRefresh={() => getAllHistorial(materiaPrima.id)}
                  onInputSearch={(e) => setGlobalFilterHistorial(e.target.value)}
                  valueGlobalFilter={globalFilterHistorial}
                  nombre_materia={materiaPrima.nombre_materia}
                >
                  <Column field={"razon_social"} header="Proveedor" className="column column-provider"></Column>
                  <Column body={(data) => (<>{data.stock} {data.abreviatura}</>)} header="Cantidad" className="column column-quantity"></Column>
                  <Column body={(data) => (<>S/ {data?.costo_materia_prima}</>)} header="Costo" className="column column-price"></Column>
                  <Column field={"lote_interno"} header="Lote Interno" className="column column-lote"></Column>
                  <Column
                    field={"lote_produccion"}
                    header="Lote Producción"
                    className="column column-production"
                  ></Column>
                  <Column
                    field={"fecha_ingreso"}
                    header="Fecha de Ingreso"
                    className="column column-date"
                  ></Column>
                  <Column
                    body={(data) => (data.fecha_emision ? <p>{data?.fecha_emision}</p> : <p> --- </p>)}
                    header="Fecha de Producción"
                    className="column column-production_date"
                  ></Column>
                  <Column
                    body={(data) => (data.fecha_vencimiento ? <p>{data?.fecha_vencimiento}</p> : <p> --- </p>)}
                    header="Fecha de vencimiento"
                    className="column column-expiration_date"
                  ></Column>
                  <Column
                    body={(e) => botonesMerma(e)}
                    header="Merma"
                    className="column column-expiration_date"
                  ></Column>
                  <Column
                    body={actionBodyTemplateDeleteHistorial}
                    header="Eliminar"
                    exportable={false}
                    className="column column-delete"
                  /*style={{ maxWidth: "8rem" }}*/
                  ></Column>
                </ListHistorial>
              </div>
            </div>
          </div>
        </Dialog>

        <ConfirmDialog
          visible={visibleDelete}
          onHide={() => {
            setVisibleDelete(false);
            cleanMateriaPrima();
          }}
          message={`¿Está seguro de eliminar la Materia Prima ${materiaPrima.nombre_materia}?`}
          header="Confirmación"
          icon="pi pi-exclamation-triangle"
          accept={accept}
          reject={reject}
        />
        <ConfirmDialog
          visible={visibleDeleteMateriaProveedor}
          onHide={() => {
            setVisibleDeleteMateriaProveedor(false);
            cleanMateriaProveedor();
          }}
          message={`¿Está seguro de eliminar proveedor?`}
          header="Confirmación"
          icon="pi pi-exclamation-triangle"
          accept={acceptMateriaProveedor}
          reject={rejectMateriaProveedor}
        />
        <ConfirmDialog
          visible={visibleDeleteHistorial}
          onHide={() => {
            setVisibleDeleteHistorial(false);
            cleanMateriaIngreso();
          }}
          message={`¿Está seguro de eliminar historia?`}
          header="Confirmación"
          icon="pi pi-exclamation-triangle"
          accept={acceptHistorial}
          reject={rejectHistorial}
        />
        {/*Imagen PDF */}

        <Dialog
          visible={visiblePdf}
          style={{ width: "1300px", height: "80vh" }}
          breakpoints={{ "960px": "75vw", "640px": "100vw" }}
          className="p-fluid"
          closable={true}
          draggable={false}
          modal
          onHide={hideDialogPDF}
          header={dialogHeader}
          footer={dialogFooter}
          maximizable
        //contentStyle={{ overflow: "hidden" }}
        >
          {dialogBody}
        </Dialog>

        {/* Dialod para merma */}
        <Dialog
          visible={visibleMerma}
          onHide={() => hideDialogMerma()}
          header={<h2 style={{ margin: "0px" }}>{headerDialogMerma}</h2>}
          footer={
            <>
              <Button
                label="Cerrar"
                icon="pi pi-times"
                className="p-button-danger"
                onClick={() => hideDialogMerma()}
              />
              <Button
                label={footerButton}
                icon="pi pi-check"
                className="p-button-success"
                onClick={() => footerButton == "Registrar" ? registrarMerma() : actualizarMerma()}
              />
            </>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", marginBottom: "20px" }}>
            <p>¿Cuál es la causa de la merma?</p>
            <InputTextarea value={causa_merma} onChange={(e) => setCausaMerma(e.target.value)} rows={3} cols={30} />
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center", justifyContent: "center" }}>
            <p>Cantidad</p>
            <InputDecimal
              required

              autoComplete='off'
              placeholder='Ingrese la cantidad de merma'
              value={cantidad_merma}
              onChange={handleChangeCantidadMerma}
              maxLength={12}

            />
            <strong>{materia_ingreso?.abreviatura}</strong>
          </div>
          <small style={{ color: "red" }}>{mensaje}</small>
        </Dialog>
        <Dialog
          style={{ width: "60vw", padding: "0", margin: "0" }}
          visible={visibleHstMerma}
          onHide={() => ocultarHistorialMerma()}
          header={<><h3 style={{ margin: "0px" }}>Historial de Merma</h3></>}
          footer={
            <>
              <Button
                label="Cerrar"
                icon="pi pi-times"
                className="p-button-danger"
                onClick={() => ocultarHistorialMerma()}
              />
            </>
          }
        >
          <div style={{ margin: "10px 0px" }}>
            <p style={{ margin: "0px" }}>
              A continuación, se visualiza el historial de merma de la Materia
              Prima {materia_ingreso?.nombre_materia} en el lote {materia_ingreso?.lote_produccion} del
              proveedor {materia_ingreso?.razon_social}
            </p>
          </div>
          <DataTable value={mermaHistorial} paginator rows={4} emptyMessage="No se encontraron resultados" >
            <Column body={(data) => (<>{data.cantidad_total} {materia_ingreso.abreviatura}</>)} header="Cantidad Total"></Column>
            <Column body={(data) => (<>{data.cantidad_merma} {materia_ingreso.abreviatura}</>)} header="Cantidad Merma"></Column>
            <Column body={(data) => (<>{data.cantidad_restante} {materia_ingreso.abreviatura}</>)} header="Cantidad Disponible"></Column>
            <Column field="fecha_creacion" header="Fecha"></Column>
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
          {`Eliminarás esta merma del lote ${materia_ingreso?.lote_produccion}`}
        </Dialog>

      </Container >
    </>
  );
}

