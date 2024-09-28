import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter, HashRouter } from 'react-router-dom';

//Control de notificaciones Temporal
import { NotificacionesProvider } from './NotificacionesContext';
import { Provider } from 'react-redux';
import store from './store';


ReactDOM.render(
  <HashRouter>
    <React.StrictMode>

      {/* Control de notificaciones Temporal */}

      <NotificacionesProvider >
        <Provider store={store}>
          <App />
        </Provider>
      </NotificacionesProvider>




    </React.StrictMode>
  </HashRouter>,
  document.getElementById('root'),
);
