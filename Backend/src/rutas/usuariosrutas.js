// routes/usuarioRoutes.js
import express from "express";
import * as usuariosController from "../Controladores/usuariosController.js"; // Importa las funciones del controlador
import sendVerificationEmailMiddleware from "../middlewares/enviarEmail.js";
import { upload, uploadCloudinary } from '../config/multer.js';

const router = express.Router();

router.post("/Registro", sendVerificationEmailMiddleware, usuariosController.Registro);

// Ruta para verificar el email con el token
router.get("/verificar/:token", usuariosController.verifyEmail);

router.post("/Login", usuariosController.login);

router.get("/Usuario/:id", usuariosController.obtenerUsuario);
router.get("/Usuario", usuariosController.obtenerUsuarios);

router.put("/Usuario/:id", usuariosController.actualizarUsuario);
router.put('/usuario/:id/avatar', upload.single('avatar'), usuariosController.updateProfilePhoto);

router.patch('/usuario/:id/rol', usuariosController.updateUserRole);

router.delete("/Usuario/:id", usuariosController.eliminarUsuario);

export default router;
