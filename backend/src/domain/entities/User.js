/**
 * User Domain Entity.
 * Represents a core user inside the system. 
 * Framework agnostic.
 */
export class User {
  constructor({ id, uid, username, name, lastname, createdAt }) {
    this.id = id;
    this.uid = uid; // Firebase Authentication unique identifier
    this.username = username;
    this.name = name;
    this.lastname = lastname;
    this.createdAt = createdAt || new Date();
  }
}
