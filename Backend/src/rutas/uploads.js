import express from "express";
import upload from "../config/multer.js";
import { uploadSingleImage, uploadMultipleImages, uploadAudioFile } from "../Controladores/uploadsController.js";

const router = express.Router();

// Subida de imagen de perfil
router.post("/single", upload.single("imagePerfil"), uploadSingleImage);

// Subida de múltiples imágenes
router.post("/multi", upload.array("photos", 3), uploadMultipleImages);

// Subida de canciones
router.post("/canciones", (req, res, next) => {
    upload.single("audioFile")(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: `❌ Error al subir archivo: ${err.message}` });
        }
        if (!req.file) {
            return res.status(400).json({ message: "❌ No se ha recibido ningún archivo." });
        }

        const audioUrl = `${req.protocol}://${req.get("host")}/public/uploads/${req.file.filename}`;
        res.status(201).json({ message: "✅ Canción subida con éxito", audioUrl });
    });
});

export default router;
