// models/attendance.js
import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'AttendanceSession', required: true },
  student: { type: String, required: true }, // Changed to String for simplicity
  present: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Attendance', attendanceSchema);