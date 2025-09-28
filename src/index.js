import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/global/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/fonts/fontVars.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';

  // Only bundle Yale fonts in internal build
if (process.env.REACT_APP_APP_MODE === 'internal') {
  require('./assets/styles/fonts/yale-fonts.css');
  document.documentElement.classList.add('yale-fonts');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
