// index.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config as configDotenv } from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import RoutesAsistence from './routes/asistence.routes.js';
import attendanceSessionRoutes from './routes/attendanceSession.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';

configDotenv();

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }
});

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json());
app.use(cookieParser());


mongoose.connect(process.env.MONGO)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', RoutesAsistence);
app.use('/api/attendance-sessions', attendanceSessionRoutes);
app.use('/api/attendances', attendanceRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});