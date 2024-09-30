import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from '../config/firebase';
import { equalTo, get, onValue, orderByChild, push, query, ref, remove, set, update } from 'firebase/database';
class LocalService {
    async createLocal(localData) {
        console.log("hoass")
        if (!localData?.id) {
            try {
                const docRef = await push(ref(db, "locales"), localData);
                console.log("Local creado con ID: ", docRef);
                return true;
            } catch (error) {
                console.error("Error al agregar el local: ", error);
                return false;
            }
        } else {
            return this.updateLocal(localData?.id, localData);
        }
    }

    async getAllLocalsRealTime(setLocalsCallback) {
        const localsRef = ref(db, 'locales');
        onValue(localsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const localsArray = Object.entries(data).map(([id, local]) => ({ id, ...local }));
                setLocalsCallback(localsArray);
            } else {
                setLocalsCallback([]); // Si no hay locales
            }
        }, (error) => {
            console.error('Error al obtener los locales:', error);
        });
    }

    async updateLocal(id, updatedData) {
        const localRef = ref(db, 'locales/' + id); // Crea una referencia al local específico

        try {
            await update(localRef, updatedData); // Actualiza los datos del local
            console.log("Local actualizado");
            return true;
        } catch (error) {
            console.error("Error actualizando el local: ", error);
            return false;
        }
    }

    async deleteLocal(id) {

        const localRef = ref(db, 'locales/' + id); // Crea una referencia al local específico

        try {
            await remove(localRef); // Elimina el local de la base de datos
            console.log("Local eliminado");
            return true;
        } catch (error) {
            console.error("Error al eliminar el local: ", error);
            return false;
        }
    }
    async getLocalById(localId, callback) {
        const localRef = ref(db, `locales/${localId}`); // Ajusta la ruta según tu estructura de datos

        onValue(localRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Aquí puedes desestructurar el objeto según lo que necesites
                const { espacios } = data;
                console.log("dd", espacios)
                const espaciosArray = espacios
                    ? Object.entries(espacios) // Obtiene tanto las claves como los valores
                        .filter(([id, space]) => space !== null) // Filtra los espacios nulos
                        .map(([id, space]) => ({
                            id,           // El id del espacio (la clave en el objeto)
                            ...space      // Los datos del espacio
                        }))
                    : [];
                console.log("dd", espaciosArray)

                console.log("Espacios del local:", espaciosArray); // Para verificar los espacios obtenidos
                callback(espaciosArray);
            } else {
                console.error("No se encontró el local con el ID proporcionado");
                callback([]); // Retorna un array vacío si no se encontró el local
            }
        });
    }
    async agregarEspacio(localId, nuevoEspacio) {
        const localRef = ref(db, `locales/${localId}/espacios`); // Ruta del local

        try {
            // Obtiene los espacios existentes
            const snapshot = await get(localRef);
            const espacios = snapshot.val() || {}; // Si no existe, inicializa como un objeto vacío

            // Agrega el nuevo espacio usando el nombre como clave
            espacios[nuevoEspacio.nombre] = {
                disponibilidad: nuevoEspacio.disponibilidad,
                nombre: nuevoEspacio.nombre,

            };

            // Actualiza el registro en la base de datos
            await update(localRef, espacios); // Actualiza el nodo de espacios
        } catch (error) {
            console.error("Error al agregar espacio:", error);
        }
    }
    async eliminarEspacio(localId, nombreEspacio) {
        console.log("cambio", nombreEspacio)
        const espacioRef = ref(db, `locales/${localId}/espacios/${nombreEspacio}`); // Ruta específica del espacio
        console.log("eelo", `locales/${localId}/espacios/${nombreEspacio}`)
        try {
            // Elimina el espacio de la base de datos
            await remove(espacioRef);
            console.log(`Espacio ${nombreEspacio} eliminado exitosamente.`);
        } catch (error) {
            console.error("Error al eliminar el espacio:", error);
        }
    }
    async editarEspacio(localId, nombreEspacio, nuevosDatos) {
        const espacioRef = ref(db, `locales/${localId}/espacios/${nombreEspacio}`); // Referencia a la ruta del espacio
        console.log(`locales/${localId}/espacios/${nombreEspacio}`)
        try {
            // Actualizar los datos del espacio
            await update(espacioRef, {
                disponibilidad: nuevosDatos.disponibilidad,
                nombre: nuevosDatos.nombre,

            });
            console.log(`Espacio ${nombreEspacio} actualizado exitosamente.`);
            return true
            // Aquí puedes agregar un toast o notificación de éxito si usas alguna librería de UI
        } catch (error) {
            console.error("Error al actualizar el espacio:", error);
            // Aquí puedes agregar un toast o notificación de error si algo falla
        }

    }
    async getAllUsers(callback) {
        const usersRef = ref(db, "usuarios"); // Ruta a la colección de usuarios

        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Convertimos el objeto de usuarios en un array plano
                const usersArray = Object.keys(data).map((userId) => ({
                    id: userId,   // Agregamos el ID del usuario
                    ...data[userId], // Agregamos todos los datos del usuario
                }));
                console.log("Todos los usuarios:", usersArray);
                callback(usersArray); // Llama al callback con el array de usuarios
            } else {
                console.error("No se encontraron usuarios");
                callback([]); // Retorna un array vacío si no se encontraron usuarios
            }
        });
    }
    async crearAlquilerYActualizarEspacio(alquilerData, espacioId, localId) {
        console.log("esto envia", espacioId)

        console.log("esta es la data", alquilerData)
        try {
            const alquileresRef = ref(db, 'alquileres'); // Referencia a la colección de alquileres
            const nuevoAlquilerRef = push(alquileresRef); // Crea un nuevo documento en la colección

            // Fecha y hora actuales (inicio del alquiler)
            const fechaHoraInicio = new Date().toISOString();

            // Datos del nuevo alquiler que vamos a guardar
            const nuevoAlquiler = {
                usuario_id: alquilerData.usuario_id,
                espacio_id: espacioId,
                placa_vehiculo: alquilerData.placa_vehiculo,
                fecha_hora_inicio: fechaHoraInicio, // Agregamos la fecha y hora de inicio
                fecha_fin: "",
                estado_pago: "Incompleto",
                estado_alquiler: 1,
                precio_final: ""

            };

            // Guarda el nuevo alquiler en Firebase
            await set(nuevoAlquilerRef, nuevoAlquiler);

            console.log("Alquiler creado exitosamente:", nuevoAlquiler);

            // Actualiza la disponibilidad del espacio a `false`
            const espacioRef = ref(db, `locales/${localId}/espacios/${espacioId}`);
            console.log("da", `locales/${localId}/espacios/${espacioId}`)
            await update(espacioRef, { disponibilidad: false });


            console.log(`Estado de disponibilidad del espacio ${espacioId} actualizado a false`);
        } catch (error) {
            console.error("Error al crear el alquiler y actualizar el espacio:", error);
        }
    }
    async obtenerAlquileresPorEspacio(espacioId, callback) {
        console.log("data", espacioId);
        try {
            const alquileresRef = ref(db, 'alquileres');

            // Consulta para obtener los alquileres filtrados por espacio_id
            const q = query(alquileresRef, orderByChild('espacio_id'), equalTo(espacioId));
            const snapshot = await get(q);

            if (!snapshot.exists()) {
                console.log("No se encontraron alquileres para este espacio.");
                return [];
            }

            const alquileresPromises = [];

            // Recorrer los alquileres obtenidos
            snapshot.forEach((alquilerSnap) => {
                const alquilerData = alquilerSnap.val();
                const alquilerId = alquilerSnap.key; // Obtener el ID del alquiler
                console.log("data-arc", alquilerId);

                // Referencia al usuario/persona asociada al alquiler
                const personaRef = ref(db, `usuarios/${alquilerData.usuario_id}/persona`);

                // Agregar la promesa a la lista
                const personaPromise = get(personaRef).then((personaSnap) => {
                    console.log("holas", personaSnap?.val());
                    if (personaSnap.exists()) {
                        const personaData = personaSnap.val();

                        // Retornar los datos del alquiler, la persona y el ID del alquiler
                        return {
                            id: alquilerId, // Agregar el ID del alquiler
                            ...alquilerData,
                            nombre_persona: `${personaData.nombres} ${personaData.apellidos}`,
                            numero_documento: personaData.documento // Corrección aquí
                        };
                    } else {
                        // Si no existe la persona, retornar solo el alquiler con su ID
                        return {
                            id: alquilerId,
                            ...alquilerData
                        };
                    }
                }).catch((error) => {
                    console.error("Error al obtener los datos de la persona:", error);
                    return {
                        id: alquilerId,
                        ...alquilerData // Retornar solo el alquiler con su ID en caso de error
                    };
                });

                // Agregar la promesa a la lista de promesas
                alquileresPromises.push(personaPromise);
            });

            // Esperar a que todas las promesas se resuelvan
            const alquileres = await Promise.all(alquileresPromises);

            console.log("Alquileres completos:", alquileres);
            callback(alquileres);

        } catch (error) {
            console.error("Error al obtener los alquileres por espacio:", error);
            throw error;
        }
    }
    async finalizarAlquiler(alquilerId, espacioId, localId) {
        try {
            // Referencia al alquiler específico
            const alquilerRef = ref(db, `alquileres/${alquilerId}`);

            // Obtener la información del alquiler
            const alquilerSnapshot = await get(alquilerRef);

            if (alquilerSnapshot.exists()) {
                const alquilerData = alquilerSnapshot.val();
                // Obtener la fecha y hora actuales (fin del alquiler)
                const fechaFin = new Date().toISOString();

                // Obtener el precio por hora del local
                const localRef = ref(db, `locales/${localId}`);
                const localSnapshot = await get(localRef);

                if (localSnapshot.exists()) {
                    const localData = localSnapshot.val();
                    const precioHora = localData.precio_hora; // Atributo en el local

                    // Calcular el tiempo de alquiler en horas usando fecha_hora_inicio del alquiler
                    const horasAlquiler = this?.calcularHorasAlquiler(alquilerData.fecha_hora_inicio, fechaFin);
                    const precioFinal = precioHora * horasAlquiler;

                    // Actualizar el alquiler con la fecha fin, precio final y estado
                    await update(alquilerRef, {
                        fecha_fin: fechaFin,
                        precio_final: precioFinal,
                        estado_alquiler: 2 // Cambiar a pagado y cancelado
                    });

                    console.log(`Alquiler ${alquilerId} finalizado exitosamente con precio final: ${precioFinal}`);

                    // Liberar el espacio estableciendo su disponibilidad a `true`
                    const espacioRef = ref(db, `locales/${localId}/espacios/${espacioId}`);
                    await update(espacioRef, { disponibilidad: true });
                    console.log(`Estado de disponibilidad del espacio ${espacioId} actualizado a true`);
                } else {
                    console.error("No se encontró el local para obtener el precio por hora.");
                }
            } else {
                console.error("No se encontró el alquiler para finalizar.");
            }
        } catch (error) {
            console.error("Error al finalizar el alquiler:", error);
        }
    }

    // Función para calcular el tiempo de alquiler en horas
    calcularHorasAlquiler(fechaHoraInicio, fechaHoraFin) {
        const inicio = new Date(fechaHoraInicio);
        const fin = new Date(fechaHoraFin);
        const diferenciaEnHoras = (fin - inicio) / (1000 * 60 * 60); // Convertir de milisegundos a horas
        return Math.ceil(diferenciaEnHoras); // Redondear hacia arriba para cobrar por horas completas
    }



}

export const localService = new LocalService();
