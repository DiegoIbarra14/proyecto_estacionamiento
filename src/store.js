import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from './reducers/authSlices'; // Ajusta la ruta según donde tengas tu authSlice

const rootReducer = combineReducers({
    auth: authReducer // Cambiado el nombre a 'auth' para que coincida con el slice
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }),
});

export default store;