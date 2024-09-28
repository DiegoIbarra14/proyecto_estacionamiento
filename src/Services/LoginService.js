import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase";
import axios from "../http-common";
import React, { useState } from "react";
import { get, ref } from "firebase/database";

const login = async (email, password) => {
  console.log("Logging in with:", email, password);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User data:", user);
    const uid = user.uid;

    // Obtener datos del usuario
    const userRef = ref(db, `usuarios/${uid}`);
    const userSnapshot = await get(userRef);
    
    if (!userSnapshot.exists()) {
      throw new Error('Usuario no encontrado');
    }

    const userData = userSnapshot.val();
    const rolId = userData.rol_id;

    // Obtener accesos del rol
    const rolRef = ref(db, `roles/${rolId}`);
    const rolSnapshot = await get(rolRef);
    
    if (!rolSnapshot.exists()) {
      throw new Error('Rol no encontrado');
    }

    const rolData = rolSnapshot.val();
    const accesos = rolData.accesos;

    localStorage.setItem('usuario', JSON.stringify(userData));
    localStorage.setItem('accesos', JSON.stringify(accesos));

    return {
      id: user.uid,
      token: await user.getIdToken(),
      accesos, // Devuelve los accesos aquí
    };
  } catch (error) {
    console.error('Error en el login:', error);
    throw error;
  }
};

const logout = () => {
  return axios.deleteToken();
};
const setToken = (data) => {
  return axios.setToken(data);
};
const my = () => {
  console.log("myyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
  return axios.http.post("/my");
};

const changePassword = (data) => {
  return axios.http.post("/changePassword", data);
};
const getToken = () => {
  return axios.getToken();
};
const LoginService = {
  login,
 
};
export default LoginService;
