// routes/usuarioRoutes.js
import express from "express";
import usuariosController from "../Controladores/usuariosController.js";

import sendVerificationEmailMiddleware from "../middlewares/enviarEmail.js";


const router = express.Router();
router.post("/Registro", sendVerificationEmailMiddleware, usuariosController.Registro);
router.post("/Login", usuariosController.login);
router.get("/Usuario/:id", usuariosController.obtenerUsuario);
router.get("/Usuario", usuariosController.obtenerUsuarios);
router.put("/Usuario/:id", usuariosController.actualizarUsuario);
router.patch("/usuario/:id/rol", usuariosController.updateUserRole);
router.delete("/Usuario/:id", usuariosController.eliminarUsuario);


export default router;
