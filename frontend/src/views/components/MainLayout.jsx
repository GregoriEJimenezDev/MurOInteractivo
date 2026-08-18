import React from 'react';
import Navbar from './Navbar.jsx';

export default function MainLayout({ children, user, logout, currentPage, onNavigate }) {
  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">
      <Navbar user={user} logout={logout} currentPage={currentPage} onNavigate={onNavigate} />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {children}
      </main>
    </div>
  );
}
