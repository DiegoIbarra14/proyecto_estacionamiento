import axios from "../http-common";

const getAll = () => {
  return axios.http.get("/productos/get");
};
const get = (id) => {
  return axios.http.get(`/productos/get/${id}`);
};
const create = (data) => {
  return axios.http.post("/productos/create", data);
};
const update = (id, data) => {
  return axios.http.put(`productos/update/${id}`, data);
};
const remove = (id) => {
  return axios.http.delete(`/productos/delete/${id}`);
};
/*const removeAll = () => {
  return axios.http.delete(`/tutorials`);
};*/
/*const findByTitle = (title) => {
  return axios.http.get(`/tutorials?title=${title}`);
};*/
const TutorialService = {
  getAll,
  get,
  create,
  update,
  remove,
  //removeAll,
  //findByTitle,
};
export default TutorialService;
