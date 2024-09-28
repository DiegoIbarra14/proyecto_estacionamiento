import axios from "../http-common";

const getAll = () => {
  return axios.http.get("/usuarios/tiposdocumentos/get");
};
const TipoDocumentoService = {
  getAll,
  //get,
  //create,
  //update,
  //remove,
};
export default TipoDocumentoService;
