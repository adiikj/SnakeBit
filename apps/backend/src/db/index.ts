import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const connectDB = async (): Promise<void> => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {
      connectTimeoutMS: 30000, // 30 seconds to wait for the connection
      serverSelectionTimeoutMS: 30000, // 30 seconds to wait for server selection
    });
    console.log(`Connected to MongoDB: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process if connection fails
  }
};

export default connectDB;
