import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App.jsx';
import './styles/global.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007A3D',
    },
    secondary: {
      main: '#F2B705',
    },
    background: {
      default: '#f5f7f6',
    },
  },
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
