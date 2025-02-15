import express from "express"
import cancionesController from "../Controladores/cancionesController.js";
import upload from "../config/multer.js";

const router = express.Router();

router.post("/canciones", upload.single("image"), cancionesController.Crear);

router.post("/canciones",cancionesController.Crear);

router.get("/canciones", cancionesController.ObtenerTodas);

router.get("/canciones/:id", cancionesController.ObtenerPorId);

router.put("/canciones/:id", cancionesController.Actualizar);

router.delete("/canciones/:id", cancionesController.Eliminar);

export default router;




