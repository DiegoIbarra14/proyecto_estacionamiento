import axios from "../http-common";

const getAll = () => {
  return axios.http.get("/servicios/get");
};
const get = (id) => {
  return axios.http.get(`/servicios/get/${id}`);
};
const create = (data) => {
  return axios.http.post("/servicios/create", data);
};
const update = (id, data) => {
  return axios.http.put(`servicios/update/${id}`, data);
};
const remove = (id) => {
  return axios.http.delete(`/servicios/delete/${id}`);
};
const ServicioService = {
  getAll,
  get,
  create,
  update,
  remove,
};
export default ServicioService;
