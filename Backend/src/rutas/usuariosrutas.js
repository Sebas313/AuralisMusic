
import express from "express"
import  usuariosController  from "../Controladores/usuariosController.js"
const router = express.Router();

router.post("/Registro",usuariosController.Registro)

router.post("/Login",usuariosController.login)
router.post("/Validacion", usuariosController.tokenValido)

router.get("/Usuario/:id",usuariosController.obtenerUsuario)
router.get("/Usuario",usuariosController.obtenerUsuarios)

router.put("/Usuario/:id",usuariosController.actualizarUsuario)

router.delete("/Usuario/:id",usuariosController.eliminarUsuario)
export default router