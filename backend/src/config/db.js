import mongoose from 'mongoose';

/**
 * Singleton class to manage MongoDB connection using Mongoose.
 * SOLID Principle: SRP - Single Responsibility to manage and pool database connections.
 * Design Pattern: Singleton - Ensures only a single active connection manager exists.
 */
class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    
    this.connection = null;
    Database.instance = this;
    // Freeze object to prevent extensions/modifications to the Singleton instance
    Object.freeze(this);
  }

  async connect() {
    if (this.connection) {
      return this.connection;
    }

    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/murointeractivo';
    
    try {
      this.connection = await mongoose.connect(mongoUri);
      console.log('Successfully connected to MongoDB.');
      return this.connection;
    } catch (error) {
      console.error('MongoDB connection error:', error.message);
      throw error;
    }
  }

  async disconnect() {
    if (!this.connection) return;
    try {
      await mongoose.disconnect();
      this.connection = null;
      console.log('Disconnected from MongoDB.');
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error.message);
    }
  }
}

const dbInstance = new Database();
export default dbInstance;
