import React, { useState } from 'react';
import { useAuthViewModel } from '../viewmodels/useAuthViewModel.js';
import MainLayout from './components/MainLayout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Help from './pages/Help.jsx';

/**
 * Main App Component (View).
 * SOLID Principle: SRP - Central coordinator for the application shell layout, 
 * page rendering based on routing state, and binding to authentication VM.
 */
export default function App() {
  const { user, token, loading, logout, login, register } = useAuthViewModel();
  const [currentPage, setCurrentPage] = useState('home');

  if (loading) {
    return (
      <div className="app-loading-screen">
        <div className="spinner-loader"></div>
        <p className="loading-text">Sincronizando sesión de usuario...</p>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home user={user} token={token} onNavigate={setCurrentPage} />;
      case 'login':
        return <Login login={login} onNavigate={setCurrentPage} />;
      case 'register':
        return <Register register={register} onNavigate={setCurrentPage} />;
      case 'help':
        return <Help onNavigate={setCurrentPage} />;
      default:
        return <Home user={user} token={token} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <MainLayout
        user={user} 
        logout={logout} 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
      >
        {renderPage()}
    </MainLayout>
  );
}
