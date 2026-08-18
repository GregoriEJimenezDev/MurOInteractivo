/**
 * User Frontend Entity.
 * Framework-agnostic definition of a User.
 * Combines Firebase Auth data (uid, email) with the Firestore profile data.
 */
export class User {
  constructor({ uid, username, name, lastname, email = null, avatarId = null, bio = '' }) {
    this.uid = uid;
    this.username = username;
    this.name = name;
    this.lastname = lastname;
    this.email = email;
    this.avatarId = avatarId;
    this.bio = bio;
  }

  get fullName() {
    return `${this.name} ${this.lastname}`.trim();
  }
}
