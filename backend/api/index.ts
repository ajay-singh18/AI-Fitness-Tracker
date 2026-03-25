import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import connectDB from '../config/db';

const app = express();

// Middleware
app.use(cors({
  origin: "https://alphafittrack.vercel.app",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ message: 'API is running...' });
});

import authRoutes from '../routes/auth';
import userRoutes from '../routes/users';
import foodLogRoutes from '../routes/foodLogs';
import activityLogRoutes from '../routes/activityLogs';
import imageAnalysisRoutes from '../routes/imageAnalysis';

// Initialize database connection on first request
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (error: any) {
    console.error('Database connection failed:', error.message);
    res.status(503).json({
      success: false,
      error: { message: 'Database connection failed. Please try again later.' }
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/food-logs', foodLogRoutes);
app.use('/api/activity-logs', activityLogRoutes);
app.use('/api/image-analysis', imageAnalysisRoutes);

// Error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: { message: err.message || 'Server Error' }
  });
});

export default app;
