import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  const [token, setToken] = useState(localStorage.getItem('jwt') || '');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      console.log('Received token from URL:', urlToken);
      localStorage.setItem('jwt', urlToken);
      setToken(urlToken);
      window.history.replaceState({}, document.title, '/');
    }
  }, []); // Remove token dependency to run only on mount

  const handleLogin = (newToken) => {
    localStorage.setItem('jwt', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setToken('');
  };

  console.log('App VITE_API_URL:', import.meta.env.VITE_API_URL); // Debug

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/dashboard" element={<Dashboard token={token} onLogout={handleLogout} />} />
        <Route path="/auth/google/callback" element={<Login onLogin={handleLogin} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;