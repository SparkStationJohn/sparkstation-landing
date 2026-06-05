import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import DemoShell from './components/DemoShell';
import Login from './components/Login';

function App() {
  useEffect(() => {
    // Generate and store browser session ID if it doesn't exist
    let browserSessionId = localStorage.getItem('spark_browser_session');
    if (!browserSessionId) {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        browserSessionId = crypto.randomUUID();
      } else {
        browserSessionId = 'spark_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now();
      }
      localStorage.setItem('spark_browser_session', browserSessionId);
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/demo" element={<DemoShell />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
