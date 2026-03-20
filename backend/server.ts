import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import connectDB from './config/db';

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ message: 'API is running...' });
});

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import foodLogRoutes from './routes/foodLogs';
import activityLogRoutes from './routes/activityLogs';
import imageAnalysisRoutes from './routes/imageAnalysis';

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

const PORT = process.env.PORT || 1337;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
