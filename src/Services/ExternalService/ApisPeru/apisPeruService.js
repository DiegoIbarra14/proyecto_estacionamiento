import axios from "axios";
const baseURL=import.meta.env._APIS_PERU_BASE_URL
const token=import.meta.env._APIS_PERU_TOKEN
const api=axios.create({
    baseURL:baseURL
})
const fetchData = async (endpoint, identifier) => {
    try {
      // Construir la URL dinámica con el token y el identificador (RUC o DNI)
      const url = `${endpoint}/${identifier}?token=${import.meta.env.VITE_API_TOKEN}`;
      // Realizar la solicitud GET
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching data from Peru API:', error);
      throw error;
    }
  };
  
  export { fetchData };