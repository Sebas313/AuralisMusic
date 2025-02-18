
import express from "express"
import * as usuariosController from "../Controladores/usuariosController.js";
import tokenValido  from "../middlewares/autenticacion.js";
import sendVerificationEmailMiddleware from "../middlewares/enviarEmail.js";
import upload from '../config/multer.js'; 
const router = express.Router();

router.post("/Registro",sendVerificationEmailMiddleware,usuariosController.Registro,(req,res) => {
    res.status(200).json({message:"correo enviado"})
})

router.post("/Login",usuariosController.login)

router.get("/Usuario/:id",usuariosController.obtenerUsuario)
router.get("/Usuario",usuariosController.obtenerUsuarios)
router.patch('/usuario/:id/rol', usuariosController.updateUserRole);
router.put("/Usuario/:id",usuariosController.actualizarUsuario)
router.put('/usuario/:id/avatar', upload.single('avatar'), usuariosController.updateProfilePhoto);
router.delete("/Usuario/:id",usuariosController.eliminarUsuario)
export default router