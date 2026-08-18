import React from 'react';
import { Bell, LogOut, Sparkles, User as UserIcon } from 'lucide-react';
import { getAvatarSrc } from '../../config/avatars.js';

/**
 * Navbar Component (View).
 * SOLID Principle: SRP - Strictly handles rendering the header navigation elements.
 */
export default function Navbar({ user, logout, currentPage, onNavigate }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo" onClick={() => onNavigate('home')}>
          <span className="logo-icon"><Sparkles size={17} /></span>
          <span className="logo-text">Muro <span className="gradient-text">Interactivo</span></span>
        </div>
        <div className="nav-links">
          <button 
            className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`} 
            onClick={() => onNavigate('home')}
          >
            Inicio
          </button>
          
          {user ? (
            <div className="user-menu">
              <span className="user-badge">
                <span className="badge-avatar" style={{ overflow: 'hidden' }}>
                  {getAvatarSrc(user.avatarId)
                    ? <img src={getAvatarSrc(user.avatarId)} alt="" className="h-full w-full object-cover" />
                    : (user.name || 'U').charAt(0).toUpperCase()}
                </span>
                <span>{user.name} {user.lastname}</span>
              </span>
              <button
                className={`nav-btn ${currentPage === 'profile' ? 'active' : ''}`}
                onClick={() => onNavigate('profile')}
                title="Editar perfil"
                aria-label="Editar perfil"
              >
                <UserIcon size={15} />
              </button>
              <Bell size={16} color="#8c93a9" />
              <button className="nav-btn logout-btn" onClick={logout}>
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button 
                className={`nav-btn ${currentPage === 'login' ? 'active' : ''}`}
                onClick={() => onNavigate('login')}
              >
                Iniciar Sesión
              </button>
              <button 
                className="nav-btn register-btn" 
                onClick={() => onNavigate('register')}
              >
                Registrarse
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
