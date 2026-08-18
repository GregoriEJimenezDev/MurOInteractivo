/**
 * Interface contract for Post Service on the frontend.
 * SOLID Principle: DIP - ViewModels depend on this interface rather than direct API calls.
 */
export class IPostService {
  async getPosts() {
    throw new Error('Method getPosts() not implemented');
  }

  async createPost(title, content, token) {
    throw new Error('Method createPost() not implemented');
  }
}
