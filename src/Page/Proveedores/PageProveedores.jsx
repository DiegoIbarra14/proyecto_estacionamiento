import React, { useEffect, useState, useRef, useContext } from "react";
import { Column } from "primereact/column";
import Table from "../../Components/Proveedor/Table";
import http from "../../http-common";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import "./pageProveedores.css";
import Container from "../../Components/Container/Container";
import UsuarioService from "../../Services/UsuarioService";
import { useNavigate } from "react-router-dom";
import AuthUser from '../../AuthUser';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import pictureDefault from '../../Imagenes/template-user.png'
import { convertToFormData } from "../../helpers/ConverteToFormData";
import DialogProveedor from "../../Components/Proveedor/DialogProveedor";
import contextProveedor from "./context/ProveedorContext";
import { ListValidate, validateFields } from "../../helpers/ValidateData";
import { isArray } from "chart.js/helpers";
import { createContact, deleteContact, getAllContacts, putContact } from "../../Services/ContactosService";
import { showToast } from "../../helpers/showToast";

export default function PageProveedores() {
  const [Desabilitar, setDesabilitar] = useState(false)
  const { http, getToken, deleteToken } = AuthUser();
  const { tiposDocumentos, setTiposDocumentos, proveedores,
    setProveedores, counter, setCounter, proveedor, setProveedor,
    visibleCreateContact, setVisibleCreateContact, visibleEditContact,
    setVisibleEditContact, optionOperation, setOptionOperation, toast, checked, setChecked, contacto, setContacto,
    fotoURL, setFotoURL, fotoNewContactURL, setFotoNewContactURL, valueMaxDocumento, setValueMaxDocumento } = useContext(contextProveedor)
  let navigate = useNavigate();
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [select, setSelect] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  //Opcion de operacion
  // 1==>Crear Contacto
  //2 ==> Editar Contacto

  const getAllTiposDocumentos = () => {
    http.get("/usuarios/tiposdocumentos/get")
      .then((response) => {
        let documentos = response.data.data
        let filterDocument = documentos?.filter((doc) => doc?.id == 1 || doc?.id == 2)
        setTiposDocumentos(filterDocument);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAllProveedores = async () => {
    try {
      let response = await http.get("/proveedores/get")
      setProveedores(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllTiposDocumentos();
    getAllProveedores();
  }, [setTiposDocumentos]);

  //necesario para el crud
  const actionBodyTemplateEdit = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning"
          onClick={() => editProveedor(rowData)}
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
          onClick={() => confirmDeleteProveedor(rowData)}
        />
      </React.Fragment>
    );
  };
  const confirmDeleteProveedor = (proveedor) => {
    setProveedor(proveedor);
    setVisibleDelete(true);
  };
  const editProveedor = async (proveedor) => {
    try {
      let contactosResponse = await getAllContacts(proveedor?.id);
      setProveedor({
        ...proveedor,
        contactos: contactosResponse?.data?.data || [],
      });
    } catch (error) {
      console.error("Error al obtener contactos:", error);
      setProveedor({
        ...proveedor,
        contactos: [], // Asegúrate de que el estado de contactos esté vacío
      });
    }
    setValueMaxDocumento(proveedor?.tipo_documento_id == 1 ? 8 : 11);
    setVisibleEditContact(true); // Abre el popup de edición

    // setProveedor({
    //   id: proveedor?.id,
    //   numero_documento: proveedor?.numero_documento,
    //   tipo_documento_id: proveedor?.tipo_documento_id,
    //   razon_social: proveedor?.razon_social,
    //   direccion: proveedor?.direccion,
    //   contactos: proveedor?.contactos,
    // });
    //setValueMaxDocumento(proveedor?.tipo_documento_id == 1 ? 8 : 11)
    //setVisibleEditContact(true);
  };

  //para el modal de crear
  const hideDialogCreate = () => {
    //setSubmitted(false);
    setVisibleCreateContact(false);
    setVisibleEdit(false);
    setFotoURL(null)
    cleanFieldsContacto()


  };
  const hideDialogEdit = () => {
    //setSubmitted(false);
    setVisibleEditContact(false);
    setFotoURL(null)
    setChecked(null)
  };
  const cleanProveedor = () => {
    setProveedor({
      id: 0,
      tipo_documento: "",
      numero_documento: "",
      tipo_documento_id: "",
      razon_social: "",
      direccion: "",
      telefono: "",
      contactos: [],
      correo: "",
    });

  };
  const cleanFieldsContacto = () => {
    setContacto({
      contacto: "",
      telefono: "",
      correo: "",
      foto: "",
      comentario: ""
    })
    setFotoNewContactURL(null)
    setFotoURL(null)
    setOptionOperation(1)
  }
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
  };

  const handleSubmitCreate = async () => {
    let data = convertToFormData(proveedor)
    try {
      setDesabilitar(true)
      let response = await http.post("/proveedores/create", data)
      showToast(
        "success",
        "Proveedor Creado",
        `Se creo el proveedor ${proveedor.razon_social} correctamente`, toast
      );
      getAllProveedores();
      setVisibleCreateContact(false)
      return true
    } catch (error) {
      console.log(error?.response);
      if (error?.response) {
        if (isArray(error?.response?.data?.errors)) {
          showToast(
            "error",
            "Proveedor No Creado",
            `${error?.response?.data?.errors?.[0]?.error}`, toast
          );
        } else {
          showToast(
            "error",
            "Proveedor No Creado",
            `${error?.response?.data?.error}`, toast
          );
        }
      } else if (error?.response?.data?.status !== 400) {
        showToast(
          "error",
          "Proveedor No Creado",
          `${error?.message}`,
          toast
        );
      }
      return false
    }
    finally{
      setTimeout(() => {
        setDesabilitar(false);
      }, 5000);
    }
  };
  const handleSubmitUpdate = () => {
    let data = {
      tipo_documento_id: proveedor?.tipo_documento_id,
      numero_documento: proveedor?.numero_documento,
      razon_social: proveedor?.razon_social,
      direccion: proveedor?.direccion
    }
    try {
      http.put(`/proveedores/update/${proveedor.id}`, data)
        .then((response) => {
          showToast(
            "success",
            "Proveedor Editado",
            `Se Edito el proveedor ${proveedor.razon_social} correctamente`, toast
          );
          getAllProveedores();
          setVisibleEditContact(false)
          setFotoURL(null)
          setChecked(null)
          setContacto({ contacto: "", telefono: "", correo: "", comentario: "" })
          setFotoNewContactURL(null)
        })
        .catch((error) => {
          console.log(error);
          showToast(
            "error",
            "Proveedor No Creado",
            `No Se creo el proveedor ${proveedor.razon_social}`, toast
          );
          return false
        });

    } catch (error) {
      console.log(error?.response);
      if (error?.response) {
        if (isArray(error?.response?.data?.errors)) {
          showToast(
            "error",
            "Proveedor No Creado",
            `${error?.response?.data?.errors?.[0]?.error}`
          );
        } else {
          showToast(
            "error",
            "Proveedor No Creado",
            `${error?.response?.data?.error}`
          );
        }
      } else if (error?.response?.data?.status !== 400) {
        showToast(
          "error",
          "Proveedor No Creado",
          `${error?.message}`,
          toast
        );
      }

    }
  };

  const handleSubmitDelete = () => {
    http.delete(`/proveedores/delete/${proveedor.id}`)
      .then((response) => {
        showToast(
          "success",
          "Proveedor Eliminado",
          `Se elimino correctamente el proveedor ${proveedor.razon_social}`, toast
        );
        getAllProveedores();
      })
      .catch((error) => {
        console.log(error);
        showToast(
          "errro",
          "Proveedor No Eliminado",
          `No Se creo el proveedor ${proveedor.razon_social}`
        );
      });
  };
  const handleRemoveContacto = (contactToRemove) => {
    if (contacto?.code == contactToRemove?.code) {
      setFotoURL(null)
      setFotoNewContactURL(null)
      setContacto({ contacto: "", telefono: "", correo: "", foto: "", comentario: "" })
      setOptionOperation(1)
    }
    setProveedor((prevState) => ({
      ...prevState,
      contactos: prevState.contactos.filter(contact => contact?.code !== contactToRemove?.code)
    }));
    if (contacto?.id == contactToRemove?.id) {
      setFotoURL(null)
      setFotoNewContactURL(null)
      setContacto({ contacto: "", telefono: "", correo: "", foto: "", comentario: "" })
      setOptionOperation(1)
      setChecked(null)
    }
  }
  const handleRemoveContactoDialogEdit = async (contactToRemove) => {
    try {
      let response = await deleteContact(contactToRemove?.id);
      let contactos = await getAllContacts(proveedor?.id);
      await getAllProveedores();

      setProveedor((prevState) => ({
        ...prevState,
        contactos: contactos?.data?.data,
      }));

      // if (contacto?.id == contactToRemove?.id) {
      //   setFotoURL(null);
      //   setFotoNewContactURL(null);
      //   setContacto({ contacto: "", telefono: "", correo: "", foto: "", comentario: "" });
      //   setOptionOperation(1);
      //   setChecked(null);
      // }
      await getAllProveedores()
      showToast("success", "Contacto eliminado", "Se eliminó el contacto con éxito", toast);
      cleanFieldsContacto()
    } catch (error) {
      console.log("Error al eliminar contacto", error);
      if (error.response.status === 404) {
        setProveedor((prevState) => ({
          ...prevState,
          contactos: [],
        }));
        showToast("success", "Contacto eliminado", "Se eliminó el contacto con éxito", toast);
        cleanFieldsContacto()
      }
      else {
        showToast("error", "Error", "Error interno del servidor", toast);
        console.log("Else - Error al eliminar contacto", error);
      }
    }
  }
  const [visibleDeleteContact, setVisibleDeleteContact] = useState(false)
  const rejectDeleteContact = () => {
    setVisibleDeleteContact(false)
  }
  const sendContact = () => {
    if (optionOperation == 1) {
      handleAddContact()
    } else if (optionOperation == 2) {
      handleUpdateContacto()
    }
  }
  const sendContactDialogEdit = () => {
    if (optionOperation == 1) {
      handleAddContactDialogEdit()

    } else if (optionOperation == 2) {
      handleUpdateContactoDialogEdit()
    }
  }
  const showConfirmDialog = (contact) => {
    setContacto(contact)
    setVisibleDeleteContact(true)
  }

  const handleAddContact = () => {
    let newContact = { ...contacto, code: counter }
    setCounter(counter + 1)
    setProveedor((prevState) => ({
      ...prevState,
      contactos: [...prevState.contactos, newContact]
    }));
    cleanFieldsContacto()
  }
  const handleUpdateContactoDialogEdit = async () => {
    let data = convertToFormData(contacto)
    try {
      let response = await putContact(data, contacto?.id)
      let contactos = await getAllContacts(proveedor?.id)
      await getAllProveedores()
      setProveedor((prevState) => ({
        ...prevState,
        contactos: contactos?.data?.data
      }));
      showToast("success", "Contacto creado", "Se actualizó el contacto correctamente", toast)
      cleanFieldsContacto()
      if (contacto?.id) {
        if ((contacto?.foto instanceof File)) {
          let newFoto = URL.createObjectURL(contacto?.foto)
          setFotoURL(newFoto)
        } else {
          setFotoURL(proveedor?.contactos?.[checked]?.url_foto)
        }
      }
    } catch (error) {
      if (error?.response) {
        if (isArray(error?.response?.data?.errors)) {
          showToast(
            "error",
            "Proveedor No Creado",
            `${error?.response?.data?.errors?.[0]?.error}`, toast
          );
        } else {
          showToast(
            "error",
            "Proveedor No Creado",
            `${error?.response?.data?.error}`, toast
          );
        }
      } else if (error?.response?.data?.status !== 400) {
        showToast(
          "error",
          "Proveedor No Creado",
          `${error?.message}`,
          toast
        );
      }
    }

  };
  const handleAddContactDialogEdit = async () => {
    let data = convertToFormData(contacto)
    try {
      let response = await createContact(data, proveedor?.id)
      let contactos = await getAllContacts(proveedor?.id)
      await getAllProveedores()
      setProveedor((prevState) => ({
        ...prevState,
        contactos: contactos?.data?.data
      }));
      showToast("success", "Contacto creado", "Se ha creado un nuevo contacto correctamente", toast)
      cleanFieldsContacto()

    } catch (error) {
      if (error?.response) {
        if (isArray(error?.response?.data?.errors)) {
          showToast(
            "error",
            "Proveedor No Creado",
            `${error?.response?.data?.errors?.[0]?.error}`, toast
          );
        } else {
          showToast(
            "error",
            "Proveedor No Creado",
            `${error?.response?.data?.error}`, toast
          );
        }
      } else if (error?.response?.data?.status !== 400) {
        showToast(
          "error",
          "Proveedor No Creado",
          `${error?.message}`,
          toast
        );
      }
    }
  }
  const handleUpdateContacto = () => {
    let indexContact = proveedor?.contactos?.findIndex((_contacto) => contacto?.code == _contacto?.code)
    if (indexContact !== -1) {
      setProveedor((prevState) => {
        const updatedContactos = [...prevState.contactos];
        updatedContactos[indexContact] = contacto;
        return {
          ...prevState,
          contactos: updatedContactos
        };
      });
      let newFoto = URL.createObjectURL(contacto?.foto)
      setFotoURL(newFoto)
      cleanFieldsContacto()
    }
  };
  const acceptDeleteContact = () => {
    handleRemoveContactoDialogEdit(contacto)

  }

  const formatValue = (value) => {
    if (value === null || value === '' || value === undefined) {
      return '---';
    }
    return value;
  };

  return (
    <>
      <Container url={"getProveedores"}>
        <Toast ref={toast} />
        <div className="p-container-headerPrima">
          <div className="p-container-titulo">
            <h1 style={{ color: '#04638A' }} className="container-titulo-table">Lista de Proveedores</h1>
          </div>
          <div className="container-descripcion">
            <div className="container-descripcion-table">
              <p>
                A continuación, se visualiza la lista de proveedores registrados
                en el sistema.
              </p>
            </div>
            <div className="container-descripcion-button-add">
              <button
                onClick={() => {
                  cleanProveedor();
                  setVisibleCreateContact(true);
                }}
                className="button button-crear"
              >
                Crear Proveedor <i className="pi pi-plus mr-2"></i>
              </button>

            </div>
          </div>
        </div>
        <Table
          onInputSearch={(e) => setGlobalFilter(e.target.value)}
          valueGlobalFilter={globalFilter}
          data={proveedores}
          selection={select}
          onSelectionChange={(e) => {
            setSelect(e.value);
          }}
          onClickRefresh={getAllProveedores}
        >
          <Column
            field={
              "tipo_documento" != null
                ? "tipo_documento.nombre"
                : "tipo_documento"
            }
            header="Tipo DOC"

          ></Column>

          <Column field="numero_documento" header="Número DOC" body={(rowData) => formatValue(rowData.numero_documento)} ></Column>
          <Column field="razon_social" header="Razón Social / Nombre completo" body={(rowData) => formatValue(rowData.razon_social)}></Column>
          <Column field="direccion" header="Dirección" body={(rowData) => formatValue(rowData.direccion)} ></Column>
          {/* <Column field="contacto" header="Contacto" ></Column>
          <Column field="telefono" header="Teléfono" ></Column>
          <Column field="correo" header="Correo" ></Column> */}
          <Column
            header="Editar"
            body={actionBodyTemplateEdit}
            exportable={false}
            className="column column-edit" /*Editar*/
            style={{ minWidth: "8rem" }}
          ></Column>
          <Column
            body={actionBodyTemplateDelete}
            header="Eliminar"
            className="column column-delete" /*Eliminar*/
            exportable={false}
            style={{ minWidth: "8rem" }}
          ></Column>
        </Table>

        <DialogProveedor visible={visibleCreateContact}
          setVisibleDialog={hideDialogCreate}
          sendContact={sendContact}
          handleRemoveContacto={handleRemoveContacto}
          SendProveedor={handleSubmitCreate}
          maxValueDocument={contacto?.tipo_documento_id == 1 ? 8 : 11}
          Desabilitar={Desabilitar}
        >
        </DialogProveedor>
        {/* DialogEditarProvedor */}
        <DialogProveedor visible={visibleEditContact}
          setVisibleDialog={hideDialogEdit}
          sendContact={sendContactDialogEdit}
          handleRemoveContacto={showConfirmDialog}
          SendProveedor={handleSubmitUpdate}
          valueDocument={proveedor?.tipo_documento_id == 1 ? 8 : 11}
          Desabilitar={Desabilitar}
        >
        </DialogProveedor>
        <ConfirmDialog
          visible={visibleDelete}
          onHide={() => {
            setVisibleDelete(false);
            cleanProveedor();
          }}
          message={`Esta seguro de eliminar al cliente ${proveedor.razon_social}`}
          header="Confirmación"
          icon="pi pi-exclamation-triangle"
          accept={accept}
          reject={reject}
          acceptLabel="Sí"
        />
        <ConfirmDialog
          visible={visibleDeleteContact}
          onHide={() => {
            setVisibleDeleteContact(false);

          }}
          message={`Esta seguro de eliminar al contacto ${contacto?.contacto}`}
          header="Confirmación"
          icon="pi pi-exclamation-triangle"
          accept={acceptDeleteContact}
          reject={rejectDeleteContact}
          acceptLabel="Sí"
        />
      </Container>
    </>
  );
}
