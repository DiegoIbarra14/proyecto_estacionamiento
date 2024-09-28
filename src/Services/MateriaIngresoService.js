import axios from "../http-common";

const create = (data) => {
  return axios.http.post("/materiaingreso/create", data);
};
const getAll = () => {
  return axios.http.get("/materiaingreso/get");
};
const remove = (id) => {
  return axios.http.delete(`/materiaingreso/delete/${id}`);
};

const TutorialService = {
  getAll,
  create,
  remove,
};
export default TutorialService;
