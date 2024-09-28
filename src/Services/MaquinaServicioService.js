import axios from "../http-common";

const getAll = (id) => {
  return axios.http.get(`/maquinasservicios/get/${id}`);
};
const get = (id) => {
  return axios.http.get(`/maquinasservicios/get/${id}`);
};
const create = (data) => {
  return axios.http.post("/maquinasservicios/create", data);
};
const remove = (id) => {
  return axios.http.delete(`/maquinasservicios/delete/${id}`);
};

const MaquinaServicioService = {
  getAll,
  get,
  create,
  remove,
};
export default MaquinaServicioService;
