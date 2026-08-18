/**
 * Post Repository Interface (Contract).
 * SOLID Principle: DIP - Decouples database models from business logic.
 */
export class IPostRepository {
  async save(post) {
    throw new Error('Method save() not implemented');
  }

  async findAll() {
    throw new Error('Method findAll() not implemented');
  }
}
