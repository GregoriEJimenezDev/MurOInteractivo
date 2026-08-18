import { IPostRepository } from '../../domain/repositories/IPostRepository.js';
import PostModel from '../models/PostModel.js';
import { Post } from '../../domain/entities/Post.js';

/**
 * Concrete implementation of PostRepository using MongoDB & Mongoose.
 * SOLID Principle: LSP - Adheres strictly to the signature defined in IPostRepository.
 */
export class MongoPostRepository extends IPostRepository {
  async save(post) {
    const postDoc = new PostModel({
      title: post.title,
      content: post.content,
      authorUid: post.authorUid,
      authorName: post.authorName,
      createdAt: post.createdAt
    });
    const saved = await postDoc.save();
    return this._toEntity(saved);
  }

  async findAll() {
    const posts = await PostModel.find().sort({ createdAt: -1 });
    return posts.map(doc => this._toEntity(doc));
  }

  /**
   * Helper to map DB record into Domain Post Entity.
   */
  _toEntity(doc) {
    return new Post({
      id: doc._id.toString(),
      title: doc.title,
      content: doc.content,
      authorUid: doc.authorUid,
      authorName: doc.authorName,
      createdAt: doc.createdAt
    });
  }
}
