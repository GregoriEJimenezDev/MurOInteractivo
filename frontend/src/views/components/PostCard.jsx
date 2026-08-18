import React from 'react';
import { motion } from 'framer-motion';
import { User, ShieldAlert, MessageCircle, Heart, Bookmark } from 'lucide-react';

/**
 * Post Card Component (View).
 * SOLID Principle: SRP - Handles rendering details, timestamp localized formatting, 
 * and hardware-accelerated 3D spatial tilt transitions.
 */
export default function PostCard({ post, index = 0 }) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Evaluate if post has been published by the fallback mock System agent
  const isSystem = post.authorName === 'Sistema' || post.authorUid === 'admin';

  return (
    <motion.div
      whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2, zIndex: 10 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`post-card post-card-${index % 3}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Dynamic ambient highlight glow */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
      />
      
      {/* Card Header */}
      <div className="post-card-header">
        <h3>
          {post.title}
        </h3>
        <span className="post-time">
          {formattedDate}
        </span>
      </div>
      
      {/* Card Body */}
      <p className="post-content">
        {post.content}
      </p>
      
      {/* Card Footer */}
      <div className="post-footer">
        {isSystem ? (
          <div className="post-avatar system-avatar">
            <ShieldAlert size={15} />
          </div>
        ) : (
          <div className="post-avatar">
            <User size={15} />
          </div>
        )}
        <span className="post-author">
          Publicado por <strong className="text-white">{post.authorName}</strong>
        </span>
        <div className="post-actions"><Heart size={15} /><MessageCircle size={15} /><Bookmark size={15} /></div>
      </div>
    </motion.div>
  );
}
