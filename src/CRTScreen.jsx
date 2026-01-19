// src/CRTScreen.jsx
import React from 'react';
import './crt.css'; // 引入刚才创建的 CSS

const CRTScreen = () => {
  // 这个组件只负责渲染一个带有特定类的空 div
  return <div className="crt-overlay"></div>;
};

export default CRTScreen;