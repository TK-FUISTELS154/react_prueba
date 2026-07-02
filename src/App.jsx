import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Splash from './components/Splash';
import Workspace from './components/Workspace';

export default function App() {
  // Prevent React App from loading inside an iframe (recursive prevention)
  if (window.self !== window.top) {
    window.top.location.href = '/';
    return null;
  }

  const [view, setView] = useState('LOGIN'); // 'LOGIN' | 'SPLASH' | 'WORKSPACE'
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    // Check if session already exists
    const storedUsername = localStorage.getItem('usuarioNombre');
    const storedRole = localStorage.getItem('usuarioRol');

    if (storedUsername && storedRole) {
      setUsername(storedUsername);
      setRole(storedRole);
      setView('WORKSPACE');
    }
  }, []);

  const handleLoginSuccess = (user, userRole) => {
    setUsername(user);
    setRole(userRole);
    setView('SPLASH');
  };

  const handleSplashFinish = () => {
    setView('WORKSPACE');
  };

  const handleLogout = () => {
    setUsername('');
    setRole('');
    setView('LOGIN');
  };

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      {view === 'LOGIN' && <Login onLoginSuccess={handleLoginSuccess} />}
      {view === 'SPLASH' && <Splash username={username} role={role} onSplashFinish={handleSplashFinish} />}
      {view === 'WORKSPACE' && <Workspace username={username} role={role} onLogout={handleLogout} />}
    </div>
  );
}
