import axios from "../http-common";
export const getAllDataCards = async () => {
    const response = await axios.http.get(`estadistica/get`)
    return response.data
}