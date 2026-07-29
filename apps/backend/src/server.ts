import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv'; // Import dotenv to load environment variables
import { app } from './app.js'; // Import the existing app

// Load environment variables from .env file
dotenv.config(); // This loads variables from .env into process.env

// Create HTTP server
const server = http.createServer(app);

// Set up Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Allow the frontend origin
    methods: ['GET', 'POST'],
    credentials: true, // Allow credentials
  },
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join-room', (roomCode: string) => {
    socket.join(roomCode);
    console.log(`User ${socket.id} joined room: ${roomCode}`);

    // Notify others in the room
    socket.to(roomCode).emit('room-joined', `A new user has joined room: ${roomCode}`);

    // Notify the joining user
    socket.emit('room-joined', `Welcome to room: ${roomCode}`);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Use environment variable for the port (from .env or default)
const PORT = process.env.PORT ?? 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
