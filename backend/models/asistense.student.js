
// models/asistense.student.js
import mongoose from "mongoose";

const newAsistence = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  apellido: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  presente: {
    type: Boolean,
    required: true
  }
});

const newAsistenceModel = mongoose.model("asistencias", newAsistence);
export default newAsistenceModel;