/**
 * User Frontend Entity.
 * Framework-agnostic definition of a User.
 */
export class User {
  constructor({ uid, username, name, lastname }) {
    this.uid = uid;
    this.username = username;
    this.name = name;
    this.lastname = lastname;
  }

  get fullName() {
    return `${this.name} ${this.lastname}`;
  }
}
