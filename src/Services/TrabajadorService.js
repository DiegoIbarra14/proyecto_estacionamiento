import axios from "../http-common";

const getAll = () => {
  return axios.http.get("/trabajadores/get");
};
const get = (id) => {
  return axios.http.get(`/trabajadores/get/${id}`);
};
const create = (data) => {
  return axios.http.post("/trabajadores/create", data);
};
const update = (id, data) => {
  return axios.http.put(`trabajadores/update/${id}`, data);
};
const remove = (id) => {
  return axios.http.delete(`/trabajadores/delete/${id}`);
};
const TrabajadorService = {
  getAll,
  get,
  create,
  update,
  remove,
};
export default TrabajadorService;
