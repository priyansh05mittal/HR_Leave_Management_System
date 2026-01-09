import express from 'express';
import {
  markAttendance,
  getMyAttendance,
  getAllAttendance
} from '../controllers/attendanceController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/mark', authMiddleware, markAttendance);
router.get('/my-attendance', authMiddleware, getMyAttendance);
router.get('/all', authMiddleware, adminMiddleware, getAllAttendance);

export default router;
