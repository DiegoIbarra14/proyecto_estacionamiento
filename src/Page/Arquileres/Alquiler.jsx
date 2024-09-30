
import React, { useState, useRef, useEffect } from 'react';
import Container from '../../Components/Container/Container';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';

import styles from './arquiler.module.css/'
import { DataTable } from 'primereact/datatable';
import { Column } from 'jspdf-autotable';
import { Dropdown } from 'primereact/dropdown';
import { localService } from '../../Services/LocalesService';
import { format } from 'date-fns';



const Alquiler = () => {
    const [areaDialogVisible, setAreaDialogVisible] = useState(false)
    const [historialDialogVisible, setHistorialDialogVisible] = useState(false)
    const [crearEspaciosDialogVisible, setCrearEspaciosDialogVisible] = useState(false)
    const [users, setUser] = useState([])
    const [espacios, setEspacios] = useState([])
    const toast = useRef(null);
    const [locales, setLocales] = useState([]);
    const [alquileres, setAlquileres] = useState([])
    const getAllAlquileres = (espacio_id) => {
        localService.obtenerAlquileresPorEspacio(espacio_id, (data) => { setAlquileres(data) })

    }
    const [searchTerm, setSearchTerm] = useState('');
    const [dialogVisible, setDialogVisible] = useState(false);
    const [editingLocal, setEditingLocal] = useState(null);
    const [newLocal, setNewLocal] = useState({
        nombre: '',
        direccion: '',
        departamento: '',
        provincia: '',
        distrito: '',
    });

    // Función para manejar la búsqueda
    const handleSearch = () => {
        const trimmedSearch = searchTerm.trim().toLowerCase();
        // La lógica de búsqueda ahora solo filtra por nombre o dirección
        // Sin manipulación del mapa
    };

    const handleInputChange = (e, field) => {
        setNewLocal({ ...newLocal, [field]: e.target.value });
    };

    const handleSave = () => {
        if (editingLocal) {
            setLocales(
                locales.map((local) =>
                    local.id === editingLocal.id ? { ...newLocal, id: local.id } : local
                )
            );
            toast.current.show({
                severity: 'success',
                summary: 'Actualizado',
                detail: 'Local actualizado exitosamente',
                life: 3000,
            });
        } else {
            setLocales([...locales, { ...newLocal, id: locales.length + 1 }]);
            toast.current.show({
                severity: 'success',
                summary: 'Creado',
                detail: 'Local creado exitosamente',
                life: 3000,
            });
        }
        setDialogVisible(false);
        setEditingLocal(null);
        setNewLocal({
            nombre: '',
            direccion: '',
            departamento: '',
            provincia: '',
            distrito: '',
        });
    };

    const handleEdit = (local) => {
        setEditingLocal(local);
        setNewLocal(local);
        setDialogVisible(true);
    };

    const handleDelete = (id) => {
        setLocales(locales.filter((local) => local.id !== id));
        toast.current.show({
            severity: 'info',
            summary: 'Eliminado',
            detail: 'Local eliminado',
            life: 3000,
        });
    };

    const openCreateDialog = () => {
        setEditingLocal(null);
        setNewLocal({
            nombre: '',
            direccion: '',
            departamento: '',
            provincia: '',
            distrito: '',
        });
        setDialogVisible(true);
    };
    useEffect(() => {
        localService?.getAllLocalsRealTime((data) => { setLocales(data); console.log("loca", data) })
    }, [])
    useEffect(() => {
        localService?.getAllUsers((data) => { setUser(data); console.log("users", data) })


    }, [])
    const getAllEspacios = async (id) => {
        console.log("een")
        await localService.getLocalById(id, (data) => { setEspacios(data) })
    }
    // Filtrado de locales basado en el término de búsqueda
    const filteredLocales = locales.filter((local) => {
        const lowerCaseSearchTerm = searchTerm?.toLowerCase();
        return (
            local.nombre?.toLowerCase().includes(lowerCaseSearchTerm) ||
            local.direccion?.toLowerCase().includes(lowerCaseSearchTerm)
        );
    });
    const [nuevoEspacio, setNuevoEspacio] = useState({
        nombre: '',
        disponibilidad: null, // Inicializar como null para el Dropdown
    });
    const [crearAlquiler, setCrearAlquiler] = useState({
        documento_alquiler: "",
        "fecha_hora_inicio": "",
        "placa_vehiculo": "",
        "usuario_id": ""
    })
    const handleShowHistory = (rowData) => {
        setHistorialDialogVisible(true)
        getAllAlquileres(rowData?.id)
        console.log("data-al", rowData?.id)

    }
    const actionBodyTemplate = (rowData) => {
        console.log("ess", rowData)
        return (
            <div>
                <Button
                    icon="pi pi-caret-right"
                    tooltip='Liberar'
                    onClick={() => {setCrearEspaciosDialogVisible(true);setNuevoEspacio({...nuevoEspacio,espacio_id:rowData?.id});console.log("jj",rowData?.id)}}
                    className="p-button-rounded  "
                    style={{ marginLeft: '0.5em' }}
                />

                <Button
                    icon="pi pi-info-circle"
                    tooltip='historial'
                    onClick={() => handleShowHistory(rowData)}
                    className="p-button-rounded p-button-outlined p-button-help"
                    style={{ marginLeft: '0.5em' }}
                />
            </div>
        );
    };
    const handleFinalizarAlquiler=(rowData)=>{
        console.log("alquiler",rowData)
        localService?.finalizarAlquiler(rowData?.id,rowData?.espacio_id,newLocal?.id)
    }
    const actionBodyTemplateAlquiler = (rowData) => {
        console.log("ess", rowData)
        return (
            <div>
                <Button
                    icon="pi pi-caret-right"
                    tooltip='Liberar'
                    onClick={() => {handleFinalizarAlquiler(rowData)}}
                    className="p-button-rounded  "
                    style={{ marginLeft: '0.5em' }}
                />

                <Button
                    icon="pi pi-trash"
                    tooltip='historial'
                    onClick={() => handleShowHistory(rowData)}
                    className="p-button-rounded p-button-outlined p-button-help"
                    style={{ marginLeft: '0.5em' }}
                />
            </div>
        );
    };
    console.log("dd", nuevoEspacio)
    const handleEspacioChange = (e, field) => {
        console.log("gol", e)

        setNuevoEspacio({ ...nuevoEspacio, [field]: e.value }); // Usar e.value para Dropdown
    };
    // Función para buscar el usuario por número de documento en el array de usuarios y setear nombre completo
    function buscarUsuarioPorDocumentoYMostrar(numeroDocumento, usuarios) {
        console.log("uuuu", users)
        console.log("uuuu", numeroDocumento)
        // Busca el usuario en el array de usuarios por número de documento
        const usuario = usuarios.find(user => user?.persona?.documento == numeroDocumento);
        console.log("tt", usuario)

        if (usuario) {
            // Extrae el nombre y apellidos del usuario encontrado
            const nombreCompleto = `${usuario.persona?.nombres || "Nombre no disponible"} ${usuario.persona?.apellidos || "Apellidos no disponibles"}`;

            // Setea el nombre completo para mostrarlo en la UI
            setNuevoEspacio({ ...nuevoEspacio, cliente: nombreCompleto, usuario_id: usuario?.id })

            console.log(`Usuario con documento ${numeroDocumento} encontrado:`, usuario);
        } else {
            console.log("Usuario no encontrado con el número de documento proporcionado");

        }
    }
    const handleSaveAlquiler = async () => {
        console.log("ddd", newLocal?.id)
        await localService?.crearAlquilerYActualizarEspacio(nuevoEspacio, nuevoEspacio?.espacio_id, newLocal?.id)
    }

    return (
        <Container>
            <Toast ref={toast} />
            <div className={styles.localesContainer}>
                <div className={styles.localesHeader}>
                    <h1 className={styles.localesTitle}>MIS ALQUILERES</h1>
                    <p className={styles.localesDescription}>
                        A continuación se visualizan los Alquileres previamente creados para poder colocar las áreas que usted ha definido en cada uno de sus locales.
                    </p>
                </div>

                {/* Campo de Búsqueda */}
                <div className={styles.localesSearchContainer}>
                    <i className={`${styles.localesSearchIcon} pi pi-search`}></i>
                    <InputText
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                        placeholder="Busca por nombre o dirección..."
                        className={styles.localesSearchInput}
                    />
                    <Button
                        icon="pi pi-search"
                        onClick={handleSearch}
                        className={styles.searchButton}
                        tooltip="Buscar"
                        tooltipOptions={{ position: 'top' }}
                    />
                </div>

                {/* Grid de Locales */}
                <div className={styles.localesGrid}>

                    {filteredLocales.map((local) => (
                        <Card key={local.id} className={styles.localesCard}>
                            <div className={styles.localesStatusBadge}>Habilitado</div>

                            <div className={styles.localesCardContent}>
                                <div className={styles.localesLocalInfo}>
                                    <div className={styles.localesAvatar}>
                                        <span className={styles.localesAvatarText}>
                                            {local.nombre.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <h2 className={styles.localesLocalName}>{local.nombre}</h2>
                                        <p className={styles.localesLocalAddress}>{local.direccion}</p>
                                    </div>
                                </div>

                                <div className={styles.localesDetailsList}>
                                    <div className={styles.localesDetailItem}>
                                        <span className={styles.localesDetailLabel}>Espacio Disponible:</span>

                                    </div>
                                    <div className={styles.localesDetailItem}>
                                        <span className={styles.localesDetailLabel}>Espacio Ocupado:</span>

                                    </div>
                                    <hr />
                                    <div className={styles.localesButtonGroup}>

                                        <Button
                                            label="Gestionar Espacios"
                                            icon="pi pi-plus-circle"
                                            className="p-button-rounded p-button-outlined p-button-help"
                                            tooltip="Crear Área"
                                            tooltipOptions={{ position: 'top' }}
                                            onClick={() => { getAllEspacios(local?.id); setAreaDialogVisible(true); setNewLocal(local);console.log("nw",local) }}// Abre el popup de Crear Área
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
                {/* Diálogo para Crear Área */}
                <Dialog
                    visible={areaDialogVisible}
                    style={{ width: '60vw' }}
                    header="Crear Área"
                    modal
                    onHide={() => setAreaDialogVisible(false)}
                    className={styles.localesDialog} // Usar estilos existentes
                >
                    <p>A continuación se crean las Areas previamente para que usted defina en cada uno de los espacio.</p>

                    <div className={styles.areaDialogContent}>
                        {/* Botón "Crear Área" posicionado en la esquina superior derecha */}
                        <div className={styles.areaDialogHeader}>
                            <Button
                                icon="pi pi-plus"
                                onClick={() => setCrearEspaciosDialogVisible(true)}
                                className="p-button-rounded p-button-success"
                                tooltip="Crear Área"
                                tooltipOptions={{ position: 'top' }}
                            />
                        </div>

                        {/* Tabla Vacía Centrada */}
                        <div className={styles.emptyTableContainer}>
                            <DataTable
                                value={espacios} // Tabla vacía
                                className={styles.emptyDataTable}
                                paginator
                                rows={5}
                                emptyMessage="No hay datos disponibles."
                            >
                                <Column header="Nombre Espacio" field='nombre' />

                                <Column header="Acciones" body={actionBodyTemplate} />



                            </DataTable>
                        </div>
                    </div>
                </Dialog>

                {/* Diálogo para Crear Espacios */}
                <Dialog
                    visible={crearEspaciosDialogVisible}
                    style={{ width: '400px' }}
                    header="Crear Alquiler"
                    modal
                    onHide={() => { setCrearEspaciosDialogVisible(false); setNuevoEspacio({ nombre: "", disponibilidad: "" }) }}
                    className={styles.localesDialog} // Usar estilos existentes
                >

                    <div className={styles.crearEspaciosContent}>
                        <div className={styles.formContainer}>
                            <div style={{ width: "400px" }}>
                                <label htmlFor="estadoEspacio" className={styles.localesFormLabel}>
                                    N° documento
                                </label>
                                <InputText
                                    value={nuevoEspacio.documento}

                                    onChange={(e) => handleEspacioChange({ ...e, value: e.target.value }, 'documento')}
                                    placeholder="Ingrese el nombre del espacio"

                                />
                                <Button
                                    icon="pi pi-search"
                                    onClick={() => buscarUsuarioPorDocumentoYMostrar(nuevoEspacio.documento, users)}


                                />


                            </div>
                            <div className={styles.localesFormField}>
                                <label htmlFor="estadoEspacio" className={styles.localesFormLabel}>
                                    Cliente
                                </label>
                                <InputText
                                    value={nuevoEspacio.cliente}
                                    disabled={true}

                                    placeholder="Ingrese el nombre del espacio"
                                    className={styles.localesFormInput1}
                                />
                            </div>
                            <div className={styles.localesFormField}>
                                <label htmlFor="nombreEspacio" className={styles.localesFormLabel}>
                                    N° placa vehiculo
                                </label>
                                <InputText
                                    value={nuevoEspacio.placa_vehiculo}
                                    onChange={(e) => handleEspacioChange({ ...e, value: e.target.value }, 'placa_vehiculo')}
                                    placeholder="Ingrese el nombre del espacio"
                                    className={styles.localesFormInput1}
                                />
                            </div>


                        </div>

                    </div>
                    <div className={styles.dialogActionsLeft}>
                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            onClick={() => setCrearEspaciosDialogVisible(false)}
                            className="p-button-text"
                        />
                        <Button
                            label="Guardar"
                            icon="pi pi-check"
                            onClick={handleSaveAlquiler}
                            className="p-button-success"
                        />
                    </div>
                </Dialog>



            </div>
            <Dialog
                visible={historialDialogVisible}
                style={{ width: '95vw' }}
                header="Crear Área"
                modal
                onHide={() => setHistorialDialogVisible(false)}
                className={styles.localesDialog} // Usar estilos existentes
            >
                <p>A continuación se crean las Areas previamente para que usted defina en cada uno de los espacio.</p>

                <div className={styles.areaDialogContent}>
                    {/* Botón "Crear Área" posicionado en la esquina superior derecha */}


                    {/* Tabla Vacía Centrada */}
                    <div className={styles.emptyTableContainer}>
                        <DataTable
                            value={alquileres} // Tabla vacía
                            className={styles.emptyDataTable}
                            paginator
                            rows={5}
                            emptyMessage="No hay datos disponibles."
                        >
                            <Column header="Item" field='espacio_id' />
                            <Column
                                header="Fecha hora inicio"
                                field='fecha_hora_inicio'
                                body={rowData => {
                                    // Convertir la cadena a objeto Date
                                    const date = new Date(rowData.fecha_hora_inicio);
                                    // Formatear la fecha a un formato legible
                                    return format(date, 'dd/MM/yyyy HH:mm:ss') || "---";
                                }}
                            />
                            <Column header="placa vehiculo" field='placa_vehiculo' />
                            <Column header="Cliente" field='nombre_persona' />
                            <Column header="Número documento" field='numero_documento' />
                            <Column header="Fecha fin" field="fecha_fin" body={rowData => rowData.fecha_fin ? rowData.fecha_fin : "---"} />
                            <Column header="Precio Final" field="precio_final" body={rowData => rowData.precio_final ? rowData.precio_final : "---"} />
                            <Column header="Estado alquiler" body={(data) => (
                                data?.estado_alquiler == 1 ? <span style={{ backgroundColor: "#5dd868", padding: 7, borderRadius: "20px", color: "#fff" }}>En proceso</span > : <span style={{ backgroundColor: "#f13737", padding: 7, borderRadius: "20px", color: "#fff" }}>Finalizado</span>
                            )} />

                            <Column header="Acciones" body={actionBodyTemplateAlquiler} />



                        </DataTable>
                    </div>
                </div>
            </Dialog>
        </Container>
    );
}

export default Alquiler
