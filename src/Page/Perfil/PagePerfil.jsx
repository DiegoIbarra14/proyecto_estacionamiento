import React, { useEffect, useRef, useState } from 'react'
import Container from '../../Components/Container/Container'
import { InputText } from 'primereact/inputtext'
import { Divider } from 'primereact/divider'
import { Button } from 'primereact/button'
import "./PagePerfil.css"
import { Toast } from 'primereact/toast'
import { Dialog } from 'primereact/dialog'
import { Password } from 'primereact/password'
import usuario from "../../Imagenes/photo-perfil-default.png";
import LoginService from '../../Services/LoginService'
import AuthUser from '../../AuthUser'
import { useNotificaciones } from '../../NotificacionesContext'
import { FileUpload } from 'primereact/fileupload';

const PagePerfil = () => {

    // const { http } = AuthUser();
    const { perfil, setPerfil } = useNotificaciones();

    const [userID, setUserID] = useState(JSON.parse(localStorage.getItem('id')));
    const toast = useRef(null);
    const showToast = (tipo, titulo, detalle) => {
        toast.current.show({
            severity: tipo,
            summary: titulo,
            detail: detalle,
            life: 3000,
        });
    };

    //función para traer data User
    useEffect(() => {
        handleMy();
    }, []);
    const handleMy = async () => {
        try {
            const response = await http.post("/my");
            setPerfil(response?.data);
        } catch (e) {
            console.log(e);
        }
    };

    //campos para mis validaciones
    const [username, setUsername] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [contra_nueva, setContraNueva] = useState("");
    const [contra_confi, setContraConfi] = useState("");
    const [validacion, setValidacion] = useState(false);
    const [dataUser, setDataUser] = useState(null);

    //validar credenciales
    const validarCredenciales = () => {
        const data = {
            "username": username,
            "password": contrasena
        }
        http.post(`/login`, data)
            .then((response) => {
                showToast("success", "Credenciales correctas", `Usuario y contraseña correcta`);
                setDataUser(response.data);
                setValidacion(true);
            })
            .catch((error) => {
                console.log(error);
                showToast("error", "Credenciales incorrectos", `Ingrese usuario o contraseña nuevamente`);
            });
    }

    const [mensaje, setMensaje] = useState("");
    const enviarNuevaContrasena = () => {

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (contra_nueva == contra_confi) {
            if (!passwordRegex.test(contra_nueva)) {
                setMensaje("La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.");
            }
            else {
                const data = {
                    "password": contra_nueva
                }
                http.put(`change/password/${dataUser.id}`, data)
                    .then((response) => {
                        showToast("success", "Contraseña nueva correcta", `Se actualizó contraseña`);
                        console.log("si se pudo actualizar ", response.data);
                        hideDialog();
                    })
                    .catch((error) => {
                        console.log(error);
                        showToast("error", "Contraseña incorrecta", `Ingrese contraseña nuevamente`);
                    });
            }
        }
        else {
            setMensaje("Confirme su contraseña correctamente");
        }

    }

    const [visibleCreate, setVisibleCreate] = useState(false);
    const hideDialog = () => {
        setVisibleCreate(false);
        setUsername("");
        setContrasena("");
        setContraNueva("");
        setContraConfi("");
        setValidacion(false);
        setMensaje("");
        setDataUser(null);
    };

    //IMAGEN
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    // Handler para cuando se selecciona una imagen
    const onFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        // Crear una vista previa de la imagen
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };
    useEffect(() => {
        setPreview(null);
    }, [selectedFile]);

    const handleButtonClick = () => {
        document.getElementById('fileInput').click();
    };

    //dialog para actualizar imagen
    const [visibleImagen, setVisibleImagen] = useState(false);

    const enviarImagen = () => {
        const formData = new FormData()
        formData.append("foto", selectedFile)
        http.post(`change/photo/${userID}`, formData)
            .then((response) => {
                showToast("success", "Imagen subida", `Se actualizó correctamente`);
                setVisibleImagen(false);
                handleMy(); //funcion para traer data del usuario y refrescar la info
            })
            .catch((error) => {
                console.log(error);
                showToast("error", "Error al subir imagen", `Intente nuevamente`);
            });
    }

    const DialogFooter = (
        <>
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
                onClick={() => enviarNuevaContrasena()}
            />
        </>
    );


    return (
        <Container url="miPerfil">
            <header>
                <div className="title">
                    <h1>Mi Perfil</h1>
                </div>
                <div className="description-area">
                    <p>A continuación, se muestran tus datos personales y la información relacionada con tu cuenta.</p>
                </div>
            </header>
            <section className='container-perfil flex gap-3 lg:flex-row sm:flex-column  '>
                <div className="photo-perfil bg-white border-round-3xl  shadow-1 lg:w-4">
                    <div className="content-photo ">
                        <div className="photo border-round ">
                            <img src={perfil?.url_foto} alt="" className="image-perfil" />
                        </div>
                        <Button onClick={() => setVisibleImagen(true)} icon='pi pi-pencil' label='Actualizar foto de perfil' />
                    </div>

                </div>
                <div className="info-perfil bg-white flex-1 border-round-3xl p-3 shadow-1">
                    <div className="data-perfil">
                        <div className="header-data-perfil">
                            <i className='pi pi-user'></i>
                            <h3>Informacion Personal</h3>
                        </div>
                        <Divider type="solid" />
                        <div className='content-data-user'>
                            <label className='text-bold-200' htmlFor="">Nombres</label>
                            <p>{perfil?.name}</p>
                            <label htmlFor="">Apellidos</label>
                            <p>{perfil?.apellidos}</p>
                            {perfil?.tipo_documento == "N/A" ? (<></>) :
                                (<>
                                    <label htmlFor="">Tipo Documento</label>
                                    <p>{perfil?.tipo_documento}</p>
                                </>)}
                            {perfil?.numero_documento == "N/A" ? (<></>) :
                                (<>
                                    <label htmlFor="">Número de Documento</label>
                                    <p>{perfil?.numero_documento}</p>
                                </>)}
                        </div>
                    </div>

                </div>
            </section>
            <section className='container-cuenta mt-3 border-round-3xl bg-white p-3 shadow-1'>
                <div className=" flex-1">
                    <div className="header-data-perfil " >
                        <h3 className='flex-1'>Información de usuario</h3>
                        <Button label='Cambiar Contraseña' icon="pi pi-key" className=' btn-change-password ' onClick={() => { setVisibleCreate(true) }} />

                    </div>
                    <Divider type="solid" />
                    <div className='card ' style={{ display: "flex" }}>
                        <div className="content-data-user flex-1">
                            <label htmlFor="">Nombre de usuario</label>
                            <p>{perfil?.nombre_usuario}</p>
                            <label htmlFor="">Rol</label>
                            <p>{perfil?.rol}</p>
                        </div>
                    </div>
                </div>

            </section>
            <Toast ref={toast} />
            <Dialog
                visible={visibleCreate}
                style={{ width: "450px" }}
                header={<><i className="pi pi-key icon-create-proveedor"></i> Cambiar Contraseña</>}
                modal
                className="p-fluid"
                footer={DialogFooter}
                onHide={hideDialog}
            >
                <div className="field">
                    <p>Ingrese sus credenciales para cambiar su contraseña</p>
                    <label htmlFor="numero_documento">Usuario</label>
                    <InputText
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='Nombre de usuario'
                    />
                </div>
                <div className="field">
                    <label htmlFor="razon_social">Contraseña</label>
                    <Password
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        toggleMask
                        feedback={false}
                        placeholder='Ingrese contraseña'
                    />
                </div>
                <div className="field">
                    <Button onClick={() => validarCredenciales()} label='Validar' />
                </div>
                {validacion == true ?
                    (<>
                        <div className="field">
                            <label htmlFor="razon_social">Contraseña nueva</label>
                            <Password
                                value={contra_nueva}
                                onChange={(e) => setContraNueva(e.target.value)}
                                toggleMask
                                feedback={false}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="telefono">Confirme Contraseña Nueva*</label>
                            <Password
                                value={contra_confi}
                                onChange={(e) => setContraConfi(e.target.value)}
                                toggleMask
                                feedback={false}
                            />
                        </div>
                        <small style={{ color: "red" }}>{mensaje}</small>
                    </>)
                    :
                    (<></>)
                }
            </Dialog>

            <Dialog
                visible={visibleImagen}
                onHide={() => { setVisibleImagen(false); setSelectedFile(null) }}
                header={<h3 style={{ margin: "0px 50px 0px 0px" }}> <i className='pi pi-pencil'></i> Actualizar imagen</h3>}
                footer={<>
                    <Button
                        onClick={() => { setVisibleImagen(false); setSelectedFile(null) }}
                        icon="pi pi-times"
                        className="p-button-danger"
                        label='Cancelar' />
                    <Button
                        onClick={() => enviarImagen()}
                        icon="pi pi-check"
                        className="p-button-success"
                        label='Actualizar' />
                </>}
            >
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    width: "100%"
                }} >
                    <div>
                        <input
                            style={{ display: "none" }}
                            type="file"
                            id="fileInput"
                            accept="image/*"
                            onChange={onFileChange}>
                        </input>
                        <Button style={{ width: "100%" }} icon="pi pi-upload" label='Selecciona una imagen' onClick={handleButtonClick} />
                    </div>

                    <div>
                        {preview !== null ? (
                            <img
                                src={preview}
                                alt="Vista previa"
                                style={{ width: '80px', objectFit: 'cover' }}
                            />
                        ) : (
                            <></>
                        )}
                    </div>

                </div>

            </Dialog>

        </Container>
    )
}
export default PagePerfil
