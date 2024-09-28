import axios from "../http-common";

const getAll = () => {
  return axios.http.get("/modalidadpagos/get");
};
const create = (data) => {
  return axios.http.post("/modalidadpagos/create", data);
};
const ModalidadPagoService = {
  getAll,
  create,
};
export default ModalidadPagoService;
