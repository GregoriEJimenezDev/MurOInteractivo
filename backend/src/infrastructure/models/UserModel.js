import mongoose from 'mongoose';

/**
 * Mongoose Schema representing the database schema for Users.
 * Encapsulated in the infrastructure layer to keep it away from pure business logic.
 */
const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const UserModel = mongoose.model('User', UserSchema);
export default UserModel;
