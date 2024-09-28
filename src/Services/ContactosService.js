import axios from "../http-common";
export const getAllContacts = (proveedorId) => {
    return axios.http.get(`proveedores/contacto/get/${proveedorId}`)
}
export const createContact = async (data,proveedorId) => {
    const response = await axios.http.post(`proveedores/contacto/create/${proveedorId}`, data)
    return response.data
}
export const showContact = async (contactoId) => {
    const response = await axios.http.get(`proveedores/contacto/show/${contactoId}`)
    return response.data

}
export const putContact = async (data, contactoId) => {
    const response = await axios.http.post(`proveedores/contacto/update/${contactoId}`, data)
    return response.data
}
export const deleteContact = async (contactoId) => {
    const response = await axios.http.put(`proveedores/contacto/delete/${contactoId}`)
    return response.data

}