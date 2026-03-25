import mongoose from 'mongoose';

let isConnected = false;
let connectionPromise: Promise<void> | null = null;

const connectDB = async (): Promise<void> => {
  // If already connected, return immediately
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('Using existing database connection');
    return;
  }

  // If connection is in progress, wait for it
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    try {
      const uri = process.env.MONGODB_URI;
      if (!uri) {
        throw new Error('MONGODB_URI environment variable is not set');
      }

      console.log('Connecting to MongoDB...');
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      isConnected = true;
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error: any) {
      console.error(`Database connection error: ${error.message}`);
      isConnected = false;
      connectionPromise = null; // Reset promise on failure so next call retries
      throw error;
    }
  })();

  return connectionPromise;
};

export default connectDB;
