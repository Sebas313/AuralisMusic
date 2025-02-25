import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { uploadSingleImage, uploadMultipleImages, uploadAudioFile } from "../Controladores/uploadsController.js";

// 📌 Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 📌 Configurar almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "uploads";
    let resource_type = "image"; // Por defecto, imágenes

    if (file.mimetype.startsWith("audio/")) {
      folder = "audios";
      resource_type = "auto";
    }

    return {
      folder,
      allowed_formats: ["jpg", "png", "jpeg", "gif", "webp", "mp3", "wav", "aac"],
      resource_type,
    };
  },
});

// 📌 Validación de archivos con Multer
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("audio/")) {
    cb(null, true);
  } else {
    cb(new Error("Formato de archivo no permitido"), false);
  }
};

const upload = multer({ storage, fileFilter });

const router = express.Router();

// 📸 Subida de imagen de perfil (campo: "imagePerfil")
router.post("/single", upload.single("imagePerfil"), uploadSingleImage);

// 📸 Subida de múltiples imágenes (campo: "photos", máximo 3)
router.post("/multi", upload.array("photos", 3), uploadMultipleImages);

// 🎵 Subida de canciones (campo: "audioFile")
router.post("/canciones", upload.single("audioFile"), uploadAudioFile);

export default router;
