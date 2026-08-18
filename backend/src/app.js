import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dbInstance from './config/db.js';
import authRoutes from './interfaces/routes/authRoutes.js';
import postRoutes from './interfaces/routes/postRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing middlewares
app.use(cors());
app.use(express.json());

// Initialize Database Connection via Singleton
dbInstance.connect().catch((error) => {
  console.error('Fatal: Database connection failed during application bootstrap:', error);
  process.exit(1);
});

// Register Domain Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Basic Service Verification Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date(), 
    message: 'Muro Interactivo Server is up and running.' 
  });
});

// Catch-all route handler for unmatched endpoints
app.use((req, res, next) => {
  res.status(404).json({ error: `Route not found: ${req.originalUrl}` });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('Global Express Error handler caught:', err);
  res.status(500).json({ error: 'An unexpected internal server error occurred.' });
});

app.listen(PORT, () => {
  console.log(`Muro Interactivo REST API listening on: http://localhost:${PORT}`);
});

export default app;
