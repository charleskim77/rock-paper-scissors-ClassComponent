import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppClass from './AppClass';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AppClass />
  </React.StrictMode>
);

reportWebVitals();