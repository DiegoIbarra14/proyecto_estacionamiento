import React, { useState, useRef, useCallback } from 'react';
import Container from '../../Components/Container/Container';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

// Importa la imagen personalizada
import carroIcon from '../../imagenes/carro.png';

import styles from './PageLocales.module.css'; // Importa el módulo de estilos

const PageLocales = () => {
  const toast = useRef(null);
  const mapRef = useRef(null);
  const [locales, setLocales] = useState([
    {
      id: 1,
      nombre: 'San Juan de Lurigancho',
      direccion: 'Calle Eucalipto',
      departamento: 'LIMA',
      provincia: 'LIMA',
      distrito: 'SAN JUAN DE LURIGANCHO',
      lat: -12.026136,
      lng: -77.008986,
    },
    {
      id: 2,
      nombre: 'Chachapoyas Local',
      direccion: 'Calle Principal',
      departamento: 'AMAZONAS',
      provincia: 'CHACHAPOYAS',
      distrito: 'CHACHAPOYAS',
      lat: -6.229164,
      lng: -77.872053,
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
    lat: -12.046374, // Coordenadas por defecto
    lng: -77.042793,
  });

  const [mapCenter, setMapCenter] = useState({ lat: -12.046374, lng: -77.042793 }); // Centro del mapa principal
  const [mapBounds, setMapBounds] = useState(null); // Nuevas líneas para manejar límites

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyD5G2fu2-rOgGY4dVkYaDCeW-N-oyiDmnA', // Reemplaza con tu clave API real
  });

  // Función para geocodificar una dirección
  const geocodeAddress = (address) => {
    const geocoder = new window.google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          resolve({ lat: location.lat(), lng: location.lng() });
        } else {
          reject('Geocoding no tuvo éxito por la siguiente razón: ' + status);
        }
      });
    });
  };

  // Función para manejar la búsqueda mejorada
  const handleSearch = async () => {
    const trimmedSearch = searchTerm.trim().toLowerCase();
    if (trimmedSearch === '') {
      // Si el término de búsqueda está vacío, restablecer el centro y los límites del mapa
      setMapCenter({ lat: -12.046374, lng: -77.042793 });
      setMapBounds(null);
      return;
    }

    // Filtrar los locales que coinciden con el término de búsqueda en nombre o dirección
    const matchedLocales = locales.filter((local) => {
      return (
        local.nombre.toLowerCase().includes(trimmedSearch) ||
        local.direccion.toLowerCase().includes(trimmedSearch)
      );
    });

    if (matchedLocales.length === 1) {
      // Si hay una única coincidencia, centrar el mapa en esa ubicación
      const locale = matchedLocales[0];
      setMapCenter({ lat: locale.lat, lng: locale.lng });
      setMapBounds(null);
    } else if (matchedLocales.length > 1) {
      // Si hay múltiples coincidencias, ajustar los límites del mapa para mostrar todas
      const bounds = new window.google.maps.LatLngBounds();
      matchedLocales.forEach((local) => {
        bounds.extend(new window.google.maps.LatLng(local.lat, local.lng));
      });
      setMapBounds(bounds);
    } else {
      // Si no hay coincidencias, intentar geocodificar el término de búsqueda
      try {
        const coords = await geocodeAddress(searchTerm);
        setMapCenter(coords);
        setMapBounds(null);
      } catch (error) {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: error,
          life: 3000,
        });
      }
    }
  };

  // Callback para obtener la referencia del mapa una vez cargado
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    if (mapBounds) {
      map.fitBounds(mapBounds);
    }
  }, [mapBounds]);

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

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    // Actualiza lat y lng inmediatamente usando la forma funcional de setState
    setNewLocal((prevNewLocal) => ({
      ...prevNewLocal,
      lat: lat,
      lng: lng,
    }));

    // Realizar la geocodificación inversa
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const addressComponents = results[0].address_components;
        let address = results[0].formatted_address;
        let departamento = '';
        let provincia = '';
        let distrito = '';
        let nombre = '';

        // Mapear los componentes de la dirección
        addressComponents.forEach((component) => {
          const types = component.types;
          if (types.includes('street_address') || types.includes('route')) {
            address = component.long_name;
          }
          if (types.includes('administrative_area_level_1')) {
            departamento = component.long_name;
          }
          if (types.includes('administrative_area_level_2')) {
            provincia = component.long_name;
          }
          if (
            types.includes('administrative_area_level_3') ||
            types.includes('locality')
          ) {
            distrito = component.long_name;
          }
          if (types.includes('locality')) {
            nombre = component.long_name;
          }
        });

        // Si "nombre" no se establece, usar otro componente
        if (!nombre) {
          nombre = provincia || distrito || departamento || '';
        }

        // Actualizar el estado con los nuevos datos usando la forma funcional de setState
        setNewLocal((prevNewLocal) => ({
          ...prevNewLocal,
          nombre: nombre,
          direccion: address,
          departamento: departamento,
          provincia: provincia,
          distrito: distrito,
        }));
      }
    });
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
      lat: -12.046374,
      lng: -77.042793,
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
      lat: -12.046374,
      lng: -77.042793,
    });
    setDialogVisible(true);
  };

  return (
    <Container>
      <Toast ref={toast} />
      <div className={styles.localesContainer}>
        <div className={styles.localesHeader}>
          <h1 className={styles.localesTitle}>Mis Locales</h1>
          <p className={styles.localesDescription}>
            A continuación se visualiza los locales previamente creados para poder colocar las áreas que usted ha definido en cada uno de sus locales.
          </p>
        </div>

        {/* Mapa Principal */}
        <div className={styles.mainMapContainer}>
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={mapCenter}
              zoom={10}
              onLoad={onMapLoad}
              options={{
                fullscreenControl: false,
                mapTypeControl: false,
                streetViewControl: false,
              }}
            >
              {filteredLocales.map((local) => (
                <Marker
                  key={local.id}
                  position={{ lat: local.lat, lng: local.lng }}
                  title={local.nombre}
                  // Configurar el icono personalizado
                  icon={{
                    url: carroIcon, // Ruta de la imagen importada
                    scaledSize: new window.google.maps.Size(40, 40), // Ajusta el tamaño según tus necesidades
                  }}
                />
              ))}
            </GoogleMap>
          )}
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
          {/* Reemplazado Card por div para manejar onClick correctamente */}
          <div
            className={`${styles.localesCard} ${styles.localesCreateCard}`}
            onClick={openCreateDialog}
            style={{ cursor: 'pointer' }} // Cambia el cursor para indicar que es clicable
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
                    <h2 className={styles.localesLocalName}>  {local.nombre}</h2>
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
                      onClick={() => {
                        // Implementa la lógica para crear un área
                      }}
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
              lat: -12.046374,
              lng: -77.042793,
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
                  placeholder="Introducir Nombre"
                />
              </div>
              <div className={styles.localesFormField}>
                <label htmlFor="departamento" className={styles.localesFormLabel}>
                  Departamento
                </label>
                <InputText
                  id="departamento"
                  value={newLocal.departamento}
                  onChange={(e) => handleInputChange(e, 'departamento')}
                  className={styles.localesFormInput}
                  placeholder="Introducir Departamento"
                />
              </div>
              <div className={styles.localesFormField}>
                <label htmlFor="provincia" className={styles.localesFormLabel}>
                  Provincia
                </label>
                <InputText
                  id="provincia"
                  value={newLocal.provincia}
                  onChange={(e) => handleInputChange(e, 'provincia')}
                  className={styles.localesFormInput}
                  placeholder="Introducir Provincia"
                />
              </div>
              <div className={styles.localesFormField}>
                <label htmlFor="distrito" className={styles.localesFormLabel}>
                  Distrito
                </label>
                <InputText
                  id="distrito"
                  value={newLocal.distrito}
                  onChange={(e) => handleInputChange(e, 'distrito')}
                  className={styles.localesFormInput}
                  placeholder="Introducir Distrito"
                />
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
                <Button
                  icon="pi pi-search"
                  onClick={async () => {
                    try {
                      const coords = await geocodeAddress(newLocal.direccion);
                      setNewLocal((prev) => ({
                        ...prev,
                        lat: coords.lat,
                        lng: coords.lng,
                      }));
                      toast.current.show({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Dirección geocodificada correctamente',
                        life: 3000,
                      });
                    } catch (error) {
                      toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: error,
                        life: 3000,
                      });
                    }
                  }}
                  className={styles.searchButton}
                  tooltip="Buscar Dirección"
                  tooltipOptions={{ position: 'top' }}
                />
              </div>
            </div>

            <div>
              <label className={styles.localesFormLabel}>Ubicación</label>
              {isLoaded && (
                <div className={styles.localesMapContainer}>
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={{ lat: newLocal.lat, lng: newLocal.lng }}
                    zoom={10}
                    onClick={handleMapClick}
                  >
                    <Marker
                      position={{ lat: newLocal.lat, lng: newLocal.lng }}
                      // Opcional: Puedes usar el mismo icono personalizado aquí si lo deseas
                      icon={{
                        url: carroIcon,
                        scaledSize: new window.google.maps.Size(40, 40),
                      }}
                    />
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
      </div>
    </Container>
  );
};

export default PageLocales;
