import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, RefreshCcw, UserRound } from 'lucide-react';
import { usePostViewModel } from '../../viewmodels/usePostViewModel.js';
import PostCard from '../components/PostCard.jsx';
import CreatePost from '../components/CreatePost.jsx';

export default function Home({ user, token, onNavigate }) {
  const { posts, loading, submitting, error, publishPost, fetchPosts } = usePostViewModel();

  return (
    <div className="space-y-8">
      <header className="rounded-2xl border border-gray-100 bg-white px-6 py-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:px-10 lg:py-14">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">La comunidad comparte</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-[-0.06em] text-gray-900 sm:text-5xl">Ideas que merecen<br /><span className="text-gray-500">un lugar para crecer.</span></h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-gray-600">Un espacio sencillo para compartir perspectivas, descubrir nuevas conversaciones y mantenerte cerca de lo que importa.</p>
          <button onClick={() => user ? document.getElementById('post-form')?.scrollIntoView({ behavior: 'smooth' }) : onNavigate('login')} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 active:scale-95">Crear una publicación <ArrowUpRight size={16} /></button>
        </div>
      </header>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section>
          <div className="mb-4 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">Comunidad</p><h2 className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-gray-900">Publicaciones recientes</h2></div><button onClick={fetchPosts} disabled={loading} className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-white hover:text-gray-900"><RefreshCcw size={15} className={loading ? 'animate-spin' : ''} /> <span className="hidden sm:inline">Actualizar</span></button></div>
          {loading && posts.length === 0 ? <div className="grid min-h-64 place-items-center rounded-2xl border border-gray-100 bg-white text-sm text-gray-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">Cargando publicaciones...</div> : posts.length === 0 ? <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center"><UserRound className="text-gray-300" /><div><h3 className="mt-3 font-bold text-gray-900">El muro está esperando tu primera idea</h3><p className="mt-1 text-sm text-gray-500">Inicia sesión y deja una huella en este espacio.</p></div></div> : <motion.div className="space-y-4" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: .08 } } }}><AnimatePresence mode="popLayout">{posts.map((post) => <motion.div key={post.id} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }} layout><PostCard post={post} /></motion.div>)}</AnimatePresence></motion.div>}
        </section>
        <aside id="post-form" className="lg:sticky lg:top-24">{user ? <CreatePost user={user} onPublish={(title, content) => publishPost(title, content, token)} submitting={submitting} error={error} /> : <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Tu espacio</p><h2 className="mt-3 text-2xl font-extrabold tracking-[-0.05em] text-gray-900">Tu voz también cuenta.</h2><p className="mt-3 text-sm leading-6 text-gray-600">Crea una cuenta para publicar tus ideas y participar en las conversaciones del muro.</p><button onClick={() => onNavigate('register')} className="mt-6 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-gray-900/10 transition-all duration-300 hover:-translate-y-1 hover:bg-gray-800 active:scale-95">Crear una cuenta</button><p className="mt-4 text-center text-xs text-gray-500">¿Ya tienes cuenta? <button onClick={() => onNavigate('login')} className="font-bold text-blue-600 hover:underline">Inicia sesión</button></p></div>}</aside>
      </div>
    </div>
  );
}
