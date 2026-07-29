import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import playerRouter from './routes/player.routes.js';

const app = express();

// CORS setup
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Allow only the frontend origin
  credentials: true, // Allow credentials (cookies, authentication headers, etc.)
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());
app.options('*', cors(corsOptions)); // Enable preflight response for all routes

// Routes declaration
app.use('/api/v1/players', playerRouter);

export { app };
