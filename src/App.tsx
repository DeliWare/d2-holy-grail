import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/home';
import Login from './components/login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
