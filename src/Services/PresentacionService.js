import axios from "../http-common";


const getAll = () => {
  return axios.http.get("/presentaciones/get");
};

const TutorialService = {
  getAll,
};
export default TutorialService;
