import { Post } from '../../domain/entities/Post.js';

/**
 * Controller to handle publication-related requests.
 * SOLID Principle: SRP - Manages reading and writing posts.
 * SOLID Principle: DIP - Depends on IPostRepository and IUserRepository abstractions.
 */
export class PostController {
  constructor(postRepository, userRepository) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
  }

  getPosts = async (req, res) => {
    try {
      const posts = await this.postRepository.findAll();
      return res.status(200).json(posts);
    } catch (error) {
      console.error('Error retrieving posts:', error.message);
      return res.status(500).json({ error: 'Failed to load posts.' });
    }
  };

  createPost = async (req, res) => {
    const { title, content } = req.body;
    const authorUid = req.user.uid; // Hydrated by verifyFirebaseToken middleware

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required fields.' });
    }

    try {
      // Resolve user's actual display name from MongoDB database
      const user = await this.userRepository.findByUid(authorUid);
      const authorName = user ? `${user.name} ${user.lastname}` : 'Authenticated User';

      const newPost = new Post({
        title,
        content,
        authorUid,
        authorName
      });

      const savedPost = await this.postRepository.save(newPost);

      return res.status(201).json({
        message: 'Post successfully published.',
        post: savedPost
      });
    } catch (error) {
      console.error('Error creating post:', error.message);
      return res.status(500).json({ error: error.message || 'Failed to publish post.' });
    }
  };
}
