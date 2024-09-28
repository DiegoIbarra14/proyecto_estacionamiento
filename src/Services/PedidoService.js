import axios from "../http-common";

const getAll = () => {
  return axios.http.get("/pedidos/get");
};
const get = (id) => {
  return axios.http.get(`/pedidos/get/${id}`);
};
const create = (data) => {
  return axios.http.post("/pedidos/create/", data);
};
const update = (id, data) => {
  return axios.http.put(`/pedidos/update/${id}`, data);
};
const remove = (id) => {
  return axios.http.delete(`/pedidos/delete/${id}`);
};
const getPedidoDetalle = (id) => {
  return axios.http.get(`/pedidos/pedidosDetalles/get/${id}`);
};
const updatePedidoIncompleto = (id, data) => {
  return axios.http.put(`/pedidos/pedidoIncompleto/${id}`, data);
};
const updatePedidoCompleto = (id, data) => {
  return axios.http.put(`/pedidos/pedidoCompleto/${id}`, data);
};
const PedidoService = {
  getAll,
  get,
  create,
  update,
  remove,
  getPedidoDetalle,
  updatePedidoIncompleto,
  updatePedidoCompleto,
};
export default PedidoService;
