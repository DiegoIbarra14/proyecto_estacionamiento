import axios from "../http-common";


const create = (data) => {
    return axios.http.post(`/mails/create`,data);
};
const getCorreo = (id) => {
    return axios.http.get(`/mails/get/${id}`);
}

const TutorialService = {
    create,
    getCorreo
};
export default TutorialService;
