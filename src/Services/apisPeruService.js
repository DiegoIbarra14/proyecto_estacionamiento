import axios from "axios";
const token = import.meta.env.VITE_APP_APIS_PERU_TOKEN;
const baseUrl = import.meta.env.VITE_APP_APIS_PERU_BASE_URL;
const api=axios.create({
    baseURL:baseUrl
})
const fetchDataDocument = async (endpoint, identifier) => {
    try {
      // Construir la URL dinámica con el token y el identificador (RUC o DNI)
      const url = `${endpoint}/${identifier}?token=${token}`;
      // Realizar la solicitud GET
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching data from Peru API:', error);
      throw error;
    }
  };
  
  export { fetchDataDocument };