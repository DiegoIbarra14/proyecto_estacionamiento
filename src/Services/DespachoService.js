import axios from "../http-common";

const get = (id) => {
  return axios.http.get(`/pedidos/despachos/get/${id}`);
};
const create = (data) => {
  return axios.http.post("/pedidos/despachos/create", data);
};
const remove = (id) => {
  return axios.http.delete(`/pedidos/despachos/delete/${id}`);
};
const updateTrabajador = (id, data) => {
    return axios.http.put(`pedidos/despachos/updateTrabajador/${id}`, data);
};
const updateEntregado = (id, data) => {
    return axios.http.put(`pedidos/despachos/despachoEntregado/${id}`, data);
};
const getDespachoDetalle = (id) => {
  return axios.http.get(`/pedidos/despachosdetalles/get/${id}`);
};

const DespachoService = {
  //getAll,
  get,
  create,
  //update,
  remove,
  updateTrabajador,
  updateEntregado,
  getDespachoDetalle,
};
export default DespachoService;
