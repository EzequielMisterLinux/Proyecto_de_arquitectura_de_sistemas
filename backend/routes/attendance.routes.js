// routes/attendance.routes.js
import express from 'express';
import Attendance from '../models/attendance.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const attendance = new Attendance(req.body);
    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const attendances = await Attendance.find().populate('session');
    res.json(attendances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;