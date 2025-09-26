import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('jwt') || '');

  console.log('App VITE_API_URL:', import.meta.env.VITE_API_URL);
  console.log('App loaded, current path:', window.location.pathname);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      console.log('Received token from URL:', urlToken);
      localStorage.setItem('jwt', urlToken);
      setToken(urlToken);
      window.history.replaceState({}, document.title, '/');
    }
    console.log('useEffect ran, query params:', window.location.search);
  }, []);

  const handleLogin = (newToken) => {
    localStorage.setItem('jwt', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setToken('');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/dashboard" element={<Dashboard token={token} onLogout={handleLogout} />} />
        <Route
          path="/auth/google/callback"
          element={<Login onLogin={handleLogin} />}
        />
        <Route path="*" element={<div>404: Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;