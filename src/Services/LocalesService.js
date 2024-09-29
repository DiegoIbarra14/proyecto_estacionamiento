import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from '../config/firebase';
import { onValue, push, ref, remove, set, update } from 'firebase/database';
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
}

export const localService = new LocalService();
