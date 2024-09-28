import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import pictureDefault from "../../Imagenes/template-user.png"
import contextProveedor from '../../Page/Proveedores/context/ProveedorContext';
import { RadioButton } from 'primereact/radiobutton';
import { ListValidate, validateEmail, validateFields } from '../../helpers/ValidateData';
import { fetchDataDocument } from '../../Services/apisPeruService';
import { contactValidationRules } from '../../validationRules/Proveedores/contactValidateRules';
import useFormValidation from '../../hooks/useFormValidation';
import ValidatedInputedText from '../General/Inputs/ValidatedInputedText';
import { proveedorValidationRules } from '../../validationRules/Proveedores/ProveedorValidateRules';

const DialogProveedor = ({ visible, setVisibleDialog, sendContact, handleRemoveContacto, handleSubmit, SendProveedor,Desabilitar }) => {
    const { tiposDocumentos, proveedor, setProveedor, counter, setCounter, proveedores,
        contacto, setContacto, fotoURL, setFotoURL,
        fotoNewContactURL, setFotoNewContactURL, optionOperation,
        setOptionOperation, toast, checked, setChecked,
        initialContactValues, setInitialValues, initialProvedorValues,
        setProveedorValues, valueMaxDocumento, setValueMaxDocumento } = useContext(contextProveedor)

    const [validationRules, setValidationRules] = useState(proveedorValidationRules(valueMaxDocumento))


    const { handleChange: handleContactChange, validate: validateContact
        , errors: contactErrors, cleanValues: cleanValuesContact
        , setErrors: setErrorsContact, setValues: setValuesContact } =
        useFormValidation(initialContactValues, contactValidationRules);

    const { handleChange: handleProveedorChange, validate: validateProveedor
        , errors: proveedorErrors, cleanValues: cleanValuesProveedor
        , setErrors: setErrorsProveedor, setValues: setValuesProveedor, cleanValues: proveedorClean } =
        useFormValidation(initialProvedorValues, validationRules);

    useEffect(() => {
        setValuesContact({
            contacto: contacto?.contacto,
            telefono: contacto?.telefono,
            correo: contacto?.correo,
            comentario: contacto?.comentario
        }
        )
    }, [contacto])
    useEffect(() => {
        setValuesProveedor({
            numero_documento: proveedor?.numero_documento,
            tipo_documento_id: proveedor?.tipo_documento_id,
            razon_social: proveedor?.razon_social,
            direccion: proveedor?.direccion,
        }
        )
    }, [proveedor])
    useEffect(() => {
        setValidationRules(proveedorValidationRules(valueMaxDocumento))
    }, [valueMaxDocumento])

    const [mensajeError, setMensajeError] = useState("");
    const submitContacto = () => {
        let response = validateContact()
        if (contacto?.comentario != "") { if (response) { sendContact(); setMensajeError("") } }
        else {
            setMensajeError("El comentario es requerido")
        }
    }
    const submitProvedoor = async () => {
        let response = validateProveedor()
        if (response) {
            let isCreate = await SendProveedor();
            if (isCreate) {
                cleanFields()
                cleanValuesProveedor()
                cleanValuesContact()


            }
        }

    }
    const onHide = () => {
        setVisibleDialog()
        cleanValuesContact()
        proveedorClean()

    }
    const productDialogFooter = (
        <React.Fragment>
            <Button
                label="Cancelar"
                className="bg-white"
                style={{ color: "#567", fontWeight: "100" }}
                onClick={onHide}
            />
            <Button
                label="Guardar"

                className="p-button-success"
                style={{ backgroundColor: "#3B75F1", borderColor: "#3B75F1" }}
                onClick={() => {
                    submitProvedoor()
                }}
                disabled={Desabilitar}
            />
        </React.Fragment>
    );


    const handleChangeTipoDocumento = (e) => {
        const selectedTipoDocumento = e.value;
        handleProveedorChange(e)
        setProveedor({
            ...proveedor,
            tipo_documento: selectedTipoDocumento,
            tipo_documento_id: selectedTipoDocumento ? selectedTipoDocumento.id : "",
            numero_documento: '',
            razon_social: '',
        });
        if (proveedorErrors?.numero_documento !== "") {
            setErrorsProveedor((prevState) => ({ ...prevState, numero_documento: "" }))
        }
        switch (selectedTipoDocumento?.nombre) {
            case "RUC":
                setValueMaxDocumento(11);
                break;
            case "DNI":
                setValueMaxDocumento(8);
                break;
            default:
                setValueMaxDocumento(11);
        }
    };
    const handleChangeNumeroDocumento = (e) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return;

        setProveedor(prevProveedor => ({
            ...prevProveedor,
            numero_documento: value.slice(0, valueMaxDocumento)
        }));
        handleProveedorChange(e)
    };
    const handleChangeRazonSocial = (e) => {
        setProveedor({
            id: proveedor.id,
            numero_documento: proveedor.numero_documento,
            tipo_documento_id: proveedor.tipo_documento_id,
            razon_social: e.target.value,
            direccion: proveedor.direccion,
            telefono: proveedor.telefono,
            contactos: proveedor.contactos,
            correo: proveedor.correo,
        });
        handleProveedorChange(e)
    };
    const handleChangeDireccion = (e) => {
        setProveedor({
            id: proveedor.id,
            numero_documento: proveedor.numero_documento,
            tipo_documento_id: proveedor.tipo_documento_id,
            razon_social: proveedor.razon_social,
            direccion: e.target.value,
            telefono: proveedor.telefono,
            contactos: proveedor.contactos,
            correo: proveedor.correo,
        });
        handleProveedorChange(e)
    };
    const showToast = (tipo, titulo, detalle) => {
        toast.current.show({
            severity: tipo,
            summary: titulo,
            detail: detalle,
            life: 3000,
        });
    };



    const handleChecked = (e, index) => {
        if (checked == index) {
            setChecked(null)
            setFotoURL(null)
            if (optionOperation == 2) {
                setContacto({ contacto: "", telefono: "", correo: "", foto: "" })
                setValuesContact({ contacto: "", telefono: "", correo: "", foto: "" })
                setFotoNewContactURL(null)
                setOptionOperation(1)
            }
        } else {
            setChecked(index)
            if (optionOperation == 2) {
                setContacto({ contacto: "", telefono: "", correo: "", foto: "" })
                setValuesContact({ contacto: "", telefono: "", correo: "", foto: "" })
                setOptionOperation(1)
                setFotoNewContactURL(null)
            }
            if (proveedor?.contactos?.[index]?.foto instanceof File) {
                setFotoURL(URL.createObjectURL(proveedor?.contactos?.[index]?.foto))
            } else if (proveedor?.contactos?.[index]?.url_foto) {
                setFotoURL(proveedor?.contactos?.[index]?.url_foto)
            } else {
                setFotoURL(null)
            }
        }
    }

    const handleChangeInputContact = (e) => {
        handleContactChange(e)
        setContacto({
            ...contacto, [e.target.name]: e.target.value
        })
    }

    const handleChangeTelefono = (e) => {
        handleContactChange(e)
        if (/^\d*$/.test(e.target.value)) {
            setContacto({
                ...contacto, telefono: e.target.value
            })
        }
    }

    const handleClickEditContact = () => {
        if (checked != null) {
            setContacto(proveedor?.contactos?.[checked])
            setValuesContact({
                contacto: proveedor?.contactos?.[checked]?.contacto
                , telefono: proveedor?.contactos?.[checked]?.telefono,
                correo: proveedor?.contactos?.[checked]?.correo
            })
            setOptionOperation(2)
            if (proveedor?.contactos?.[checked]?.foto instanceof File) {
                setFotoNewContactURL(URL.createObjectURL(proveedor?.contactos?.[checked]?.foto))
            } else if (proveedor?.contactos?.[checked]?.url_foto) {
                setFotoNewContactURL(proveedor?.contactos?.[checked]?.url_foto)
            }
            else {
                setFotoNewContactURL(null)
            }
        } else {
            setOptionOperation(1)
        }
    }
    const handleClickCancel = () => {
        if (optionOperation == 2) {
            setOptionOperation(1)
        }
        cleanFields()


    }
    const cleanFields = () => {
        setContacto({ contacto: "", telefono: "", correo: "", foto: "", comentario: "" })
        setFotoNewContactURL(null)
        cleanValuesContact()
        setFotoURL(null)
        setChecked(null)
        setMensajeError("")
    }
    const [visibleDeleteContact, setVisibleDeleteContact] = useState(false)
    const rejectDeleteContact = () => {
        setVisibleDeleteContact(false)
    }

    const getRazonSocialLabel = () => {
        if (!proveedor.tipo_documento_id) return "Razón Social* / Nombre completo*";

        const tipoDoc = tiposDocumentos.find(doc => doc.id === proveedor.tipo_documento_id);
        if (!tipoDoc) return "Razón Social* / Nombre completo*";

        return tipoDoc.nombre === "RUC" ? "Razón Social*" : "Nombre completo*";
    };

    const validateDocument = async () => {
        if (!proveedor.tipo_documento_id || !proveedor.numero_documento) {
            showToast("error", "Error", "Seleccione un tipo de documento e ingrese un número");
            return;
        }
        const isRUC = proveedor.tipo_documento_id === 2;
        const isDNI = proveedor.tipo_documento_id === 1;

        if ((isRUC && proveedor.numero_documento.length !== 11) ||
            (isDNI && proveedor.numero_documento.length !== 8)) {
            showToast("error", "Error", `El ${isRUC ? 'RUC' : 'DNI'} debe tener ${isRUC ? '11' : '8'} dígitos`);
            return;
        }
        const endpoint = isRUC ? 'ruc' : 'dni';
        try {
            const response = await fetchDataDocument(endpoint, proveedor.numero_documento)
            if (response.success === false) {
                showToast("error", "Error", `No se encontraron datos para el ${isRUC ? 'RUC' : 'DNI'} ingresado`);
                return;
            }
            let razonSocial = '';
            if (isRUC) {
                razonSocial = response.razonSocial;
            } else {
                razonSocial = `${response.nombres} ${response.apellidoPaterno} ${response.apellidoMaterno}`;
            }
            setProveedor(prevState => ({
                ...prevState,
                razon_social: razonSocial
            }));
            if (razonSocial != "") {
                setErrorsProveedor({})
            }


            showToast("success", "Éxito", "Datos validados correctamente");
        } catch (error) {
            console.error("Error al validar documento:", error);
            showToast("error", "Error", "Hubo un problema al validar el documento");
        }
    };

    const handlerchangefile = (e) => {
        const archivo = e.target.files[0];
        if (archivo) {
            setContacto({ ...contacto, foto: archivo });
            const url = URL.createObjectURL(archivo);
            setFotoNewContactURL(url);
        }
    };
    const ref_file = useRef(null)
    const btn_upload_file = () => {
        ref_file.current.click();
    };
    const valueOfDocument = (document_id) => {
        let indexDocument = tiposDocumentos?.findIndex((doc) => doc?.id === document_id);
        if (indexDocument !== -1) {
            return tiposDocumentos[indexDocument];
        }
        return null;
    };


    return (
        <div>
            <Dialog
                visible={visible}
                style={{ width: "1600px", }}
                header={
                    <>
                        <i className="pi pi-briefcase icon-create-proveedor"></i>Lista de
                        Proveedores
                    </>
                }
                modal
                className="p-fluid"
                footer={productDialogFooter}
                onHide={onHide}
            >
                <div className="flex  direction-column ">
                    <div style={{ width: '50%', marginRight: '15px' }}>
                        <div className="formulario-list-container form-provedor flex-1" style={{ width: '100%' }}>
                            <div className="field">
                                <label htmlFor="tipo_documento">Tipo de Documento*</label>
                                <Dropdown
                                    id="tipo_documento"
                                    value={valueOfDocument(proveedor?.tipo_documento_id)}
                                    options={tiposDocumentos}
                                    onChange={handleChangeTipoDocumento}
                                    optionLabel="nombre"
                                    placeholder="Selecciona un tipo de documento"
                                    autoFocus
                                    name='tipo_documento_id'
                                    className={`form-provedor__input form-provedor__input-select ${proveedorErrors?.tipo_documento_id ? "p-invalid" : ""}`}

                                />
                                {proveedorErrors?.tipo_documento_id && <span style={{ color: "red" }}>{proveedorErrors?.tipo_documento_id}</span>}

                            </div>
                            <div className="field" style={{ marginTop: '10px' }}>
                                <label htmlFor="numero_documento">Número Documento*</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <ValidatedInputedText
                                        id="numero_documento"
                                        value={proveedor?.numero_documento}
                                        onChange={handleChangeNumeroDocumento}
                                        required
                                        keyfilter="pint"
                                        autoComplete="off"
                                        style={{ height: "40px" }}
                                        className={"w-full "}
                                        containerClass={"flex-1"}
                                        maxLength={valueMaxDocumento}
                                        name="numero_documento"
                                        valueError={proveedorErrors?.numero_documento}
                                    />
                                    <Button
                                        label="Validar"
                                        style={{ height: "40px" }}
                                        onClick={validateDocument}
                                        className='flex-1'
                                        disabled={
                                            !proveedor?.tipo_documento_id ||
                                            !proveedor?.numero_documento ||
                                            (proveedor?.tipo_documento?.nombre === "RUC" && proveedor?.numero_documento.length !== 11) ||
                                            (proveedor?.tipo_documento?.nombre === "DNI" && proveedor?.numero_documento.length !== 8)
                                        }
                                    />

                                </div>
                            </div>
                            <div className="field" style={{ marginTop: '10px' }}>
                                <label htmlFor="razon_social">{getRazonSocialLabel()}</label>
                                <ValidatedInputedText
                                    id="razon_social"
                                    value={proveedor?.razon_social}
                                    onChange={(e) => handleChangeRazonSocial(e)}
                                    required
                                    autoComplete="off"
                                    className="form-provedor__input"
                                    name="razon_social"
                                    valueError={proveedorErrors?.razon_social}

                                />
                            </div>
                            <div className="field" style={{ marginTop: '10px' }}>
                                <label htmlFor="direccion">Dirección</label>
                                <ValidatedInputedText
                                    id="direccion"
                                    value={proveedor?.direccion}
                                    onChange={(e) => handleChangeDireccion(e)}
                                    required
                                    autoComplete="off"
                                    className="form-provedor__input"
                                    name="direccion"
                                    valueError={proveedorErrors?.direccion}

                                />
                            </div>

                        </div>
                        <div className="card card-form-contact" >
                            <Card title={<p className="card-form-contact__title">Registro de Nuevos Contactos</p>} style={{ margin: '30px 10px 10px 10px', height: "auto" }}>
                                <div className="container-form-contact  w-full pt-2">
                                    <div className="flex gap-4 ">
                                        <div className=' w-full flex flex-column justify-content-center align-items-center'>
                                            <div style={{ marginBottom: '10px', width: "100%", display: "block" }}>
                                                <span>Nombre completo</span>
                                                <ValidatedInputedText style={{ height: '40px', marginTop: '10px', }} placeholder="Ingrese nombres completos"
                                                    name="contacto" value={contacto?.contacto} onChange={handleChangeInputContact} valueError={contactErrors.contacto} />

                                            </div>
                                            <div style={{ marginBottom: '10px', display: 'flex', width: '100%' }}>
                                                <div style={{ flex: '1', marginRight: '10px' }} className=''>
                                                    <span>Teléfono</span>
                                                    <ValidatedInputedText style={{ marginTop: '10px', marginBottom: '5px', height: '40px' }} placeholder="Ingrese teléfono"
                                                        name="telefono" value={contacto?.telefono} onChange={handleChangeTelefono}
                                                        autoComplete="off" maxLength={9} valueError={contactErrors.telefono} />
                                                </div>
                                                <div style={{ flex: '1' }}>
                                                    <span>Correo</span>
                                                    <ValidatedInputedText style={{ marginTop: '10px', height: '40px' }} placeholder="Ingrese correo"
                                                        name="correo" value={contacto?.correo} onChange={handleChangeInputContact} keyfilter="email"
                                                        valueError={contactErrors.correo}
                                                    />
                                                </div>

                                            </div>
                                            <div style={{ marginBottom: '10px', width: "100%", height: "25px" }}>

                                                <span>Comentario</span>
                                                <ValidatedInputedText
                                                    name='comentario'
                                                    style={{ marginTop: "10px", height: "50px", width: "85%" }}
                                                    value={contacto?.comentario}
                                                    placeholder='Ingrese un comentario'
                                                    onChange={handleChangeInputContact}
                                                    valueError={contactErrors.comentario}
                                                />

                                                {/* <small style={{color:"red"}}> {mensajeError} </small> */}

                                            </div>

                                        </div>

                                        <div>
                                            <div style={{ width: 'auto', textAlign: 'center' }} className="h-full">
                                                <div className='flex flex-column justify-content-center h-full'>
                                                    <div >
                                                        <img src={fotoNewContactURL || pictureDefault} alt="Contacto" className="circular-image " />
                                                        <Button icon="pi pi-camera" style={{ width: "25px", height: "16px", bottom: "17px" }} className="relative" onClick={btn_upload_file} />
                                                        <input accept="image/*" style={{ display: "none" }} ref={ref_file} type="file" onChange={handlerchangefile} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                        <Button style={{
                                            width: '100px', backgroundColor: '#FFECEC', color: '#FF6767',
                                            borderColor: '#FFECEC'
                                        }}
                                            label={`${optionOperation == 1 ? 'Limpiar' : "Cancelar"}`}
                                            onClick={handleClickCancel}
                                        />
                                        <Button style={{ width: 'auto', backgroundColor: '#FFFFFF', color: '#00A15C', borderColor: '#00A15C' }}
                                            label={`${optionOperation == 1 ? 'Agregar' : "Actualizar"}`} onClick={submitContacto} />
                                    </div>

                                </div>
                            </Card>
                        </div>
                    </div>
                    <div style={{ width: '50%', marginLeft: '15px' }} className='flex flex-column'>
                        <Card style={{ margin: '10px', height: "auto" }}>
                            <div className="flex flex-block w-full gap-2">
                                <div style={{ width: 'auto', textAlign: 'center' }} className="flex align-items-center">
                                    <img src={fotoURL || pictureDefault} alt="Contacto" className="circular-image" />
                                </div>
                                <div style={{ width: '100%', margin: '10px' }} className=" ">
                                    <div className="flex flex-column">
                                        <div className="flex flex-column" style={{ marginBottom: '10px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <p className="contact-name"
                                                    style={{ marginTop: '0px', marginBottom: '0px', flexGrow: 1 }}>
                                                    {proveedor?.contactos?.[checked]?.contacto ? proveedor?.contactos?.[checked]?.contacto : ""}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-column gap-2" >
                                            <div>
                                                <span style={{ color: '#3B75F1', fontWeight: "600" }}>Datos Generales</span>
                                                <Button onClick={handleClickEditContact} tooltip="Editar contacto" icon="pi pi-pencil" className="button-edit-contact" />
                                            </div>
                                            <div className="flex flex-column " style={{ marginLeft: "-6px" }}>
                                                <span style={{ margin: '0px' }}>
                                                    <i className="pi pi-phone red-circle-icon" style={{ fontSize: '1rem', margin: '5px' }} />
                                                    Celular: {proveedor?.contactos?.[checked]?.telefono ? proveedor?.contactos?.[checked]?.telefono : ""}
                                                </span>



                                                <span style={{ margin: '0px' }}>
                                                    <i className="pi pi-comment red-circle-icon" style={{ fontSize: '1rem', margin: '5px' }} />Correo:
                                                    {proveedor?.contactos?.[checked]?.correo ? ` ${proveedor?.contactos?.[checked]?.correo}` : ""}
                                                </span>
                                                <span style={{ margin: '0px' }}>
                                                    <i className="pi pi-user red-circle-icon" style={{ fontSize: '1rem', margin: '5px' }} />Nombre y apellidos:
                                                    {proveedor?.contactos?.[checked]?.contacto ? ` ${proveedor?.contactos?.[checked]?.contacto}` : ""}

                                                </span>
                                                <span style={{ margin: '0px' }}>
                                                    <i className="pi pi-comment red-circle-icon" style={{ fontSize: '1rem', margin: '5px' }} />Comentario:
                                                    {proveedor?.contactos?.[checked]?.comentario ? ` ${proveedor?.contactos?.[checked]?.comentario}` : ""}

                                                </span>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </Card>
                        <Card style={{ margin: '10px', height: '' }} title={<p className="card-form-contact__title">Lista de Nuevos contactos</p>}>
                            <div className="contact-list-container w-full p-2 ">
                                {console.log("contactos", proveedor?.contactos)}
                                {proveedor?.contactos?.map((contact, index) => (
                                    <div key={index} style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <RadioButton
                                                onChange={(e) => { handleChecked(e, index) }} checked={index == checked} />
                                            <span style={{ marginLeft: '8px' }}>{contact?.contacto}</span>
                                        </div>
                                        <Button style={{ width: '50px', backgroundColor: '#ffffff', color: 'red', borderColor: 'transparent' }} icon="pi pi-trash" severity="danger"
                                            className='border-circle'
                                            onClick={() => { handleRemoveContacto(contact) 
                                                

                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Card>

                    </div>
                </div>
            </Dialog>


        </div>
    )
}

export default DialogProveedor
