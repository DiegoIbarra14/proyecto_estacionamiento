import axios from "../http-common";

const getAll = () => {
  return axios.http.get("/producciones/get");
};
const create = (data) => {
  return axios.http.post("/producciones/create", data);
};
const remove = (id) => {
  return axios.http.delete(`/producciones/delete/${id}`);
};

const setObservacion = (id, data) => {
  return axios.http.put(`/producciones/setobservacion/${id}`, data);
};
const changeEstadoProduccion = (id, data) => {
  return axios.http.put(`/producciones/changeestadoproduccion/${id}`, data);
};
const produccionIngredientes = (id) => {
  return axios.http.get(`/producciones/produccionesingredientes/${id}`);
};
const produccionMaquinas = (id) => {
  return axios.http.get(`/producciones/produccionesmaquinas/${id}`);
};
const setProducciones = (id) => {
  return axios.http.get(`/producciones/setproducciones/${id}`);
};
const getLotes = (id) => {
  return axios.http.get(`/producciones/getlotes/${id}`);
};
const TutorialService = {
  getAll,
  create,
  remove,
  setObservacion,
  changeEstadoProduccion,
  produccionIngredientes,
  produccionMaquinas,
  setProducciones,
  getLotes,
};
export default TutorialService;
