import express from 'express';
import {
  applyLeave,
  getMyLeaves,
  updateLeave,
  cancelLeave,
  getAllLeaves,
  approveLeave,
  rejectLeave
} from '../controllers/leaveController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/apply', authMiddleware, applyLeave);
router.get('/my-leaves', authMiddleware, getMyLeaves);
router.put('/:id', authMiddleware, updateLeave);
router.delete('/:id', authMiddleware, cancelLeave);

router.get('/all', authMiddleware, adminMiddleware, getAllLeaves);
router.put('/:id/approve', authMiddleware, adminMiddleware, approveLeave);
router.put('/:id/reject', authMiddleware, adminMiddleware, rejectLeave);

export default router;
