import express from "express";
import cantanteController from "../Controladores/Controladores/cantanteController.js";
const router =express.Router();

router.get("/Cantante",cantanteController.listarCantantes);
router.get("/Cantante/:id",cantanteController.obtenerCantante);

router.post("/Cantante/:id",cantanteController.actualizarCantante);

router.delete("/Cantante/:id",cantanteController.eliminarCantante);

export default router