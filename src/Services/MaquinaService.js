import axios from "../http-common";

const getAll = () => {
  return axios.http.get("/maquinas/get");
};
const get = (id) => {
  return axios.http.get(`/maquinas/get/${id}`);
};
const create = (data) => {
  return axios.http.post("/maquinas/create", data);
};
const update = (id, data) => {
  return axios.http.put(`/maquinas/update/${id}`, data);
};
const remove = (id) => {
  return axios.http.delete(`/maquinas/delete/${id}`);
};
const updateMaquina = (id, data) => {
  return axios.http.put(`/maquinas/mantenimiento/${id}`, data);
};
const MaquinaService = {
  getAll,
  get,
  create,
  update,
  remove,
  updateMaquina,
};
export default MaquinaService;
