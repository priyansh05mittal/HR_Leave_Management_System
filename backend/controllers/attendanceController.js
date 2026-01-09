import Attendance from '../models/Attendance.js';

export const markAttendance = async (req, res) => {
  try {
    const { date, status } = req.body;

    if (!date || !status) {
      return res.status(400).json({ message: 'Please provide date and status' });
    }

    const attendanceDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (attendanceDate > today) {
      return res.status(400).json({ message: 'Cannot mark attendance for future dates' });
    }

    const startOfDay = new Date(attendanceDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(attendanceDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAttendance = await Attendance.findOne({
      userId: req.userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for this date' });
    }

    const attendance = await Attendance.create({
      userId: req.userId,
      date: attendanceDate,
      status
    });

    res.status(201).json({
      message: 'Attendance marked successfully',
      attendance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ userId: req.userId }).sort({ date: -1 });
    res.status(200).json({ attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllAttendance = async (req, res) => {
  try {
    const { userId, date } = req.query;
    let filter = {};

    if (userId) {
      filter.userId = userId;
    }

    if (date) {
      const searchDate = new Date(date);
      const startOfDay = new Date(searchDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(searchDate);
      endOfDay.setHours(23, 59, 59, 999);

      filter.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const attendance = await Attendance.find(filter)
      .populate('userId', 'name email')
      .sort({ date: -1 });

    res.status(200).json({ attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
