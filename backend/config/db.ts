import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async (): Promise<void> => {
  // Avoid reconnecting if already connected (important for Vercel cold starts)
  if (isConnected) {
    console.log('Database already connected');
    return;
  }

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not defined");
    const conn = await mongoose.connect(uri);
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Database connection error: ${error.message}`);
    // Don't exit - let the request handler deal with the error
    isConnected = false;
    throw error; // Re-throw to be caught by the API handler
  }
};

export default connectDB;
