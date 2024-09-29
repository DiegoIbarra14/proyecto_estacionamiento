import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from '../config/firebase';
import { get, onValue, push, ref, remove, set, update } from 'firebase/database';
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
}

export const localService = new LocalService();
