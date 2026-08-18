import React from 'react';
import { CircleHelp, LogOut, PenLine } from 'lucide-react';

const avatarFor = (user) => user?.photoURL || `https://i.pravatar.cc/96?u=${encodeURIComponent(user?.username || user?.name || 'muro-interactivo')}`;

export default function Navbar({ user, logout, currentPage, onNavigate }) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Navegación principal">
        <button className="group flex items-center gap-3" onClick={() => onNavigate('home')} aria-label="Ir al inicio">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gray-900 text-white shadow-lg shadow-gray-900/10 transition-transform duration-300 group-hover:-translate-y-0.5">
            <PenLine size={17} strokeWidth={2.4} />
          </span>
          <span className="text-left text-[15px] font-extrabold tracking-[-0.04em] text-gray-900">
            Muro <span className="font-medium text-gray-500">Interactivo</span>
          </span>
        </button>

        <div className="flex items-center gap-2 sm:gap-5">
          <button className={`hidden rounded-lg px-3 py-2 text-sm font-semibold transition-colors sm:block ${currentPage === 'home' ? 'text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`} onClick={() => onNavigate('home')}>
            Inicio
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-50" onClick={() => onNavigate('help')}><CircleHelp size={16} /><span className="hidden sm:inline">Ayuda</span></button>
          {user ? (
            <div className="flex items-center gap-3 border-l border-gray-200 pl-3 sm:pl-5">
              <img className="h-9 w-9 rounded-full object-cover ring-2 ring-white shadow-md" src={avatarFor(user)} alt={`Perfil de ${user.name || 'usuario'}`} />
              <span className="hidden text-sm font-semibold text-gray-700 md:block">{user.name} {user.lastname}</span>
              <button className="grid h-9 w-9 place-items-center rounded-lg text-gray-500 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 hover:text-gray-900 active:scale-95" onClick={logout} aria-label="Cerrar sesión" title="Cerrar sesión">
                <LogOut size={17} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <button className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900" onClick={() => onNavigate('login')}>Iniciar sesión</button>
              <button className="rounded-lg bg-blue-600 px-3.5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 active:scale-95" onClick={() => onNavigate('register')}>Registrarse</button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
