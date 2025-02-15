import express from "express";
import cantanteController from "../Controladores/cantanteController.js";
const router =express.Router();

router.post("/Cantante",cantanteController.crearCantante)
router.get("/Cantante",cantanteController.listarCantantes);
router.get("/Cantante/:id",cantanteController.obtenerCantante);

router.put("/Cantante/:id",cantanteController.actualizarCantante);

router.delete("/Cantante/:id",cantanteController.eliminarCantante);

export default router