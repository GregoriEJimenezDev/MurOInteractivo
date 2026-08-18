import React, { useState } from 'react';
import { ImagePlus, LoaderCircle, Send } from 'lucide-react';

const avatarFor = (user) => user?.photoURL || `https://i.pravatar.cc/96?u=${encodeURIComponent(user?.username || user?.name || 'muro-interactivo')}`;

export default function CreatePost({ user, onPublish, submitting, error }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError('');
    if (!title.trim() || !content.trim()) {
      setLocalError('Completa el título y el contenido para publicar.');
      return;
    }
    try {
      await onPublish(title, content);
      setTitle('');
      setContent('');
    } catch {
      // The ViewModel owns the request error shown in this card.
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Comparte algo nuevo</p>
          <h2 className="mt-1 text-lg font-extrabold tracking-[-0.03em] text-gray-900">Crear publicación</h2>
        </div>
        <ImagePlus className="text-gray-300" size={20} />
      </div>
      <div className="flex items-start gap-3">
        <img className="h-10 w-10 shrink-0 rounded-full object-cover shadow-md ring-2 ring-white" src={avatarFor(user)} alt="Tu perfil" />
        <div className="min-w-0 flex-1">
          <input id="post-title" value={title} onChange={(event) => setTitle(event.target.value)} disabled={submitting} placeholder="Título de tu publicación" className="mb-2 w-full border-0 border-b border-gray-100 px-0 py-2 text-sm font-bold text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-0 disabled:opacity-60" />
          <textarea id="post-content" value={content} onChange={(event) => setContent(event.target.value)} disabled={submitting} placeholder="¿Qué quieres compartir hoy?" rows="4" className="w-full resize-none rounded-xl border border-transparent bg-gray-50 px-3 py-3 text-sm leading-6 text-gray-700 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-50 disabled:opacity-60" />
        </div>
      </div>
      {(localError || error) && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">{localError || error}</p>}
      <div className="mt-4 flex items-center justify-end border-t border-gray-100 pt-4">
        <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60">
          {submitting ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={15} />}
          {submitting ? 'Publicando...' : 'Publicar'}
        </button>
      </div>
    </form>
  );
}
