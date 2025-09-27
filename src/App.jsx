import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('jwt') || '');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      localStorage.setItem('jwt', urlToken);
      setToken(urlToken);
      navigate('/dashboard', { replace: true });
    } else if (location.pathname === '/auth/google/callback') {
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