import { IPostService } from '../../domain/services/IPostService.js';
import axios from 'axios';
import { Post } from '../../domain/entities/Post.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Concrete implementation of PostService connecting to the backend API.
 * SOLID Principle: SRP - Strictly handles loading and saving posts via REST endpoints.
 */
export class ApiPostService extends IPostService {
  async getPosts() {
    try {
      const response = await axios.get(`${API_URL}/posts`);
      // Parse array JSON response into Domain Post entities
      return response.data.map(
        (data) =>
          new Post({
            id: data.id || data._id,
            title: data.title,
            content: data.content,
            authorUid: data.authorUid,
            authorName: data.authorName,
            createdAt: data.createdAt
          })
      );
    } catch (error) {
      console.error('Error fetching posts in ApiPostService:', error.message);
      // Fallback: If backend server is down, we return a mock welcome message
      // so the UI has elements and doesn't look empty/broken
      return [
        new Post({
          id: 'offline-welcome',
          title: 'Bienvenido al Muro Interactivo (Servidor Offline)',
          content: 'Parece que el servidor Express no está corriendo actualmente. Inicia la base de datos MongoDB y ejecuta el backend con "npm run dev" en la carpeta backend para habilitar posts dinámicos.',
          authorUid: 'admin',
          authorName: 'Sistema',
          createdAt: new Date()
        })
      ];
    }
  }

  async createPost(title, content, token) {
    const response = await axios.post(
      `${API_URL}/posts`,
      { title, content },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const data = response.data.post;
    return new Post({
      id: data.id || data._id,
      title: data.title,
      content: data.content,
      authorUid: data.authorUid,
      authorName: data.authorName,
      createdAt: data.createdAt
    });
  }
}
