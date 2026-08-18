import { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import UserModel from '../models/UserModel.js';
import { User } from '../../domain/entities/User.js';

/**
 * Concrete implementation of UserRepository using MongoDB & Mongoose.
 * SOLID Principle: LSP - Can be substituted in place of IUserRepository.
 */
export class MongoUserRepository extends IUserRepository {
  async save(user) {
    const userDoc = new UserModel({
      uid: user.uid,
      username: user.username,
      name: user.name,
      lastname: user.lastname,
      createdAt: user.createdAt
    });
    const saved = await userDoc.save();
    return this._toEntity(saved);
  }

  async findByUid(uid) {
    const userDoc = await UserModel.findOne({ uid });
    if (!userDoc) return null;
    return this._toEntity(userDoc);
  }

  async findByUsername(username) {
    const userDoc = await UserModel.findOne({ username });
    if (!userDoc) return null;
    return this._toEntity(userDoc);
  }

  /**
   * Private mapper method.
   * Maps a DB document to a domain entity to maintain database independence.
   */
  _toEntity(doc) {
    return new User({
      id: doc._id.toString(),
      uid: doc.uid,
      username: doc.username,
      name: doc.name,
      lastname: doc.lastname,
      createdAt: doc.createdAt
    });
  }
}
