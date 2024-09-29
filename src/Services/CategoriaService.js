import { ref, onValue,  } from 'firebase/database';
import { db } from '../config/firebase';

class CategoriaService {
    async getAllCataegorias(callback) {
        const categoriasRef = ref(db, 'categorias');
      

        onValue(categoriasRef, (snapshot) => {
            const data = snapshot.val();
            const categoriasArray = [];

            for (let id in data) {
                categoriasArray.push({
                    id,
                    ...data[id]
                });
            }
            console.log("dataa",categoriasArray)
            const categorias = categoriasArray.map(categoria => ({
                label: categoria.nombre,
                value: categoria.id ,
            }));

            callback(categorias);
        });
    }


}

export const categoriaService = new CategoriaService();
