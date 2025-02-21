import express from "express"
import cancionesController from "../Controladores/cancionesController.js";
import upload from "../config/multer.js";
import verificarRoles from "../middlewares/verificarRole.js"

const router = express.Router();


router.post("/canciones",verificarRoles(["cantante"]), upload.single("image"), cancionesController.Crear);

router.post("/canciones", upload.fields([
    { name: 'image', maxCount: 1 },  
    { name: 'song', maxCount: 1 }     
]), cancionesController.Crear);  
 
router.get("/canciones", cancionesController.ObtenerTodas);

router.get("/canciones/:id", cancionesController.ObtenerPorId);

router.put("/canciones/:id",verificarRoles(["cantante"]), cancionesController.Actualizar);

router.delete("/canciones/:id",verificarRoles(["cantante"]), cancionesController.Eliminar);
 
export default router;