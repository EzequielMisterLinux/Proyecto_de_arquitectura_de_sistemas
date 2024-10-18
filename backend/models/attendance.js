// models/attendance.js
import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'AttendanceSession', required: true },
  student: { 
    name: { type: String, required: true },
    apellido: { type: String, required: true }
  },
  present: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Attendance', attendanceSchema);

