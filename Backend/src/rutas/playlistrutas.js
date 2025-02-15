import express from "express";
import playlistController from "../Controladores/playlistController";
const router = express.Router();

router.post("/Playlsit",playlistController.crear);

router.get("/Playlist",playlistController.listar);
router.get("/Playlist/:id",playlistController.ObtenerPorId);

router.put("/Playlsit/:id",playlistController.Actualizar);

router.delete("/Playlist/:id",playlistController.Eliminar)