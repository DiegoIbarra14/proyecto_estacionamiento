import axios from "../http-common";

const getAll = () => {
  return axios.http.get("/materiaproveedor/get");
};
const get = (id) => {
  return axios.http.get(`/materiaproveedor/get/${id}`);
};
const create = (data) => {
  return axios.http.post("/materiaproveedor/create", data);
};
const update = (id, data) => {
  return axios.http.put(`/materiaproveedor/update/${id}`, data);
};
const remove = (id) => {
  return axios.http.delete(`/materiaproveedor/delete/${id}`);
};

const getProveedores = (id) => {
  return axios.http.get(`/materiaproveedor/getproveedores/${id}`);
};
const materialIngreso = (id) => {
  return axios.http.get(`/materiaproveedor/materiaingreso/${id}`);
};
const exportExcel = () => {
  return axios.http.get(`/materiaproveedor/export`);
};

const TutorialService = {
  getAll,
  get,
  create,
  update,
  remove,
  getProveedores,
  materialIngreso,
  exportExcel,
};
export default TutorialService;
