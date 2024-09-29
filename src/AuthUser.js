import axios from "axios";
import { useState } from "react";
//import { useHistory } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function AuthUser() {
  const navigate = useNavigate();
  /*export default ax=axios.create({
    baseURL: "http://34.237.228.37/nutrillis_back/public/api",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });*/
  const apiUrl = import.meta.env.VITE_APP_API_URL;

  const getToken = () => {
    const tokenString = JSON.parse(localStorage.getItem("token"));
    return tokenString;
  };

  const [token, setToken] = useState(getToken());


  const saveToken = (token) => {
    localStorage.setItem("token", JSON.stringify(token));

    setToken(token);
  };

  const deleteToken = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const http = axios.create({

    baseURL: apiUrl,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const httppdf = axios.create({

    baseURL: apiUrl,
    headers: {
      "Content-type": "application/pdf",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const endpoint = apiUrl;

  return {
    endpoint,
    axios,
    token,
    getToken,
    deleteToken,
    setToken: saveToken,
    http,
    httppdf,
  }
}
