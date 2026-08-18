import mongoose from 'mongoose';

/**
 * Mongoose Schema representing the database schema for Posts.
 */
const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorUid: { type: String, required: true, index: true },
  authorName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const PostModel = mongoose.model('Post', PostSchema);
export default PostModel;
