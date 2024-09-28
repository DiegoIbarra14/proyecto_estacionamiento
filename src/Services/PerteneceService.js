import axios from "../http-common";

const getAll = () => {
  return axios.http.get("/pertenece/get");
};
const get = (id) => {
  return axios.http.get(`/pertenece/get/${id}`);
};
const create = (data) => {
  return axios.http.post("/pertenece/create", data);
};
const update = (id, data) => {
  return axios.http.put(`pertenece/update/${id}`, data);
};
const remove = (id) => {
  return axios.http.delete(`/pertenece/delete/${id}`);
};
const PerteneceService = {
  getAll,
  get,
  create,
  update,
  remove,
};
export default PerteneceService;
