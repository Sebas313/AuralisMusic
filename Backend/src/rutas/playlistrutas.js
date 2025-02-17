import express from "express";
import playlistController from "../Controladores/playlistController.js";
const router = express.Router();

router.post("/Playlist",playlistController.crear);

router.get("/Playlist",playlistController.listar);
router.get("/Playlist/:id",playlistController.ObtenerPorId);

router.put("/Playlist/:id",playlistController.Actualizar);

router.delete("/Playlist/:id",playlistController.Eliminar);
export default router