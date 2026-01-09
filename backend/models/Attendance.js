import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
