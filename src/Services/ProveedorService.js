import axios from "../http-common";

const getAll = () => {
  return axios.http.get("/proveedores/get");
};
/*const get = (id) => {
  return axios.http.get(`/proveedores/get/${id}`);
};*/
const create = (data) => {
  return axios.http.post("/proveedores/create", data);
};
const update = (id, data) => {
  return axios.http.put(`/proveedores/update/${id}`, data);
};
const remove = (id) => {
  return axios.http.delete(`/proveedores/delete/${id}`);
};
/*const removeAll = () => {
  return axios.http.delete(`/tutorials`);
};
*/
const ProveedorService = {
  getAll,
  //  get,
  create,
  update,
  remove,
  // removeAll,
};
export default ProveedorService;
