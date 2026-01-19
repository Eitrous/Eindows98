import React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import original from 'react95/dist/themes/original';
import { styleReset } from 'react95';
import './fonts.css';
import { Analytics } from "@vercel/analytics/react"

const GlobalStyles = createGlobalStyle`
  ${styleReset}
`;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalStyles />
    <ThemeProvider theme={original}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
