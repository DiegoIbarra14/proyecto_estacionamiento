import React, { useEffect, useState, useRef } from "react";
import { Column } from "primereact/column";
import http from "../../http-common";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import ListCliente from "../../Components/Cliente/ListCliente";
import "./pageClientes.css";
import ListLocales from "../../Components/Cliente/ListLocales";
import Container from "../../Components/Container/Container";
import "./pageClientes2.css";
import AuthUser from "../../AuthUser";
import { useDispatch } from "react-redux";
import { logout } from "../../reducers/authSlices";
export default function PageClientes() {
  const [Desabilitar, setDesabilitar] = useState(false)
  const toast = useRef(null);
  const { http, getToken, deleteToken } = AuthUser();
  const [my, setMy] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [globalFilterLocal, setGlobalFilterLocal] = useState(null);
  const [tiposDocumentos, setTiposDocumentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [locales, setLocales] = useState([]);
  const [cliente, setCliente] = useState({
    id: 0,
    tipo_documento: null,
    numero_documento: "",
    tipo_documento_id: null,
    razon_social: "",
    telefono: "",
    correo: "",
    locales: [],
  });
  const [local, setLocal] = useState({
    cliente_id: cliente.id,
    id: 0,
    nombre_local: "",
    direccion: "",
  });

  const [valueMaxDocumento, setValueMaxDocumento] = useState(8);
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleLocales, setVisibleLocales] = useState(false);
  const [visibleCreateLocal, setVisibleCreateLocal] = useState(false);
  const [visibleEditLocal, setVisibleEditLocal] = useState(false);
  const [visibleDeleteLocal, setVisibleDeleteLocal] = useState(false);
  const [select, setSelect] = useState(null);
  const [selectLocal, setSelectLocal] = useState(null);
  const dispatch = useDispatch();


  const getAllTiposDocumentos = () => {
    http
      .get("/usuarios/tiposdocumentos/get")
      .then((response) => {
        setTiposDocumentos(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAllClientes = () => {
    http
      .get("/clientes/get")
      .then((response) => {
        setClientes(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAllClientesLocales = (id) => {
    http
      .get(`clientes/locales/getcliente/${id}`)
      .then((response) => {
        setLocales(response.data.data);
        console.log(locales);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getAllTiposDocumentos();
    getAllClientes();
  }, [setTiposDocumentos]);

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
        dispatch(logout());
      }
      console.log("promesa 2", response.data);
    } catch (e) {
      console.log(e);
    }
  };
  const getRazonSocialLabel = () => {
    if (cliente.tipo_documento?.nombre === "RUC") {
      return "Razón Social*";
    } else {
      return "Nombre completo*";
    }
  };
  const shouldShowValidationButton = () => {
    return (
      cliente.tipo_documento &&
      (cliente.tipo_documento.nombre === "RUC" ||
        cliente.tipo_documento.nombre === "DNI")
    );
  };

  const isValidEmail = (email) => {
    //const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateNumeroDocumento = async () => {
    if (!cliente.tipo_documento || !cliente.tipo_documento.nombre) {
      showToast(
        "error",
        "Error",
        "Por favor, seleccione un tipo de documento válido"
      );
      return;
    }

    const isRUC = cliente.tipo_documento.nombre.trim().toUpperCase() === "RUC";
    const isDNI = cliente.tipo_documento.nombre.trim().toUpperCase() === "DNI";

    if (!isRUC && !isDNI) {
      showToast(
        "error",
        "Error",
        "Tipo de documento no válido para validación"
      );
      return;
    }

    const numeroDocumento = cliente.numero_documento.trim();

    if (
      (isRUC && numeroDocumento.length !== 11) ||
      (isDNI && numeroDocumento.length !== 8)
    ) {
      showToast(
        "error",
        "Error",
        `El ${isRUC ? "RUC" : "DNI"} debe tener ${isRUC ? "11" : "8"} dígitos`
      );
      return;
    }

    const endpoint = isRUC ? "ruc" : "dni";

    try {
      const response = await fetch(
        `https://dniruc.apisperu.com/api/v1/${endpoint}/${cliente.numero_documento}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InlvY29qMTI3ODRAYmFjYWtpLmNvbSJ9.YHSqYX_C3RpegTKD9V7RLxH3eOLyPwK-AajOIegQBtc`
      );
      const data = await response.json();

      if (!data || data.success === false) {
        showToast(
          "error",
          "Error",
          `No se pudo obtener los datos del ${isRUC ? "RUC" : "DNI"}`
        );
        return;
      }

      let razonSocial = "";
      if (isRUC) {
        razonSocial = data.razonSocial;
      } else {
        razonSocial = `${data.nombres} ${data.apellidoPaterno} ${data.apellidoMaterno}`;
      }

      setCliente((prevCliente) => ({
        ...prevCliente,
        razon_social: razonSocial,
      }));

      showToast(
        "success",
        "Éxito",
        `Datos del ${isRUC ? "RUC" : "DNI"} obtenidos correctamente`
      );
    } catch (error) {
      console.error(`Error al validar ${isRUC ? "RUC" : "DNI"}:`, error);
      showToast(
        "error",
        "Error",
        `Hubo un problema al validar el ${isRUC ? "RUC" : "DNI"}`
      );
    }
  };

  const getKeyFilter = () => {
    if (!cliente.tipo_documento) return "int";

    switch (cliente.tipo_documento.nombre) {
      case "DNI":
      case "RUC":
        return "int";
      case "Pasaporte":
      case "Carné de extranjería":
        return /^[a-zA-Z0-9]*$/;
      default:
        return "int";
    }
  };
  //necesario para el crud
  const actionBodyTemplateEdit = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning"
          onClick={() => editCliente(rowData)}
        />
      </React.Fragment>
    );
  };
  const actionBodyTemplateEditLocales = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning"
          onClick={() => editLocal(rowData)}
        />
      </React.Fragment>
    );
  };
  const actionBodyTemplateDelete = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => confirmDeleteCliente(rowData)}
        />
      </React.Fragment>
    );
  };
  const actionBodyTemplateDeleteLocales = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => confirmDeleteLocal(rowData)}
        />
      </React.Fragment>
    );
  };
  const actionBodyTemplateLocales = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-building"
          className="p-button-rounded p-button-help"
          onClick={() => localesCliente(rowData)}
        />
      </React.Fragment>
    );
  };
  const editCliente = (cliente) => {
    setCliente(cliente);
    setVisibleEdit(true);
  };
  const editLocal = (local) => {
    setLocal(local);
    setVisibleEditLocal(true);
  };
  const localesCliente = (cliente) => {
    setCliente(cliente);
    setLocal({
      cliente_id: cliente.id,
      direccion: "",
      nombre_local: "",
    });
    getAllClientesLocales(cliente.id);
    setVisibleLocales(true);
  };
  const confirmDeleteCliente = (cliente) => {
    setCliente(cliente);
    setVisibleDelete(true);
  };
  const confirmDeleteLocal = (cliente) => {
    setLocal(cliente);
    setVisibleDeleteLocal(true);
  };
  //para el modal de crear
  const hideDialog = () => {
    cleanCliente();
    setVisibleCreate(false);
  };
  const hideDialogEdit = () => {
    cleanCliente();
    setVisibleEdit(false);
  };
  const hideDialogLocales = () => {
    cleanCliente();
    setVisibleLocales(false);
    cleanLocal();
  };
  const hideDialogLocalesCreate = () => {
    cleanLocal();
    setVisibleCreateLocal(false);
  };
  const hideDialogLocalesEdit = () => {
    cleanLocal();
    setVisibleEditLocal(false);
  };
  const cleanCliente = () => {
    setCliente({
      id: 0,
      tipo_documento: null,
      numero_documento: "",
      tipo_documento_id: null,
      razon_social: "",
      telefono: "",
      contacto: "",
      locales: [],
    });
  };
  const cleanLocal = () => {
    setLocal({
      id: 0,
      nombre_local: "",
      cliente_id: cliente.id,
      direccion: "",
    });
  };
  const validateForm = () => {
    console.log(cliente);
    if (cliente.razon_social.length === 0) {
      showToast(
        "error",
        "Error de ingreso",
        "Debe ingresar una Razón Social o Nombre"
      );
      return false;
    }
    if (cliente.numero_documento.length === 0) {
      showToast(
        "error",
        "Error de ingreso",
        "Debe ingresar un número de documento"
      );
      return false;
    }
    if (cliente.tipo_documento_id === null) {
      showToast(
        "error",
        "Error de ingreso",
        "Debe seleccionar un tipo de documento"
      );
      return false;
    }
    if (
      cliente.tipo_documento?.nombre === "RUC" &&
      cliente.numero_documento.length !== 11
    ) {
      showToast("error", "Error de ingreso", "El RUC debe tener 11 dígitos");
      return false;
    }
    if (
      cliente.tipo_documento?.nombre === "DNI" &&
      cliente.numero_documento.length !== 8
    ) {
      showToast(
        "error",
        "Error de ingreso",
        "El DNI debe tener 8 dígitos validateForm"
      );
      return false;
    }
    if (!cliente.correo || !isValidEmail(cliente.correo)) {
      showToast(
        "error",
        "Error de ingreso",
        "El correo electrónico no es válido"
      );
      return false;
    }
    if (
      cliente.tipo_documento?.nombre === "Carné de extranjería" &&
      cliente.numero_documento.length !== 12
    ) {
      showToast(
        "error",
        "Error de ingreso",
        "El Carné de extranjería debe tener 12 dígitos"
      );
      return false;
    }

    if (
      cliente.tipo_documento?.nombre === "Pasaporte" &&
      cliente.numero_documento.length !== 12
    ) {
      showToast(
        "error",
        "Error de ingreso",
        "El Pasaporte debe tener 12 dígitos"
      );
      return false;
    }
    return true;
  };

  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isEmailValidEdit, setIsEmailValidEdit] = useState(true);
  const [validado, setValidado] = useState("");
  const [error, setError] = useState("");

  const handleChangeCorreo = (e) => {
    const email = e.target.value;

    // Expresión regular para validar:
    // - Parte local: hasta 64 caracteres, letras, números, caracteres especiales (!#$%&'*+-/=?^_`{|}~), sin punto al inicio, al final, ni doble punto.
    // - Símbolo @ seguido de dominio.
    // - Dominio: letras, números (excepto en el TLD), sin punto al inicio, al final, ni espacios.
    // - TLD: entre 2 y 63 caracteres, sin números.
    const emailRegex =
      /^(?!.*\.\.)(?!^[^@]{65})(?!^[^@]+@[^@]*\.\.)(?!\.$)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+(?<!\.)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;

    if (emailRegex.test(email)) {
      setValidado("formato correcto");
      setIsEmailValid(true);
      setIsEmailValidEdit(true);
    } else {
      setIsEmailValid(false);
      setIsEmailValidEdit(false);
      setError("formato incorrecto");
    }
    setCliente({ ...cliente, correo: email });
  };

  // al crear un cliente
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
        disabled={Desabilitar}
        onClick={() => {
          if (validateForm()) {
            handleSubmitCreate();
            hideDialog();
          }
        }}
      />
    </React.Fragment>
  );
  const clienteDialogFooterUpdate = (
    <React.Fragment>
      <Button
        label="Cerrar"
        style={{ marginTop: "20px" }}
        icon="pi pi-times"
        className="p-button-danger"
        onClick={hideDialogEdit}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        className="p-button-success"
        onClick={() => {
          if (validateForm()) {
            handleSubmitUpdate();
            hideDialogEdit();
          }
        }}
      />
    </React.Fragment>
  );
  const productDialogFooterLocal = (
    <React.Fragment>
      {/* <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-danger"
        onClick={hideDialogLocales}
      /> */}
    </React.Fragment>
  );
  const productDialogFooterLocalCreate = (
    <React.Fragment>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-danger"
        onClick={hideDialogLocalesCreate}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        className="p-button-success"
        onClick={() => {
          if (local.direccion.length == 0) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe ingresar una Dirección"
            );
          } else {
            handleSubmitCreateLocal();
            hideDialogLocalesCreate();
          }
        }}
      />
    </React.Fragment>
  );
  const productDialogFooterLocalEdit = (
    <React.Fragment>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-danger"
        onClick={hideDialogLocalesEdit}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        className="p-button-success"
        onClick={() => {
          if (local.direccion.length == 0) {
            showToast(
              "error",
              "Error de ingreso",
              "Debe ingresar una Dirección"
            );
          } else {
            handleSubmitUpdateLocal();
            hideDialogLocalesEdit();
          }
        }}
      />
    </React.Fragment>
  );

  const accept = () => {
    handleSubmitDelete();
  };
  const accept2 = () => {
    handleSubmitDeleteLocal();
  };

  const reject = () => {
    toast.current.show({
      severity: "info",
      summary: "Rechazada",
      detail: "No se realizo ninguna acción",
      life: 3000,
    });
    cleanCliente();
  };
  const reject2 = () => {
    toast.current.show({
      severity: "info",
      summary: "Rechazada",
      detail: "No se realizo ninguna acción",
      life: 3000,
    });
    cleanCliente();
  };
  const handleChangeTipoDocumento = (e) => {
    const selectedTipoDocumento = e.value;
    setCliente({
      ...cliente,
      tipo_documento: selectedTipoDocumento,
      tipo_documento_id: selectedTipoDocumento
        ? selectedTipoDocumento.id
        : null,
      numero_documento: "",
      razon_social: "",
    });

    switch (selectedTipoDocumento?.nombre) {
      case "RUC":
        setValueMaxDocumento(11);
        break;
      case "DNI":
        setValueMaxDocumento(8);
        break;
      case "Carné de extranjería":
        setValueMaxDocumento(20);
        break;
      case "Pasaporte":
        setValueMaxDocumento(20);
        break;
      default:
        setValueMaxDocumento(20);
    }
  };
  // const handleChangeTipoDocumento = (e) => {
  //   setCliente({
  //     id: cliente.id,
  //     numero_documento: cliente.numero_documento,
  //     tipo_documento: e.value,
  //     tipo_documento_id: e.value ? e.value.id : null,
  //     razon_social: cliente.razon_social,
  //     telefono: cliente.telefono,
  //     correo: cliente.correo,
  //     locales: cliente.locales,
  //   });
  // };
  const handleChangeNumeroDocumento = (e) => {
    const value = e.target.value;
    const filter = getKeyFilter();

    if (filter === "int" && !/^\d*$/.test(value)) return;
    if (filter !== "int" && !filter.test(value)) return;

    setCliente((prevCliente) => ({
      ...prevCliente,
      numero_documento: value.slice(0, valueMaxDocumento),
    }));
  };
  const handleChangeRazonSocial = (e) => {
    setCliente({
      id: cliente.id,
      numero_documento: cliente.numero_documento,
      tipo_documento: cliente.tipo_documento,
      tipo_documento_id: cliente.tipo_documento_id,
      razon_social: e.target.value,
      telefono: cliente.telefono,
      correo: cliente.correo,
      locales: cliente.locales,
    });
  };
  const handleChangeTelefono = (e) => {
    let value = e.target.value;

    value = value.replace(/[^0-9.]/g, "");

    const decimalPoints = (value.match(/\./g) || []).length;
    if (decimalPoints > 0) {
      console.log("Solo se permite un punto decimal.");
      return;
    }

    const [integerPart, decimalPart] = value.split(".");

    if (integerPart && integerPart.length > 18) {
      console.log("La parte entera no puede tener más de 18 dígitos.");
      return;
    }

    if (decimalPart && decimalPart.length > 2) {
      console.log("Solo se permiten hasta dos decimales.");
      return;
    }

    if (value.length > 20) {
      console.log("El valor no puede tener más de 20 caracteres.");
      return;
    }

    setCliente({
      id: cliente.id,
      numero_documento: cliente.numero_documento,
      tipo_documento: cliente.tipo_documento,
      tipo_documento_id: cliente.tipo_documento_id,
      razon_social: cliente.razon_social,
      telefono: value,
      correo: cliente.correo,
      locales: cliente.locales,
    });
  };

  const handleChangeNombreLocal = (e) => {
    setLocal({
      id: local.id,
      nombre_local: e.target.value,
      cliente_id: local.cliente_id,
      direccion: local.direccion,
    });
  };
  const handleChangeDireccionLocal = (e) => {
    setLocal({
      id: local.id,
      nombre_local: local.nombre_local,
      cliente_id: local.cliente_id,
      direccion: e.target.value,
    });
  };
  const handleSubmitCreate = () => {
    http
      .post("/clientes/create", cliente)
      setDesabilitar(true)
      .then((response) => {
        showToast(
          "success",
          "Cliente Creado",
          `Se creo el cliente ${cliente.razon_social} correctamente`
        );
        getAllClientes();
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "error",
          "Cliente No Creado",
          `No Se creo el cliente ${cliente.razon_social}`
        );
      })
      .finally(()=>{
        setTimeout(() => {
          setDesabilitar(false);
        }, 5000);
      })
  };
  const handleSubmitUpdate = () => {
    http
      .put(`/clientes/update/${cliente.id}`, cliente)
      .then((response) => {
        showToast(
          "success",
          "Cliente Editado",
          `Se Edito el cliente ${cliente.razon_social} correctamente`
        );
        getAllClientes();
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "error",
          "Cliente No Creado",
          `No Se Edito el Cliente ${cliente.razon_social}`
        );
      });
  };

  const handleSubmitDelete = () => {
    http
      .delete(`/clientes/delete/${cliente.id}`)
      .then((response) => {
        showToast(
          "success",
          "Cliente Eliminado",
          `Se elimino correctamente el cliente ${cliente.razon_social}`
        );
        getAllClientes();
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "errro",
          "Cliente No Eliminado",
          `No Se Elimino el cliente ${cliente.razon_social}`
        );
      });
  };
  const handleSubmitCreateLocal = () => {
    http
      .post("/clientes/locales/create", local)
      .then((response) => {
        console.log(response);
        showToast(
          "success",
          "Cliente Creado",
          `Se creo el local ${local.nombre_local} correctamente`
        );
        getAllClientesLocales(cliente.id);
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "error",
          "Cliente No Creado",
          `No Se creo el local ${local.nombre_local}`
        );
      });
  };
  const handleSubmitUpdateLocal = () => {
    http
      .put(`/clientes/locales/update/${local.id}`, local)
      .then((response) => {
        showToast(
          "success",
          "Local Editado",
          `Se Edito el local ${local.nombre_local} correctamente`
        );
        getAllClientesLocales(cliente.id);
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "error",
          "Local No Editado",
          `No Se Edito el local ${local.nombre_local}`
        );
      });
  };
  const handleSubmitDeleteLocal = () => {
    http
      .delete(`/clientes/locales/delete/${local.id}`)
      .then((response) => {
        showToast(
          "success",
          "Cliente Eliminado",
          `Se elimino correctamente el local ${local.nombre_local}`
        );
        getAllClientesLocales(cliente.id);
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "errro",
          "Local No Eliminado",
          `No Se Elimino el local ${local.nombre_local}`
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

  // const formatCurrency = (value) => {
  //   if (value === null || value === '' || value === undefined) {
  //     return '-';
  //   }
  //   return new Intl.NumberFormat('es-PE', {
  //     style: 'currency',
  //     currency: 'PEN',
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2
  //   }).format(value);
  // };

  const formatValue = (value) => {
    if (value === null || value === "" || value === undefined) {
      return "---";
    }
    return value;
  };

  return (
    <>
      <Container url="getClientes">
        <Toast ref={toast} />
        <div className="p-container-headercliente">
          <div className="p-container-titulo">
            <h1 style={{ color: "#04638A" }} className="container-titulo-table">
              Lista de Clientes
            </h1>
          </div>
          <div className="container-descripcion">
            <div className="container-descripcion-table">
              <p>
                A continuación, se visualiza la lista de los clientes
                registrados en el sistema.
              </p>
            </div>
            <div className="container-descripcion-button-add">
              <button
                onClick={() => {
                  cleanCliente();
                  setVisibleCreate(true);
                }}
                className="button button-crear"
              >
                Crear Cliente <i className="pi pi-plus mr-2"></i>
              </button>
            </div>
          </div>
        </div>
        <ListCliente
          data={clientes}
          selection={select}
          onSelectionChange={(e) => {
            setSelect(e.value);
            console.log(e.value);
          }}
          onClickRefresh={getAllClientes}
          onInputSearch={(e) => setGlobalFilter(e.target.value)}
          valueGlobalFilter={globalFilter}
        >
          <Column
            field={
              "tipo_documento" != null
                ? "tipo_documento.nombre"
                : "tipo_documento"
            }
            header="Tipo DOC"
            className="column column-type"
          ></Column>
          <Column
            field={"numero_documento"}
            header="Número DOC"
            className="column column-number"
            body={(rowData) => formatValue(rowData.numero_documento)}
          ></Column>
          <Column
            field="razon_social"
            header="Razón Social / Nombre completo"
            className="column column-business_name"
            body={(rowData) => formatValue(rowData.razon_social)}
          ></Column>
          <Column
            field="telefono"
            header="Teléfono"
            className="column column-phone"
            body={(rowData) => formatValue(rowData.telefono)}
          ></Column>
          <Column
            field="correo"
            header="Correo"
            className="column column-mail"
            body={(rowData) => formatValue(rowData.correo)}
          ></Column>
          {
            <Column
              header="Locales"
              body={actionBodyTemplateLocales}
              exportable={false}
              style={{ minWidth: "8rem" }}
              className="column column-local"
            ></Column>
          }
          <Column
            header="Editar"
            body={actionBodyTemplateEdit}
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
        </ListCliente>
        <Dialog
          visible={visibleCreate}
          style={{ width: "450px" }}
          header={
            <>
              <i className="pi pi-users icon-create-proveedor"></i>Lista de
              Clientes
            </>
          }
          modal
          className="p-fluid"
          footer={productDialogFooter}
          onHide={hideDialog}
        >
          <div className="field">
            <label htmlFor="tipo_documento">Tipo de Documento*</label>
            <Dropdown
              id="tipo_documento"
              value={cliente.tipo_documento}
              options={tiposDocumentos}
              onChange={handleChangeTipoDocumento}
              optionLabel="nombre"
              placeholder="Selecciona un tipo de documento"
              autoFocus
            />
          </div>
          <div className="field">
            <label htmlFor="numero_documento">Número Documento*</label>
            <div
              style={{ display: "flex", flexDirection: "row", gap: "0.4rem" }}
            >
              <InputText
                id="numero_documento"
                value={cliente.numero_documento}
                onChange={(e) => handleChangeNumeroDocumento(e)}
                required
                keyfilter={getKeyFilter()}
                autoComplete="off"
                maxLength={valueMaxDocumento}
              />
              {shouldShowValidationButton() && (
                <Button
                  label="Validar"
                  onClick={validateNumeroDocumento}
                  disabled={
                    (cliente.tipo_documento.nombre === "RUC" &&
                      cliente.numero_documento.length !== 11) ||
                    (cliente.tipo_documento.nombre === "DNI" &&
                      cliente.numero_documento.length !== 8)
                  }
                />
              )}
            </div>
          </div>
          <div className="field">
            <label htmlFor="razon_social">{getRazonSocialLabel()}</label>
            <InputText
              id="razon_social"
              value={cliente.razon_social}
              onChange={(e) => handleChangeRazonSocial(e)}
              required
              autoComplete="off"
            />
          </div>

          <div className="field">
            <label htmlFor="telefono">Teléfono</label>
            <InputText
              id="telefono"
              value={cliente.telefono}
              onChange={(e) => handleChangeTelefono(e)}
              required
              keyfilter="num"
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label htmlFor="correo">Correo*</label>
            <InputText
              id="correo"
              value={cliente.correo}
              onChange={(e) => handleChangeCorreo(e)}
              required
              autoComplete="off"
              type="email"
            />
          </div>
        </Dialog>

        <Dialog
          visible={visibleEdit}
          style={{ width: "450px" }}
          header={
            <>
              <i className="pi pi-users icon-create-proveedor"></i>Editar
              Cliente
            </>
          }
          modal
          className="p-fluid"
          footer={clienteDialogFooterUpdate}
          onHide={hideDialogEdit}
        >
          <div className="field">
            <label htmlFor="tipo_documento">Tipo de Documento*</label>
            <Dropdown
              id="tipo_documento"
              value={cliente.tipo_documento}
              options={tiposDocumentos}
              onChange={handleChangeTipoDocumento}
              optionLabel="nombre"
              placeholder="Selecciona un tipo de documento"
              autoFocus
            />
          </div>
          <div className="field">
            <label htmlFor="numero_documento">Número Documento*</label>
            <div
              style={{ display: "flex", flexDirection: "row", gap: "0.4rem" }}
            >
              <InputText
                id="numero_documento"
                value={cliente.numero_documento}
                onChange={(e) => handleChangeNumeroDocumento(e)}
                required
                keyfilter={getKeyFilter()}
                autoComplete="off"
                maxLength={valueMaxDocumento}
              />
              {shouldShowValidationButton() && (
                <Button
                  label="Validar"
                  onClick={validateNumeroDocumento}
                  disabled={
                    (cliente.tipo_documento.nombre === "RUC" &&
                      cliente.numero_documento.length !== 11) ||
                    (cliente.tipo_documento.nombre === "DNI" &&
                      cliente.numero_documento.length !== 8)
                  }
                />
              )}
            </div>
          </div>
          <div className="field">
            <label htmlFor="razon_social">{getRazonSocialLabel()}</label>
            <InputText
              id="razon_social"
              value={cliente.razon_social}
              onChange={(e) => handleChangeRazonSocial(e)}
              required
              autoComplete="off"
            />
          </div>

          <div className="field">
            <label htmlFor="telefono">Teléfono</label>
            <InputText
              id="telefono"
              value={cliente.telefono}
              onChange={(e) => handleChangeTelefono(e)}
              required
              keyfilter="num"
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label htmlFor="contacto">Correo*</label>
            <InputText
              id="contacto"
              value={cliente.correo}
              onChange={(e) => handleChangeCorreo(e)}
              required
              autoComplete="off"
              type="email"
            />
          </div>
        </Dialog>

        <ConfirmDialog
          visible={visibleDelete}
          onHide={() => {
            setVisibleDelete(false);
            cleanCliente();
          }}
          message={`Esta seguro de eliminar al cliente ${cliente.razon_social}`}
          header="Confirmación"
          icon="pi pi-exclamation-triangle"
          acceptLabel="Sí"
          accept={accept}
          reject={reject}
        />

        <Dialog
          visible={visibleLocales}
          style={{ width: "90vw", backgroundColor: "#F7F7F8 !important" }}
          header={
            <>
              <i className="pi pi-users icon-create-proveedor"></i>Locales del
              Cliente {cliente.razon_social}
            </>
          }
          modal
          className="p-fluid container-descripcion-modal-locales-dialog"
          footer={productDialogFooterLocal}
          onHide={hideDialogLocales}
        >
          <div className="p-container-titulo">
            <h1 className="container-titulo-table">Lista de Locales</h1>
          </div>
          <div className="container-descripcion container-descripcion-modal-locales">
            <div className="container-descripcion-table">
              <p>
                A continuación, se visualiza la lista de los locales del cliente{" "}
                {cliente.razon_social} registrados en el sistema.
              </p>
            </div>
            <div className="container-descripcion-button-add">
              <button
                onClick={() => {
                  setVisibleCreateLocal(true);
                }}
                className="button button-crear"
              >
                Crear Local <i className="pi pi-plus mr-2"></i>
              </button>
            </div>
          </div>
          <div className="cliente-locales-container">
            <div className="cliente-table-locales">
              <div className="card-table-locales">
                <ListLocales
                  data={locales}
                  selection={selectLocal}
                  onSelectionChange={(e) => {
                    setSelectLocal(e.value);
                    console.log(e.value);
                  }}
                  onClickRefresh={() => getAllClientesLocales(cliente.id)}
                  onInputSearch={(e) => setGlobalFilterLocal(e.target.value)}
                  valueGlobalFilter={globalFilterLocal}
                >
                  <Column
                    field={"nombre_local"}
                    header="Nombre del Local"
                    className="column column-name-local"
                  ></Column>
                  <Column
                    field={"direccion"}
                    header="Dirección"
                    className="column column-direction"
                  ></Column>
                  <Column
                    header="Editar"
                    body={actionBodyTemplateEditLocales}
                    exportable={false}
                    style={{ minWidth: "8rem" }}
                    className="column column-edit"
                  ></Column>
                  <Column
                    body={actionBodyTemplateDeleteLocales}
                    header="Eliminar"
                    exportable={false}
                    style={{ minWidth: "8rem" }}
                    className="column column-delete"
                  ></Column>
                </ListLocales>
              </div>
            </div>
          </div>
        </Dialog>

        <Dialog
          visible={visibleCreateLocal}
          style={{ width: "450px" }}
          header={
            <>
              <i className="pi pi-users icon-create-proveedor"></i>Lista de
              Locales
            </>
          }
          modal
          className="p-fluid"
          footer={productDialogFooterLocalCreate}
          onHide={hideDialogLocalesCreate}
        >
          <div className="field">
            <label htmlFor="nombre_local">Nombre del Local</label>
            <InputText
              id="nombre_local"
              value={local.nombre_local}
              onChange={(e) => handleChangeNombreLocal(e)}
              required
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label htmlFor="direccion_local">Dirección</label>
            <InputText
              id="direccion_local"
              value={local.direccion}
              onChange={(e) => handleChangeDireccionLocal(e)}
              required
              autoComplete="off"
            />
          </div>
        </Dialog>

        <Dialog
          visible={visibleEditLocal}
          style={{ width: "450px" }}
          header={
            <>
              <i className="pi pi-users icon-create-proveedor"></i>Lista de
              Locales
            </>
          }
          modal
          className="p-fluid"
          footer={productDialogFooterLocalEdit}
          onHide={hideDialogLocalesEdit}
        >
          <div className="field">
            <label htmlFor="nombre_local">Nombre del Local</label>
            <InputText
              id="nombre_local"
              value={local.nombre_local}
              onChange={(e) => handleChangeNombreLocal(e)}
              required
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label htmlFor="direccion_local">Dirección</label>
            <InputText
              id="direccion_local"
              value={local.direccion}
              onChange={(e) => handleChangeDireccionLocal(e)}
              required
              autoComplete="off"
            />
          </div>
        </Dialog>
        <ConfirmDialog
          visible={visibleDeleteLocal}
          onHide={() => {
            setVisibleDeleteLocal(false);
            cleanLocal();
          }}
          message={`Esta seguro de eliminar el local ${local.nombre_local}`}
          header="Confirmación"
          icon="pi pi-exclamation-triangle"
          acceptLabel="Sí"
          accept={accept2}
          reject={reject2}
        />
      </Container>
    </>
  );
}
