import dotenv from 'dotenv';
import connectDB from './db/index.js';

// Load environment variables if not in production
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: './.env' });
}

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log('Connected to MongoDB successfully.');
    // No need to call app.listen here; the server is started in server.js
  })
  .catch((error) => {
    console.log('MongoDB connection error:', error);
    process.exit(1); // Exit the process if DB connection fails
  });

// Import server.js to start the app and socket server
import './server.js';
