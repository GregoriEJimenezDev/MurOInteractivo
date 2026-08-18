import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Post Form Component (View).
 * SOLID Principle: SRP - Strictly handles UI interaction for inputting a new post.
 * Design Aesthetics: Glassmorphism and hardware-accelerated button glow on hover.
 */
export default function PostForm({ onPublish, submitting, error }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!title.trim() || !content.trim()) {
      setLocalError('Por favor, completa tanto el título como el contenido.');
      return;
    }

    try {
      await onPublish(title, content);
      // Reset form fields
      setTitle('');
      setContent('');
    } catch (err) {
      // Errors handled by parent component / VM
    }
  };

  return (
    <form className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 flex flex-col gap-5" onSubmit={handleSubmit}>
      <h3 className="text-xl font-bold text-slate-100 border-b border-white/10 pb-3">Nueva Publicación</h3>
      
      {(localError || error) && (
        <div className="p-3 rounded-lg text-xs font-semibold flex items-center gap-2 bg-red-500/10 text-red-300 border border-red-500/20">
          <span>⚠️</span> {localError || error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="post-title" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Título
        </label>
        <input
          type="text"
          id="post-title"
          className="w-full bg-black/30 border border-white/10 rounded-lg text-sm text-slate-100 p-3 outline-none focus:border-indigo-500 focus:shadow-[0_0_10px_rgba(99,102,241,0.2)] transition-all disabled:opacity-50"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Dale un título llamativo..."
          disabled={submitting}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="post-content" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Contenido
        </label>
        <textarea
          id="post-content"
          className="w-full bg-black/30 border border-white/10 rounded-lg text-sm text-slate-100 p-3 outline-none focus:border-indigo-500 focus:shadow-[0_0_10px_rgba(99,102,241,0.2)] transition-all disabled:opacity-50"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe tu mensaje para el muro..."
          rows="4"
          disabled={submitting}
        />
      </div>

      <motion.button 
        type="submit" 
        whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-md transition-all cursor-pointer"
        disabled={submitting}
      >
        {submitting ? 'Publicando...' : 'Publicar en el Muro'}
      </motion.button>
    </form>
  );
}
