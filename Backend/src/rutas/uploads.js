import express from "express";
import multer from "multer";
import {upload, uploadCloudinary} from "../config/multer.js";
import { uploadSingleImage, uploadMultipleImages, uploadAudioFile } from "../Controladores/uploadsController.js";

const router = express.Router();

// 📸 Subida de imagen de perfil (campo: "imagePerfil")
router.post("/single", upload.single("imageCover"), uploadSingleImage);

// 📸 Subida de múltiples imágenes (campo: "photos", máximo 3)
router.post("/multi", upload.array("photos", 3), uploadMultipleImages);

// 🎵 Subida de canciones con imagen de portada (campo: "song" y "image")
router.post(
  "/canciones",
  upload.fields([
    { name: "imageCover", maxCount: 1 },
    { name: "song", maxCount: 1 },
  ]),
  uploadAudioFile
);


export default router;
