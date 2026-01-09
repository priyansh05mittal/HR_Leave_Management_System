import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import authRoutes from './routes/auth.js';
import leaveRoutes from './routes/leave.js';
import attendanceRoutes from './routes/attendance.js';

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/attendance', attendanceRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
