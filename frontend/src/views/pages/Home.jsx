import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Compass, Plus, RefreshCcw, Sparkles, User } from 'lucide-react';
import { usePostViewModel } from '../../viewmodels/usePostViewModel.js';
import PostCard from '../components/PostCard.jsx';
import PostForm from '../components/PostForm.jsx';

export default function Home({ user, token, onNavigate }) {
  const { posts, loading, submitting, error, publishPost, fetchPosts } = usePostViewModel();

  return (
    <div className="home-shell">
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <div className="home-inner">
        <header className="hero-header">
          <div className="eyebrow"><Sparkles size={13} /> ESPACIO CREATIVO <span>● EN VIVO</span></div>
          <h1>Un muro para<br /><em>ideas extraordinarias.</em></h1>
          <p>Comparte lo que te inspira. Descubre lo que mueve a nuestra comunidad.</p>
          <div className="hero-actions">
            <button className="hero-primary" onClick={() => user ? document.getElementById('post-form')?.scrollIntoView({ behavior: 'smooth' }) : onNavigate('login')}>
              <Plus size={16} /> CREAR POST <ArrowUpRight size={15} />
            </button>
            <button className="hero-secondary"><Compass size={15} /> EXPLORAR EL MURO</button>
          </div>
        </header>

        <div className="feed-heading">
          <div><span className="section-kicker">COMUNIDAD</span><h2>Publicaciones recientes</h2></div>
          <button className="refresh-button" onClick={fetchPosts} disabled={loading}><RefreshCcw size={14} className={loading ? 'spin' : ''} /> Actualizar</button>
        </div>

        <div className="home-grid">
          <section className="posts-column">
            {loading && posts.length === 0 ? <div className="empty-state"><div className="spinner-loader" /><p>Conectando con el muro...</p></div> : posts.length === 0 ? (
              <div className="empty-state"><span className="empty-icon">✦</span><h3>El muro está esperando tu primera idea</h3><p>Inicia sesión y deja una huella en este espacio.</p></div>
            ) : (
              <motion.div className="post-list" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: .08 } } }}>
                <AnimatePresence mode="popLayout">{posts.map((post, index) => <motion.div key={post.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} layout><PostCard post={post} index={index} /></motion.div>)}</AnimatePresence>
              </motion.div>
            )}
          </section>
          <aside className="action-column" id="post-form">
            {user ? <PostForm onPublish={(title, content) => publishPost(title, content, token)} submitting={submitting} error={error} /> : (
              <div className="join-card"><div className="join-icon"><User size={22} /></div><span className="section-kicker">TU ESPACIO</span><h3>Tu voz merece<br /><em>ser escuchada.</em></h3><p>Únete a la conversación y comparte tu perspectiva con la comunidad.</p><button onClick={() => onNavigate('register')}>CREAR UNA CUENTA <ArrowUpRight size={15} /></button><small>¿Ya tienes cuenta? <span onClick={() => onNavigate('login')}>Inicia sesión</span></small></div>)}
          </aside>
        </div>
      </div>
    </div>
  );
}
