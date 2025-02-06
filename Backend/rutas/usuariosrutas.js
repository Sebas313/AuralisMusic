
import express from "express"
import  usuariosController  from "../Controladores/usuariosController.js"
const router = express.Router();

router.post("/Registro",usuariosController.Registro)

router.post("/Login",usuariosController.login)
router.post("/Validacion", usuariosController.tokenValido)

export default router