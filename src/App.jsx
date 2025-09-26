import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('jwt') || '');
  const navigate = useNavigate();
  const location = useLocation();

  console.log('App VITE_API_URL:', import.meta.env.VITE_API_URL);
  console.log('App loaded, current path:', location.pathname);
  console.log('Query params:', location.search);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      console.log('Received token from URL:', urlToken);
      localStorage.setItem('jwt', urlToken);
      setToken(urlToken);
      navigate('/dashboard', { replace: true });
    } else if (location.pathname === '/auth/google/callback') {
      console.log('No token in /auth/google/callback, query:', location.search);
      navigate('/', { replace: true, state: { error: 'Google login failed. Please try again.' } });
    }
  }, [location, navigate]);

  const handleLogin = (newToken) => {
    localStorage.setItem('jwt', newToken);
    setToken(newToken);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setToken('');
    navigate('/');
  };

  return (
    <Routes>
      <Route path="/" element={<Login onLogin={handleLogin} error={location.state?.error} />} />
      <Route path="/dashboard" element={<Dashboard token={token} onLogout={handleLogout} />} />
      <Route path="/auth/google/callback" element={<Login onLogin={handleLogin} error={location.state?.error} />} />
      <Route path="*" element={<div>404: Page Not Found</div>} />
    </Routes>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;