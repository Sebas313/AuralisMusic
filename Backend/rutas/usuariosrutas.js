
import express from "express"
import  usuariosController  from "../Controladores/usuariosController.js"
const router = express.Router();

router.post("/Registro",usuariosController.Registro)

export default usuariosrutas