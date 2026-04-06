import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'boxicons/css/boxicons.min.css';
import App from './App.jsx';
import { DataProvider } from './contexts/DataContext.jsx';

createRoot(document.getElementById('root')).render(
  <DataProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </DataProvider>
);
