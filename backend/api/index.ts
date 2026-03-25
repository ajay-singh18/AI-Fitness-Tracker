import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

console.log('[API] Starting initialization...');

const app = express();

// Apply basic middleware
app.use(cors({
  origin: ["https://alphafittrack.vercel.app", "http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check - always works
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ message: 'API is running...' });
});

// Catch-all error handler at the end
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

// Ensure DB connection middleware
const connectDB = async () => {
  try {
    const dbModule = require('../config/db').default;
    await dbModule();
  } catch (error: any) {
    console.error('[API] Database connection failed:', error?.message || error);
  }
};

app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('[API] Middleware error:', error);
    next();
  }
});

// Initialize routes - wrap in try-catch
try {
  console.log('[API] Loading routes...');
  const authRoutes = require('../routes/auth').default;
  const userRoutes = require('../routes/users').default;
  const foodLogRoutes = require('../routes/foodLogs').default;
  const activityLogRoutes = require('../routes/activityLogs').default;
  const imageAnalysisRoutes = require('../routes/imageAnalysis').default;

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/food-logs', foodLogRoutes);
  app.use('/api/activity-logs', activityLogRoutes);
  app.use('/api/image-analysis', imageAnalysisRoutes);
  
  console.log('[API] Routes loaded successfully');
} catch (error: any) {
  console.error('[API] Error loading routes:', error?.message || error);
}

console.log('[API] Initialization complete');

export default app;
