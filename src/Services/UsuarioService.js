import axios from "../http-common";

const getAllTipoDocumentos = () => {
  return axios.http.get("/usuarios/tiposdocumentos/get");
};
/*const get = (id) => {
  return axios.http.get(`/productos/get/${id}`);
};
const create = (data) => {
  return axios.http.post("/productos/", data);
};
const update = (id, data) => {
  return axios.http.put(`/tutorials/${id}`, data);
};
const remove = (id) => {
  return axios.http.delete(`/tutorials/${id}`);
};
const removeAll = () => {
  return axios.http.delete(`/tutorials`);
};
const findByTitle = (title) => {
  return axios.http.get(`/tutorials?title=${title}`);
};*/
const UsuarioService = {
  getAllTipoDocumentos,
  /*get,
  create,
  update,
  remove,
  removeAll,
  findByTitle,*/
};
export default UsuarioService;
