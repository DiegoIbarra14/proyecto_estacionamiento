
import React, { useState, useRef } from 'react';
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



const Alquiler = () => {
    const [areaDialogVisible, setAreaDialogVisible] = useState(false)
    const [crearEspaciosDialogVisible, setCrearEspaciosDialogVisible] = useState(false)
    const [espacios, setEspacios] = useState([])
    const toast = useRef(null);
    const [locales, setLocales] = useState([
        {
            id: 1,
            nombre: 'San Juan de Lurigancho',
            direccion: 'Calle Eucalipto',
            departamento: 'LIMA',
            provincia: 'LIMA',
            distrito: 'SAN JUAN DE LURIGANCHO',
        },
        {
            id: 2,
            nombre: 'Chachapoyas Local',
            direccion: 'Calle Principal',
            departamento: 'AMAZONAS',
            provincia: 'CHACHAPOYAS',
            distrito: 'CHACHAPOYAS',
        },
        // Puedes añadir más locales aquí
    ]);

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

    // Filtrado de locales basado en el término de búsqueda
    const filteredLocales = locales.filter((local) => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return (
            local.nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
            local.direccion.toLowerCase().includes(lowerCaseSearchTerm)
        );
    });
    const [nuevoEspacio, setNuevoEspacio] = useState({
        nombre: '',
        disponibilidad: null, // Inicializar como null para el Dropdown
      });
    const actionBodyTemplate = (rowData) => {
        return (
          <div>
            <Button
              icon="pi pi-pencil"
            //   onClick={() => handleEditEspacio(rowData)}
              className="p-button-warning"
            />
            <Button
    
              icon="pi pi-trash"
            //   onClick={() => handleDeleteEspacio(rowData)}
              className="p-button-danger"
              style={{ marginLeft: '0.5em' }}
            />
          </div>
        );
      };

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
                                            onClick={() => {
                                                setAreaDialogVisible(true)
                                            }}
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
                                <Column header="Estado Espacio" body={(data) => (
                                    data?.disponibilidad ? <span style={{ backgroundColor: "#5dd868", padding: 7, borderRadius: "20px", color: "#fff" }}>Disponible</span > : <span style={{ backgroundColor: "#f13737", padding: 7, borderRadius: "20px", color: "#fff" }}>No Disponible</span>
                                )} />
                                <Column header="Acciones" body={actionBodyTemplate} />



                            </DataTable>
                        </div>
                    </div>
                </Dialog>

                {/* Diálogo para Crear Espacios */}
                <Dialog
                    visible={crearEspaciosDialogVisible}
                    style={{ width: '50vw' }}
                    header="Crear Espacios"
                    modal
                    onHide={() => { setCrearEspaciosDialogVisible(false); setNuevoEspacio({ nombre: "", disponibilidad: "" }) }}
                    className={styles.localesDialog} // Usar estilos existentes
                >
                    <p>A continuación se crean los Espacios previamente para poder colocar las áreas que usted ha definido en cada uno de sus locales.</p>
                    <div className={styles.crearEspaciosContent}>
                        <div className={styles.formContainer}>
                            <div className={styles.localesFormField}>
                                <label htmlFor="nombreEspacio" className={styles.localesFormLabel}>
                                    Nombre de espacio
                                </label>
                                <InputText

                                    value={nuevoEspacio.nombre}
                                    onChange={(e) => handleEspacioChange({ ...e, value: e.target.value }, 'nombre')}
                                    placeholder="Ingrese el nombre del espacio"
                                    className={styles.localesFormInput1}
                                />
                            </div>
                            <div className={styles.localesFormField}>
                                <label htmlFor="estadoEspacio" className={styles.localesFormLabel}>
                                    Estado espacio
                                </label>
                                <Dropdown
                                    id="estadoEspacio"
                                    value={nuevoEspacio.disponibilidad}
                                 

                                    // onChange={(e) => handleEspacioChange(e, 'disponibilidad')}
                                    placeholder="Seleccione el estado"
                                    className={styles.localesFormInput1}
                                />
                            </div>
                        </div>
                        <div className={styles.imageContainer}>
                            <div className={styles.staticImageBox}>
                                {nuevoEspacio.disponibilidad ? (
                                    <img
                                        src={estadoImagenMap[nuevoEspacio.disponibilidad ? "Activo" : "Inactivo"]}
                                        alt={nuevoEspacio.estadoEspacio}
                                        className={styles.estadoImagen}
                                    />
                                ) : (
                                    <p>Imagen del Espacio</p>
                                )}
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
                            // onClick={handleGuardarEspacio}
                            className="p-button-success"
                        />
                    </div>
                </Dialog>



            </div>
        </Container>
    );
}

export default Alquiler
