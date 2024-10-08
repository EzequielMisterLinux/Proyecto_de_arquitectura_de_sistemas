
// controllers/asistence.controller.js
import newAsistenceModel from "../models/asistense.student.js";
import { io } from "../index.js";

const createNewAsistence = async (req, res) => {
  const { name, apellido, fecha, presente } = req.body;
  try {
    let response = new newAsistenceModel({ name, apellido, fecha, presente });
    await response.save();
    io.emit('new_attendance', response);
    res.status(201).json({ msg: "Asistencia agregada exitosamente", response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al agregar la asistencia" });
  }
};

export default createNewAsistence;
