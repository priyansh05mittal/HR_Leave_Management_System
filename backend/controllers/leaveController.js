import Leave from '../models/Leave.js';
import User from '../models/User.js';

const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};

export const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({ message: 'Start date must be before end date' });
    }

    const totalDays = calculateDays(start, end);

    const user = await User.findById(req.userId);
    if (user.leaveBalance < totalDays) {
      return res.status(400).json({ message: 'Insufficient leave balance' });
    }

    const leave = await Leave.create({
      userId: req.userId,
      leaveType,
      startDate: start,
      endDate: end,
      totalDays,
      reason: reason || '',
      status: 'Pending'
    });

    res.status(201).json({
      message: 'Leave request submitted successfully',
      leave
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json({ leaves });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findById(id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leave.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this leave' });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'Can only edit pending leave requests' });
    }

    const { leaveType, startDate, endDate, reason } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({ message: 'Start date must be before end date' });
    }

    const totalDays = calculateDays(start, end);
    const user = await User.findById(req.userId);

    if (user.leaveBalance - (leave.totalDays - totalDays) < 0) {
      return res.status(400).json({ message: 'Insufficient leave balance' });
    }

    leave.leaveType = leaveType;
    leave.startDate = start;
    leave.endDate = end;
    leave.totalDays = totalDays;
    leave.reason = reason || '';

    await leave.save();
    res.status(200).json({ message: 'Leave request updated', leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findById(id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leave.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to cancel this leave' });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'Can only cancel pending leave requests' });
    }

    await Leave.findByIdAndDelete(id);
    res.status(200).json({ message: 'Leave request cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ leaves });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findById(id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending leaves can be approved' });
    }

    leave.status = 'Approved';
    await leave.save();

    const user = await User.findById(leave.userId);
    user.leaveBalance -= leave.totalDays;
    await user.save();

    res.status(200).json({ message: 'Leave approved', leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findById(id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending leaves can be rejected' });
    }

    leave.status = 'Rejected';
    await leave.save();

    res.status(200).json({ message: 'Leave rejected', leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
