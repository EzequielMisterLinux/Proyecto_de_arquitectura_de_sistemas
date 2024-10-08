import express from "express"
import createNewAsistence from "../controllers/asistence.controller.js"

let RoutesAsistence = express.Router()


RoutesAsistence.post("/asistences", createNewAsistence)

export default RoutesAsistence