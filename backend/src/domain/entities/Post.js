/**
 * Post Domain Entity.
 * Represents a publication made on the wall.
 * Framework agnostic.
 */
export class Post {
  constructor({ id, title, content, authorUid, authorName, createdAt }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.authorUid = authorUid; // ID of the publishing user (Firebase UID)
    this.authorName = authorName; // Flattened name for performance
    this.createdAt = createdAt || new Date();
  }
}
