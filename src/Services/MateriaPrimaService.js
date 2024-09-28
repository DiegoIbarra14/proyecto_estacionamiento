import axios from "../http-common";
import materiaPrimaMapper from "../mappers/materiaPrima/materiaPrimaMapper";

import materiaPrimaSubmitMapper from "../mappers/materiaPrima/materiaPrimaSubmitMapper";

class MateriaPrimaService {
  async createMateria(materiaPrimaData) {
    try {
      let data = materiaPrimaSubmitMapper(materiaPrimaData)
      await axios.http.post("/materiasprimas/create", data);
      return true

    } catch (error) {
      console.log("datos no enviados", error)
      return false
    }
  }
  async getAllMateriaPrima() {
    try {
      let dataApi = (await (axios.http.get("/materiasprimas/get")))?.data?.data
      const dataMateriaPrima = dataApi.map(data => materiaPrimaMapper.toViewModel(data));
      return dataMateriaPrima

    } catch (error) {
      alert("error al traer los datos")

    }

  }
  async updateMateriaPrima(materiaPrimaData) {
    try {
      let data = materiaPrimaSubmitMapper(materiaPrimaData)
      await axios.http.post(`/materiasprimas/update/${materiaPrimaData.id}`, data);
      return true

    } catch (error) {
      console.log("datos no enviados", error)
      return false
    }
  }
}

export const materiaPrimaService = new MateriaPrimaService()
















const getAll = () => {
  return axios.http.get("/materiasprimas/get");
};
const get = (id) => {
  return axios.http.get(`/materiaprima/get/${id}`);
};
const create = (data) => {
  return axios.http.post("/materiaprima/create", data);
};
const update = (id, data) => {
  return axios.http.put(`/materiaprima/update/${id}`, data);
};
const remove = (id) => {
  return axios.http.delete(`/materiaprima/delete/${id}`);
};

const historial = (id) => {
  return axios.http.get(`/materiaprima/historia/${id}`);
};
const TutorialService = {
  getAll,
  get,
  create,
  update,
  remove,
  historial,
};
export default TutorialService;
