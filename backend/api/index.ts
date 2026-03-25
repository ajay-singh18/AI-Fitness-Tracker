import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import authRoutes from '../routes/auth';
import userRoutes from '../routes/users';
import foodLogRoutes from '../routes/foodLogs';
import activityLogRoutes from '../routes/activityLogs';
import imageAnalysisRoutes from '../routes/imageAnalysis';
import connectDB from '../config/db';

console.log('[API] Starting initialization...');

const app = express();

// Apply basic middleware
app.use(cors({
  origin: ["https://alphafittrack.vercel.app", "http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure DB connection middleware before routes
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (error: any) {
    console.error('[API] Database connection failed:', error?.message || error);
    next(); // Continue even if DB fails, routes will handle their own errors or we show 500 later
  }
});

// Basic routes
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the AI Fitness Tracker API!');
});

// Health check - always works
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ message: 'API is running...' });
});

// Mount specialized routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/food-logs', foodLogRoutes);
app.use('/api/activity-logs', activityLogRoutes);
app.use('/api/image-analysis', imageAnalysisRoutes);

// Catch-all error handler at the end (MUST be after routes)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[API] Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: { message: err?.message || 'Internal Server Error' }
  });
});

// Global error handler for uncaught exceptions
process.on('unhandledRejection', (reason: any) => {
  console.error('[API] Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error: any) => {
  console.error('[API] Uncaught Exception:', error);
});

console.log('[API] Initialization complete');

export default app;
