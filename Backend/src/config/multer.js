import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

// 📌 Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 📌 Filtro de archivos permitidos
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("audio/")) {
    cb(null, true); // ✅ Permitir imágenes y audios
  } else {
    cb(new Error("❌ Formato de archivo no permitido"), false);
  }
};

// 📌 Configurar almacenamiento en Cloudinary
const storageCloudinary = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "uploads"; // Carpeta por defecto
    let resource_type = "auto"; // Permite imágenes y audios

    if (file.mimetype.startsWith("audio/")) {
      folder = "audios"; // Guardar audios en una carpeta separada
    }

    return {
      folder,
      allowed_formats: ["jpg", "png", "jpeg", "gif", "webp", "mp3", "wav", "aac"],
      resource_type,
    };
  },
});

// 📌 Configurar Multer para Cloudinary
const uploadCloudinary = multer({ storage: storageCloudinary, fileFilter });

// 📌 Exportar el middleware para su uso en otros archivos
export default uploadCloudinary;
