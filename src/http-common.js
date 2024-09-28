import axios from "axios";
/*export default ax=axios.create({
  baseURL: "http://34.237.228.37/nutrillis_back/public/api",
  headers: {
    "Content-type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  },
});*/
// const getToken = () => {
//   const tokenString = JSON.parse(localStorage.getItem("token"));
//   return tokenString;
// };
// const apiUrl = import.meta.env.VITE_APP_API_URL;
// const http = axios.create({
//   baseURL: apiUrl,
//   headers: {
//     "Content-type": "application/json",
//     Authorization: `Bearer ${getToken()}`,
//   },
// });

// const deleteToken = () => {
//   localStorage.removeItem("token");
//   //localStorage.clear();
// };
// const setToken = (token) => {
//   localStorage.setItem("token", JSON.stringify(token));
// };
// http.interceptors.request.use(
//   (config) => {
//     const token = getToken();
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );


const AxiosServices = {
 
  
};

export default AxiosServices;
