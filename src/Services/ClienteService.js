import axios from "../http-common";

const getAll = () => {
  return axios.http.get("/clientes/get");
};
/*const get = (id) => {
  return axios.http.get(`/proveedores/get/${id}`);
};*/
const create = (data) => {
  return axios.http.post("/clientes/create", data);
};
const update = (id, data) => {
  return axios.http.put(`/clientes/update/${id}`, data);
};
const remove = (id) => {
  return axios.http.delete(`/clientes/delete/${id}`);
};
/*const removeAll = () => {
  return axios.http.delete(`/tutorials`);
};
*/
const getAllLocales = (id) => {
  return axios.http.get(`clientes/locales/getcliente/${id}`);
};
const createLocal = (data) => {
  return axios.http.post("/clientes/locales/create", data);
};
const updateLocal = (id, data) => {
  return axios.http.put(`/clientes/locales/update/${id}`, data);
};
const removeLocal = (id) => {
  return axios.http.delete(`/clientes/locales/delete/${id}`);
};
const ClienteService = {
  getAll,
  //  get,
  create,
  update,
  remove,
  // removeAll,
  getAllLocales,
  createLocal,
  updateLocal,
  removeLocal,
};
export default ClienteService;
