/**
 * Post Frontend Entity.
 * Framework-agnostic definition of a Post.
 */
export class Post {
  constructor({ id, title, content, authorUid, authorName, createdAt }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.authorUid = authorUid;
    this.authorName = authorName;
    this.createdAt = new Date(createdAt);
  }
}
