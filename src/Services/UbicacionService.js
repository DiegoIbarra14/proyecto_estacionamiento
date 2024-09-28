import axios from "../http-common";

const getAll = () => {
  return axios.http.get("/ubicaciones/get");
};
const get = (id) => {
  return axios.http.get(`/ubicaciones/get/${id}`);
};
const create = (data) => {
  return axios.http.post("/ubicaciones/create", data);
};
const update = (id, data) => {
  return axios.http.put(`ubicaciones/update/${id}`, data);
};
const remove = (id) => {
  return axios.http.delete(`/ubicaciones/delete/${id}`);
};
const UbicacionService = {
  getAll,
  get,
  create,
  update,
  remove,
};
export default UbicacionService;
