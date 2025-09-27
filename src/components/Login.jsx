import React, { useState } from 'react';

const Login = ({ onLogin, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignup, setIsSignup] = useState(false); // Toggle state
  const API_URL = import.meta.env.VITE_API_URL || 'https://calorie-tracker-backend-6nfn.onrender.com';


  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const url = `${API_URL}/login`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        onLogin(data.token);
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Email login error:', err);
      alert('Login error');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Name is required');
      return;
    }
    try {
      const url = `${API_URL}/register`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await response.json();
      if (response.ok) {
        onLogin(data.token); // Log in after successful signup
      } else {
        alert(data.error || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      alert('Signup error');
    }
  };

  const handleGoogleLogin = () => {
    const url = `${API_URL}/auth/google/login`;
    window.location.href = url;
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          {isSignup ? 'Sign Up' : 'Login'}
        </h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-600 cursor-pointer hover:text-blue-800 text-sm font-medium"
          >
            {isSignup ? 'Already have an account? Login' : 'New to login? Sign up'}
          </button>
        </div>
        <form onSubmit={isSignup ? handleSignup : handleEmailLogin} className="space-y-6">
          {isSignup && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
              autoComplete="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            autoComplete="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            autoComplete={isSignup ? "new-password" : "current-password"}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>
        <button
          onClick={handleGoogleLogin}
          className="w-full px-4 py-2 cursor-pointer bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;