import React, { useState } from 'react';
import { useAuthViewModel } from '../viewmodels/useAuthViewModel.js';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import ProfileSettings from './pages/ProfileSettings.jsx';

/**
 * Main App Component (View).
 * SOLID Principle: SRP - Central coordinator for the application shell layout, 
 * page rendering based on routing state, and binding to authentication VM.
 */
export default function App() {
  const { user, loading, logout, updateLocalUser } = useAuthViewModel();
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState({});

  const navigate = (page, params = {}) => {
    setCurrentPage(page);
    setPageParams(params);
  };

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
        return <Home user={user} onNavigate={navigate} />;
      case 'login':
        return <Login onNavigate={navigate} />;
      case 'register':
        return <Register onNavigate={navigate} />;
      case 'verify-email':
        return <VerifyEmail email={pageParams.email} onNavigate={navigate} />;
      case 'profile':
        return (
          <ProfileSettings
            user={user}
            onNavigate={navigate}
            onUserUpdated={updateLocalUser}
          />
        );
      default:
        return <Home user={user} onNavigate={navigate} />;
    }
  };

  return (
    <div className="app-container">
      <Navbar 
        user={user} 
        logout={logout} 
        currentPage={currentPage} 
        onNavigate={navigate}
      />
      
      <main className="main-layout">
        {renderPage()}
      </main>

      <footer className="main-footer">
        <div className="container text-center">
          <p>© 2026 Muro Interactivo. Construido con Clean Architecture, SOLID y React Hooks.</p>
        </div>
      </footer>
    </div>
  );
}
