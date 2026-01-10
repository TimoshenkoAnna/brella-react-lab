// src/index.js
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Suspense } from 'react'; // <-- Добавляем Suspense
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import './i18n'; // <-- Наш файл конфигурации
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* Suspense "ловит" момент загрузки переводов и показывает fallback */}
    <Suspense fallback={<div>Loading...</div>}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </Suspense>
  </React.StrictMode>
);