import express from "express";
import cancionesController from "../Controladores/cancionesController.js";
import { upload, uploadCloudinary } from "../config/multer.js"; // ✅ Importación correcta

import verificarRoles from "../middlewares/verificarRole.js";

const router = express.Router();

// 🎵 Crear canción con imagen y archivo de audio
router.post(
  "/canciones",
  upload.fields([ // ✅ Aquí ya no debería haber error
    { name: "imageCover", maxCount: 1 },
    { name: "song", maxCount: 1 },
  ]),
  uploadCloudinary, // ✅ Para subir a Cloudinary
  async (req, res) => {
    try {
      console.log("📥 Datos recibidos en req.body:", req.body);
      console.log("📥 Archivos recibidos en req.files:", req.files);

      await cancionesController.Crear(req, res);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al subir la canción", error: error.message });
    }
  }
);

// 📌 Obtener todas las canciones
router.get("/canciones", async (req, res) => {
  try {
    await cancionesController.ObtenerTodas(req, res);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener canciones", error: error.message });
  }
});

// 📌 Obtener una canción por ID
router.get("/canciones/:id", async (req, res) => {
  try {
    await cancionesController.ObtenerPorId(req, res);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener la canción", error: error.message });
  }
});

// 🎵 Actualizar canción (imagen y audio opcionales)
router.put(
  "/canciones/:id",
  verificarRoles(["cantante"]),
  upload.fields([
    { name: "imageCover", maxCount: 1 },
    { name: "song", maxCount: 1 },
  ]),
  uploadCloudinary,
  async (req, res) => {
    try {
      await cancionesController.Actualizar(req, res);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al actualizar la canción", error: error.message });
    }
  }
);

// 🗑️ Eliminar canción
router.delete("/canciones/:id", verificarRoles(["cantante"]), async (req, res) => {
  try {
    await cancionesController.Eliminar(req, res);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar la canción", error: error.message });
  }
});


export default router;
