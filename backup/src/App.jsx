import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DemoShell from './components/DemoShell';
import Login from './components/Login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DemoShell />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
