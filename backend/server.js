// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import { connectDB } from './config/db.js';

// import authRoutes from './routes/auth.js';
// import leaveRoutes from './routes/leave.js';
// import attendanceRoutes from './routes/attendance.js';

// dotenv.config();

// const app = express();

// connectDB();

// app.use(cors());
// app.use(express.json());

// app.use('/api/auth', authRoutes);
// app.use('/api/leave', leaveRoutes);
// app.use('/api/attendance', attendanceRoutes);

// app.get('/health', (req, res) => {
//   res.status(200).json({ message: 'Server is running' });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.js";
import leaveRoutes from "./routes/leave.js";
import attendanceRoutes from "./routes/attendance.js";

dotenv.config();

const app = express();

/* -------------------- DATABASE -------------------- */
connectDB();

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());

// CORS configuration (safe for internship & deployment)
app.use(
  cors({
    origin: [
      "http://localhost:5173",          // local frontend
      "http://localhost:3000",          // CRA (if used)
      "https://hr-leave-management-system-pi.vercel.app" // replace after Vercel deploy
    ],
    credentials: true,
  })
);

/* -------------------- ROUTES -------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);

/* -------------------- ROOT ROUTE -------------------- */
app.get("/", (req, res) => {
  res.send("HR Management Backend is running 🚀");
});

/* -------------------- HEALTH CHECK -------------------- */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    uptime: process.uptime(),
  });
});

/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});