import React from 'react';
import { Bookmark, Heart, MessageCircle, ShieldCheck } from 'lucide-react';

const avatarFor = (post) => post.authorPhotoURL || `https://i.pravatar.cc/96?u=${encodeURIComponent(post.authorUid || post.authorName || 'muro')}`;

export default function PostCard({ post }) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  const isSystem = post.authorName === 'Sistema' || post.authorUid === 'admin';

  return (
    <article className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <img className="h-10 w-10 rounded-full object-cover shadow-md ring-2 ring-white" src={avatarFor(post)} alt={`Avatar de ${post.authorName}`} />
          <div className="min-w-0"><p className="truncate text-sm font-bold text-gray-900">{post.authorName}</p><p className="text-xs text-gray-500">{isSystem ? 'Cuenta oficial' : 'Miembro de la comunidad'} · {formattedDate}</p></div>
        </div>
        {isSystem && <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600"><ShieldCheck size={12} /> Oficial</span>}
      </div>
      <div className="mt-5"><h3 className="text-lg font-extrabold tracking-[-0.03em] text-gray-900">{post.title}</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">{post.content}</p></div>
      <div className="mt-5 flex items-center gap-5 border-t border-gray-100 pt-4 text-gray-400"><button className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors hover:text-rose-500" aria-label="Me gusta"><Heart size={16} /> <span>Me gusta</span></button><button className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors hover:text-blue-600" aria-label="Comentar"><MessageCircle size={16} /> <span>Comentar</span></button><button className="ml-auto transition-colors hover:text-gray-900" aria-label="Guardar"><Bookmark size={16} /></button></div>
    </article>
  );
}
