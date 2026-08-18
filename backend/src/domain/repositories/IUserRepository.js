/**
 * User Repository Interface (Contract).
 * SOLID Principle: DIP - Dependency Inversion. Business logic/controllers depend on this interface, 
 * decoupling them from the database driver.
 */
export class IUserRepository {
  async save(user) {
    throw new Error('Method save() not implemented');
  }

  async findByUid(uid) {
    throw new Error('Method findByUid() not implemented');
  }

  async findByUsername(username) {
    throw new Error('Method findByUsername() not implemented');
  }
}
