
import express from "express"
import * as usuariosController from "../Controladores/usuariosController.js";
import enviarEmail from "../emails/enviarEmail.js";
import sendVerificationEmailMiddleware from "../emails/enviarEmail.js";
import upload from '../config/multer.js'; 
const router = express.Router();

router.post("/Registro",sendVerificationEmailMiddleware,usuariosController.Registro,(req,res) => {
    res.status(200).json({message:"correo enviado"})
})

router.post("/Login",usuariosController.login)
router.post("/Validacion", usuariosController.tokenValido)

router.get("/Usuario/:id",usuariosController.obtenerUsuario)
router.get("/Usuario",usuariosController.obtenerUsuarios)

router.put("/Usuario/:id",usuariosController.actualizarUsuario)
router.put('/usuario/:id/avatar', upload.single('avatar'), usuariosController.updateProfilePhoto);
router.delete("/Usuario/:id",usuariosController.eliminarUsuario)
export default router