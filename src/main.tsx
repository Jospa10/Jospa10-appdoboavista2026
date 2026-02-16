import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // Certifique-se que está SEM o .tsx aqui
import './index.css'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

