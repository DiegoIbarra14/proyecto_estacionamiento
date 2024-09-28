import axios from "../http-common";


const create = (id) => {
    return axios.http.post(`/almacenes/create/${id}`);
};

const TutorialService = {
    create,
};
export default TutorialService;
