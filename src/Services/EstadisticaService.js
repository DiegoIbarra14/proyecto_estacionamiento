import axios from "../http-common";

const bars = (data) => {
  return axios.http.post("/estadistica/bars", data);
};
const EstadisticaService = {
  bars,
};
export default EstadisticaService;
