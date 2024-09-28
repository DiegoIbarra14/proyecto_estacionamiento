import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import LoginService from "../Services/LoginService";
import { history } from "../history";

const getLocalStorageItem = (key, defaultValue) => {
    const item = localStorage.getItem(key);
    // Verificar si el item existe y no es 'undefined'
    return item !== null && item !== 'undefined' ? JSON.parse(item) : defaultValue;
};

const initialState = {
    authenticated: getLocalStorageItem("authenticated", false),
    accesos: getLocalStorageItem("accesos", null),
    token: getLocalStorageItem("token", null),
    loading: false,
};
// Thunk para verificar el estado de autenticación
export const checkAuthState = createAsyncThunk(
    'auth/checkAuthState',
    (_, { rejectWithValue }) => {
        return new Promise((resolve, reject) => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    user.getIdToken().then((token) => {
                        const accesos = JSON.parse(localStorage.getItem("accesos")) || ["default-access"];
                        resolve({ token, accesos, id: user.uid });
                    });
                } else {
                    reject(rejectWithValue(null));
                }
            });
        });
    }
);

// Thunk para iniciar sesión
export const signInUser = createAsyncThunk('signInUser', async (body, { rejectWithValue }) => {
    try {
        const response = await LoginService.login(body?.username, body?.password);
        return response;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const authSlice = createSlice({

    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            signOut(auth);
            state.authenticated = false;
            state.accesos = null;
            state.token = null;
            localStorage.removeItem("accesos");
            localStorage.removeItem("token");
            localStorage.removeItem("id");
            history.navigate('/login');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuthState.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkAuthState.fulfilled, (state, { payload }) => {
                state.authenticated = true;
                state.token = payload.token;
                state.accesos = payload?.accesos;
                state.loading = false;
            })
            .addCase(checkAuthState.rejected, (state) => {
                state.authenticated = false;
                state.token = null;
                state.accesos = null;
                state.loading = false;
            })
            .addCase(signInUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(signInUser.fulfilled, (state, action) => {
                const data = action.payload; // Asegúrate de obtener el payload correcto
                console.log("dataa", data)
                localStorage.setItem("token", JSON.stringify(data.token));
                localStorage.setItem("id", JSON.stringify(data.id)); // Usa el id correcto
                // localStorage.setItem("accesos", JSON.stringify(data.rol.accesos)); // Asegúrate que 'rol.accesos' exista
                state.authenticated = true;
                state.accesos = data.accesos; // Esto debería existir en la respuesta
                state.token = data.token;
                state.loading = false;
            })
            .addCase(signInUser.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
