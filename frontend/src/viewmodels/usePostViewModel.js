import { useState, useEffect, useCallback } from 'react';
import { postService } from '../config/services.js';

/**
 * Posts ViewModel.
 * Design Pattern: MVVM - React hook acting as ViewModel.
 * Encapsulates the reactive listing and submission logic, shielding the UI from API configurations.
 */
export function usePostViewModel() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await postService.getPosts();
      setPosts(data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve posts.');
    } finally {
      setLoading(false);
    }
  }, []);

  const publishPost = async (title, content, token) => {
    if (!token) {
      throw new Error('Authentication is required to create a post.');
    }
    setSubmitting(true);
    setError(null);
    try {
      const newPost = await postService.createPost(title, content, token);
      // Prepend newly created post for real-time responsiveness in UI
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      return newPost;
    } catch (err) {
      setError(err.message || 'Failed to publish post.');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-fetch posts on mounting of VM consumer components
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    submitting,
    error,
    fetchPosts,
    publishPost
  };
}
