import axios from "../http-common";

const getAll = () => {
  return axios.http.get("/tipostrabajadores/get");
};
const get = (id) => {
  return axios.http.get(`/tipostrabajadores/get/${id}`);
};
const create = (data) => {
  return axios.http.post("/tipostrabajadores/create", data);
};
const update = (id, data) => {
  return axios.http.put(`/tipostrabajadores/update/${id}`, data);
};
const remove = (id) => {
  return axios.http.delete(`/tipostrabajadores/delete/${id}`);
};
const TipoTrabajadorService = {
  getAll,
  get,
  create,
  update,
  remove,
};
export default TipoTrabajadorService;
