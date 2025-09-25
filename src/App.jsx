import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('jwt') || '');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      console.log('Received token from URL:', urlToken);
      localStorage.setItem('jwt', urlToken);
      setToken(urlToken);
      // Clean URL without reloading
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [token]); // Add token dependency to re-check on changes

  const handleLogin = (newToken) => {
    localStorage.setItem('jwt', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setToken('');
  };

  if (token) {
    console.log('Rendering Dashboard with token:', token.substring(0, 20) + '...');
    return <Dashboard token={token} onLogout={handleLogout} />;
  } else {
    console.log('Rendering Login');
    return <Login onLogin={handleLogin} />;
  }
}

export default App;