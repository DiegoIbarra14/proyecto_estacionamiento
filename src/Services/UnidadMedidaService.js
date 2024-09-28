import axios from "../http-common";


const getAll = () => {
  return axios.http.get("/unidadesmedida/get");
};

const TutorialService = {
  getAll,
};
export default TutorialService;
