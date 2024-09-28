import axios from "../http-common";


export const getAllAccesos = () => {
    return axios.http.get("/acceso/get")
}
export const createRole = async (data) => {
    const response = await axios.http.post("/rol/create", data)
    return response.data
}

export const getAllRoles = async () => {
    const response = await axios.http.get("/rol/get")
    return response.data

}
export const putRole = async (data, id) => {
    const response = await axios.http.put(`rol/udpate/${id}`, data)
    return response.data

}
export const deleteRole = async (id) => {
    const response = await axios.http.delete(`rol/delete/${id}`)
    return response.data

}
export const asingRoleToUser = async (data, rol_id, worker_id) => {
    const response = await axios.http.post(`rol/asign/${rol_id}/${worker_id}`, data)
    return response.data
}
export const validateUserName = async (data) => {
    const response = await axios.http.post(`user/validate-exists-username`, data)
    return response.data

}

export const getAllWorker = async () => {
    const response = await axios.http.get(`trabajadores-without-user-rol/get`)
    return response.data
}
export const deleteRoleToUser = async (rol_id, worker_id) => {
    const response = await axios.http.delete(`rol/remove/${rol_id}/${worker_id}`)
    return response.data

}
export const getRolById = async (id) => {
    const response = await axios.http.get(`rol/show/${id}`)
    return response.data
}
export const changePassword = async (data,id) => {
    const response = await axios.http.put(`trabajador/password/update/${id}`, data)
    return response.data

}