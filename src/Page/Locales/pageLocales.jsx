// src/Page/Locales/PageLocales.jsx

import React, { useState, useRef, useCallback,useEffect } from 'react';
import Container from '../../Components/Container/Container';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown'; // Importar Dropdown
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { departamentosData } from '../../data/departamentos';

import InputComplete from "../../Components/inputComplete"


import "./mapa.css"

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import classNames from 'classnames'; // Asegúrate de haber instalado 'classnames'

import carroIcon from '../../imagenes/carro.png';

import styles from './PageLocales.module.css'; // Importa el módulo de estilos
// Importar las imágenes según el estado
import DisponibleImg from '../../imagenes/Disponible.webp';
import OcupadoImg from '../../imagenes/Ocupado.webp';
import MantenimientoImg from '../../imagenes/Mantenimiento.webp';
import { localService } from '../../Services/LocalesService';
import { categoriaService } from '../../Services/CategoriaService';


const PageLocales = () => {
  console.log("ss", departamentosData)
  const toast = useRef(null);
  const [categorias, setCategorias] = useState([])
  const mapRef = useRef(null);
  const [selectedPlace, setSelectedPlace] = useState('');
  const libraries = ["places"];
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyD5G2fu2-rOgGY4dVkYaDCeW-N-oyiDmnA', // Reemplaza con tu clave API real
    libraries: libraries,
  });
  const [selectedDepartamento, setSelectedDepartamento] = useState(null);
  const [selectedProvincia, setSelectedProvincia] = useState(null);
  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState([]);

  // Función para manejar cuando se selecciona un departamento
  const handleDepartamentoChange = (e) => {
    const departamentoSeleccionado = e.value;
    setNewLocal({ ...newLocal, departamento: departamentoSeleccionado })
    // Filtrar las provincias del departamento seleccionado
    const departamentoData = departamentosData?.departamentos?.find(dep => dep.value === departamentoSeleccionado);
    console.log("da", departamentoData, departamentoSeleccionado)
    setProvincias(departamentoData ? departamentoData.provincias : []);
    setSelectedProvincia(null); // Limpiar la selección de provincia
    setDistritos([]); // Limpiar los distritos
  };

  // Función para manejar cuando se selecciona una provincia
  const handleProvinciaChange = (e) => {
    const provinciaSeleccionada = e.value;
    setNewLocal({ ...newLocal, provincia: provinciaSeleccionada })
    console.log("dd", provincias)
    // Filtrar los distritos de la provincia seleccionada
    const provinciaData = provincias.find(prov => prov.value === provinciaSeleccionada);
    setDistritos(provinciaData ? provinciaData.distritos : []);
  };
  //#region InputMapAutocomplet
  const [autocompleteDirection, setAutocompleteDirection] = useState("");
  const [direccion, setDireccion] = useState("");





  function handlePlaceChanged() {
    const place = autocompleteDirection.getPlace();


    if (place && place.geometry && place.geometry.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      setDireccion(place.formatted_address);
      setNewLocal((prevState) => {
        const updatedLocal = {
          ...prevState,
          direccion: place.formatted_address,
          latitud: lat,
          longitud: lng,
          "lat": lat,
          "lng": lng,
        };
        console.log("e", updatedLocal); // Mover el console.log aquí para mostrar el valor actualizado
        return updatedLocal;
      });
    } else {
      console.error("No se pudo obtener la ubicación del lugar seleccionado");
    }
  }
  const onLoadAutocomplete = (autocomplete) => {
    setAutocompleteDirection(autocomplete);
  };
  const [locales, setLocales] = useState([]);
  useEffect(() => {
    localService?.getAllLocalsRealTime((data) => { setLocales(data); console.log("loca", data) })
  }, [

  ])
  const [areaDialogVisible,setAreaDialogVisible]=useState(false)
  const [crearEspaciosDialogVisible,setCrearEspaciosDialogVisible]=useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingLocal, setEditingLocal] = useState(null);
  const [newLocal, setNewLocal] = useState({
    nombre: '',
    direccion: '',
    departamento: '',
    provincia: '',
    distrito: '',
    categoria: "",
    hora_inicio: "",
    hora_fin: "",
    latitud: -12.046374,
    longitud: -77.042793,
  });

  const handleMapSearch = () => {

    // Obtener la cadena de búsqueda del estado
    const query = newLocal.direccion;

    // Crear una instancia del geocodificador
    const geocoder = new window.google.maps.Geocoder();

    // Realizar la búsqueda geográfica
    geocoder.geocode({ address: query }, (results, status) => {
      if (status === 'OK') {
        // Si se encuentran resultados, obtener las coordenadas del primer resultado
        const location = results[0].geometry.location;
        const latLng = {
          lat: location.lat(),
          lng: location.lng()
        };

        // Actualizar el estado con las nuevas coordenadas


        // Actualizar los datos del local con la dirección y coordenadas
        setNewLocal({
          ...newLocal,
          direccion: query,
          latitud: latLng.lat,
          longitud: latLng.lng
        });
      } else {
        console.error('No se encontraron resultados para la búsqueda');
      }
    });
  };
  const handleSearchEnter = (e) => {
    if (e.key === 'Enter') {
      // Realizar búsqueda en el mapa
      handleMapSearch();
    }
  };

  // Lógica de filtrado actualizada para buscar por nombre o dirección
  const filteredLocales = locales.filter((local) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      local.nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
      local.direccion.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  const handleInputChange = (e, field) => {
    setNewLocal({ ...newLocal, [field]: e.target.value });
  };
  useEffect(() => {
    categoriaService.getAllCataegorias((data) => {
      console.log("cat", data)
      setCategorias(data);
    })
  }, []);





  const handleSave = async() => {
    if (editingLocal) {
      await localService.updateLocal(newLocal?.id,newLocal)
      toast.current.show({
        severity: 'success',
        summary: 'Actualizado',
        detail: 'Local actualizado exitosamente',
        life: 3000,
      });
    } else {
      await localService.createLocal(newLocal)
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
      categoria: "",
      distrito: '',
      latitud: -12.046374,
      longitud: -77.042793,
    });
  };

  const handleEdit = (local) => {
    setEditingLocal(local);
    setNewLocal(local);
    setDialogVisible(true);
    console.log("ee",local)
  };

  const handleDelete = async (id) => {
   await localService.deleteLocal(id)
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
      categoria: "",
      lat: -12.046374,
      lng: -77.042793,
      hora_inicio: "",
      hora_fin: "",
      latitud: -12.046374,
      longitud: -77.042793,
    });
    setDialogVisible(true);
  };

  // Nuevo estado para el formulario de Crear Espacios
  const [nuevoEspacio, setNuevoEspacio] = useState({
    nombreEspacio: '',
    estadoEspacio: null, // Inicializar como null para el Dropdown
  });

  // Función para manejar el cambio en los campos del formulario de Crear Espacios
  const handleEspacioChange = (e, field) => {
    setNuevoEspacio({ ...nuevoEspacio, [field]: e.value }); // Usar e.value para Dropdown
  };

  // Función para guardar el nuevo espacio (puedes personalizarla según tus necesidades)
  const handleGuardarEspacio = () => {
    // Validar que los campos estén llenos
    if (!nuevoEspacio.nombreEspacio || !nuevoEspacio.estadoEspacio) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, completa todos los campos.',
        life: 3000,
      });
      return;
    }

    // Aquí puedes agregar la lógica para guardar el nuevo espacio
    toast.current.show({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Espacio creado exitosamente',
      life: 3000,
    });
    setCrearEspaciosDialogVisible(false);
    // Resetear el formulario
    setNuevoEspacio({
      nombreEspacio: '',
      estadoEspacio: null,
    });
  };

  // Funciones para la tabla en el popup de Crear Área (tabla vacía)
  const rowClass = (rowData) => {
    return {
      'p-row-red': rowData.quantity === 0,
      'p-row-blue': rowData.quantity > 0 && rowData.quantity < 10,
      'p-row-teal': rowData.quantity > 10,
    };
  };

  const stockBodyTemplate = (rowData) => {
    const stockClassName = classNames(
      'border-circle w-2rem h-2rem inline-flex font-bold justify-content-center align-items-center text-sm',
      {
        'bg-red-100 text-red-900': rowData.quantity === 0,
        'bg-blue-100 text-blue-900': rowData.quantity > 0 && rowData.quantity < 10,
        'bg-teal-100 text-teal-900': rowData.quantity > 10,
      }
    );

    return <div className={stockClassName}>{rowData.quantity}</div>;
  };

  return (
    <Container>
      <Toast ref={toast} />
      <div className={styles.localesContainer}>
        <div className={styles.localesHeader}>
          <h1 className={styles.localesTitle}>Mis Locales</h1>
          <p className={styles.localesDescription}>
            A continuación se visualizan los locales previamente creados para poder colocar las áreas que usted ha definido en cada uno de sus locales.
          </p>
        </div>

        {/* Grid de Locales */}
        <div className={styles.localesGrid}>
          {/* Tarjeta para crear un nuevo local */}
          <div
            className={`${styles.localesCard} ${styles.localesCreateCard}`}
            onClick={openCreateDialog}
          >
            <div>
              <i className={`${styles.localesCreateIcon} pi pi-plus`}></i>
              <p className={styles.localesCreateText}>Crear Nuevo Local</p>
            </div>
          </div>

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
                    <span className={styles.localesDetailLabel}>Departamento:</span>
                    <span className={styles.localesDetailValue}>{local.departamento}</span>
                  </div>
                  <div className={styles.localesDetailItem}>
                    <span className={styles.localesDetailLabel}>Provincia:</span>
                    <span className={styles.localesDetailValue}>{local.provincia}</span>
                  </div>
                  <div className={styles.localesDetailItem}>
                    <span className={styles.localesDetailLabel}>Distrito:</span>
                    <span className={styles.localesDetailValue}>{local.distrito}</span>
                  </div>
                  <hr />
                  <div className={styles.localesButtonGroup}>
                    <Button
                      icon="pi pi-trash"
                      className="p-button-rounded p-button-danger p-button-text"
                      onClick={() => handleDelete(local.id)}
                      tooltip="Eliminar"
                      tooltipOptions={{ position: 'top' }}
                    />
                    <Button
                      icon="pi pi-pencil"
                      className="p-button-rounded p-button-success p-button-text"
                      onClick={() => handleEdit(local)}
                      tooltip="Editar"
                      tooltipOptions={{ position: 'top' }}
                    />
                    <Button
                      label="Crear Área"
                      icon="pi pi-plus-circle"
                      className="p-button-rounded p-button-outlined p-button-help"
                      tooltip="Crear Área"
                      tooltipOptions={{ position: 'top' }}
                      onClick={() => setAreaDialogVisible(true)} // Abre el popup de Crear Área
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Diálogo para Crear/Editar Local */}
        <Dialog
          visible={dialogVisible}
          style={{ width: '80vw' }}
          header={editingLocal ? 'Editar Local' : 'Crear Local'}
          modal
          className={styles.localesDialog}
          onHide={() => {
            setDialogVisible(false);
            setEditingLocal(null);
            setNewLocal({
              nombre: '',
              direccion: '',
              departamento: '',
              provincia: '',
              distrito: '',
              latitud: -12.046374,
              longitud: -77.042793,
              categoria: "",
              hora_fin: "",
              hora_inicio: ""

            });
          }}
        >

          <div className={styles.localesDialogContent}>
            <div>
              <div className={styles.localesFormField}>

                <label htmlFor="nombre" className={styles.localesFormLabel}>
                  Nombre
                </label>
                <InputText
                  id="nombre"
                  value={newLocal.nombre}
                  onChange={(e) => handleInputChange(e, 'nombre')}
                  required
                  className={styles.localesFormInput}
                  placeholder="Introducir nombre del local "
                />
              </div>
              <div className={styles.localesFormField}>
                <label htmlFor="departamento" className={styles.localesFormLabel}>
                  Departamento
                </label>
                <Dropdown className={styles.localesFormInput}
                  placeholder="Seleccionar departamentos"
                  value={newLocal?.departamento}
                  onChange={handleDepartamentoChange}
                  options={departamentosData?.departamentos}
                ></Dropdown>
              </div>
              <div className={styles.localesFormField}>
                <label htmlFor="distrito" className={styles.localesFormLabel}
                >
                  Provincia
                </label>
                <Dropdown className={styles.localesFormInput}
                  value={newLocal?.provincia}
                  onChange={handleProvinciaChange}
                  options={provincias}
                  placeholder="Seleccione provincia"></Dropdown>
              </div>

              <div className={styles.localesFormField}>
                <label htmlFor="distrito" className={styles.localesFormLabel}>
                  Distrito
                </label>
                <Dropdown className={styles.localesFormInput}
                  value={newLocal?.distrito}
                  onChange={(e) => { setNewLocal({ ...newLocal, distrito: e.value }) }}
                  options={distritos}
                  placeholder="Seleccionar distrito"></Dropdown>

              </div>
              <div className={styles.localesFormField}>
                <label htmlFor="direccion" className={styles.localesFormLabel}>
                  Dirección
                </label>
                <InputText
                  id="direccion"
                  value={newLocal.direccion}
                  onChange={(e) => handleInputChange(e, 'direccion')}
                  required
                  className={styles.localesFormInput}
                  placeholder="Introducir Dirección"
                />


                {/* Botón para buscar la dirección y actualizar el mapa */}

              </div>
              <div className={styles.localesFormField}>
                <label className={styles.localesFormLabel}>
                  Categoria
                </label>
                <Dropdown className={styles.localesFormInput} options={categorias} value={newLocal?.categoria} onChange={(e) => handleInputChange(e, 'categoria')} />
              </div>
              <div className={styles.localesFormField}>
                <label htmlFor="distrito" className={styles.localesFormLabel}>
                  Hora inicio
                </label>
                <InputText

                  type='time'
                  value={newLocal?.hora_inicio}
                  onChange={(e) => handleInputChange(e, 'hora_inicio')}
                  className={styles.localesFormInput}
                  placeholder="Introducir hora inicio"
                />
              </div>
              <div className={styles.localesFormField}>
                <label htmlFor="distrito" className={styles.localesFormLabel}>
                  Hora fin
                </label>
                <InputText
                  type='time'
                  value={newLocal.hora_fin}
                  onChange={(e) => handleInputChange(e, 'hora_fin')}
                  className={styles.localesFormInput}
                  placeholder="Introducir hora fin"
                />
              </div>
              <div className={styles.localesFormField}>
                <label htmlFor="costo" className={styles.localesFormLabel}>
                  Costo por hora
                </label>
                <InputText
                  value={newLocal.costo_hora}
                  onChange={(e) => handleInputChange(e, 'costo_hora')}
                  className={styles.localesFormInput}
                  placeholder="Costo hora"
                />
              </div>
            </div>

            <div>
              <label className={styles.localesFormLabel}>Ubicación</label>
              <InputComplete
                onPlaceChanged={handlePlaceChanged}
                restrictions={{ country: 'pe' }} // Limita a Perú
                onLoad={onLoadAutocomplete}
              >
                <InputText
                  id="direccion" // Asegúrate de que este id sea único
                  value={newLocal.direccion}
                  onChange={(e) => handleInputChange(e, 'direccion')}
                  required
                  className={styles.localesFormInput}
                  placeholder="Introducir Dirección"

                />
              </InputComplete>
              {isLoaded && (
                <div style={{ height: '400px', marginTop: '20px' }}>
                  <GoogleMap
                    mapContainerStyle={{ height: '100%', width: '100%' }}
                    center={{ lat: newLocal.latitud, lng: newLocal.longitud }}
                    zoom={15}
                  >
                    <Marker position={{ lat: newLocal.latitud, lng: newLocal.longitud }} />
                  </GoogleMap>
                </div>
              )}

            </div>
          </div>

          <div className={styles.localesDialogActions}>
            <Button
              label="Cancelar"
              icon="pi pi-times"
              onClick={() => {
                setDialogVisible(false);
                setEditingLocal(null);
                setNewLocal({
                  nombre: '',
                  direccion: '',
                  departamento: '',
                  provincia: '',
                  distrito: '',
                  lat: -12.046374,
                  lng: -77.042793,
                  latitud: -12.046374,
                  longitud: -77.042793,
                });
              }}
              className="p-button-text"
            />
            <Button
              label="Guardar"
              icon="pi pi-check"
              onClick={handleSave}
              autoFocus
            />
          </div>
        </Dialog>

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
                value={[]} // Tabla vacía
                className={styles.emptyDataTable}
                paginator
                rows={5}
                emptyMessage="No hay datos disponibles."
              />
            </div>
          </div>
        </Dialog>

        {/* Diálogo para Crear Espacios */}
        <Dialog
          visible={crearEspaciosDialogVisible}
          style={{ width: '50vw' }}
          header="Crear Espacios"
          modal
          onHide={() => setCrearEspaciosDialogVisible(false)}
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
                  id="nombreEspacio"
                  value={nuevoEspacio.nombreEspacio}
                  onChange={(e) => handleEspacioChange(e, 'nombreEspacio')}
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
                  value={nuevoEspacio.estadoEspacio}
                  
                  onChange={(e) => handleEspacioChange(e, 'estadoEspacio')}
                  placeholder="Seleccione el estado"
                  className={styles.localesFormInput1}
                />
              </div>
            </div>
            <div className={styles.imageContainer}>
              <div className={styles.staticImageBox}>
              {nuevoEspacio.estadoEspacio ? (
                  <img
                    src={estadoImagenMap[nuevoEspacio.estadoEspacio]}
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
              onClick={handleGuardarEspacio}
              className="p-button-success"
            />
          </div>
        </Dialog>
      </div>
    </Container>
  );
};

export default PageLocales;
