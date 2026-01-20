import React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import original from 'react95/dist/themes/original';
import { styleReset } from 'react95';
import './fonts.css';

import arrowUpIcon from './assets/icon/arrowUp.png';
import arrowDownIcon from './assets/icon/arrowDown.png';
import arrowRightIcon from './assets/icon/arrowRight.png';
import arrowLeftIcon from './assets/icon/arrowLeft.png'

const GlobalStyles = createGlobalStyle`
  ${styleReset}
  ::-webkit-scrollbar {
    width: 20px; /* 滚动条宽度 */
    height: 20px;
  }
  
  /* 滚动条轨道（背景） */
  ::-webkit-scrollbar-track {
    background-color: #ffffff; 

    background-image: 
      linear-gradient(45deg, #dfdfdf 25%, transparent 25%, transparent 75%, #dfdfdf 75%), 
      linear-gradient(135deg, #dfdfdf 25%, transparent 25%, transparent 75%, #dfdfdf 75%);

    background-position: 0 0, 3px 3px;

    background-size: 3px 3px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #c0c0c0;
    box-shadow: inset 1px 1px 0px 0px #ffffff, inset -1px -1px 0px 0px #0a0a0a,
      inset 2px 2px 0px 0px #dfdfdf, inset -2px -2px 0px 0px #808080;
  }

  /* 滚动条两端的按钮区域 */
  ::-webkit-scrollbar-button:single-button {
    width: 20px;
    height: 20px;
    background-color: #c0c0c0;
    display: block;
    box-shadow: inset 1px 1px 0px 0px #ffffff, inset -1px -1px 0px 0px #0a0a0a,
      inset 2px 2px 0px 0px #dfdfdf, inset -2px -2px 0px 0px #808080;
    background-repeat: no-repeat;
    background-position: center;
  }

  ::-webkit-scrollbar-button:single-button:vertical {
    background-size: 7px 4px;
  }

  ::-webkit-scrollbar-button:single-button:horizontal {
    background-size: 4px 7px;
  }

  ::-webkit-scrollbar-button:single-button:vertical:increment {
      background-image: url(${arrowDownIcon});
  }

  ::-webkit-scrollbar-button:single-button:vertical:decrement {
      background-image: url(${arrowUpIcon});
  }

  ::-webkit-scrollbar-button:single-button:horizontal:increment {
      background-image: url(${arrowRightIcon});
  }

  ::-webkit-scrollbar-button:single-button:horizontal:decrement {
      background-image: url(${arrowLeftIcon});
  }


  ::-webkit-scrollbar-button:single-button:active {
    box-shadow: inset 1px 1px 0px 0px #0a0a0a, inset -1px -1px 0px 0px #ffffff, inset 2px 2px 0px 0px #808080, inset -2px -2px 0px 0px #dfdfdf;
    
    background-position: calc(50% + 1px) calc(50% + 1px);
  }

  ::-webkit-scrollbar-corner {
    background-color: #dfdfdf;
  }
`;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalStyles />
    <ThemeProvider theme={original}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
