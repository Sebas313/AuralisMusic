import express from "express"
import cancionesController from "../Controladores/cancionesController.js";

const router = express.Router();

router.post("/canciones",cancionesController.Crear);

router.get("/canciones", cancionesController.ObtenerTodas);

router.get("/canciones/:id", cancionesController.ObtenerPorId);

router.put("/canciones/:id", cancionesController.Actualizar);

router.delete("/canciones/:id", cancionesController.Eliminar);

export default router;




