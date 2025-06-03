import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

function AuthPages() {
  const [currentView, setCurrentView] = useState('login');

  if (currentView === 'register') {
    return <Register onSwitchToLogin={() => setCurrentView('login')} />;
  }

  return <Login onSwitchToRegister={() => setCurrentView('register')} />;
}

export default AuthPages;