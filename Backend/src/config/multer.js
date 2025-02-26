import multer from "multer";
import cloudinaryPkg from "cloudinary";
import streamifier from "streamifier";

// ✅ Corregir la importación de Cloudinary
const cloudinary = cloudinaryPkg.v2;

// 📌 Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 📌 Configurar almacenamiento en memoria con Multer
const storage = multer.memoryStorage();

// 📌 Filtro de archivos permitidos
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("audio/")) {
    cb(null, true); // ✅ Permitir imágenes y audios
  } else {
    cb(new Error("❌ Formato de archivo no permitido"), false);
  }
};

// 📌 Middleware de subida con Multer
const upload = multer({ storage, fileFilter });

// 📌 Función para subir archivos a Cloudinary
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

// 📌 Middleware para manejar la subida a Cloudinary
const uploadCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se ha subido ningún archivo" });
    }

    const folder = req.file.mimetype.startsWith("audio/") ? "audios" : "uploads";
    const result = await uploadToCloudinary(req.file.buffer, folder);

    req.file.cloudinaryUrl = result.secure_url; // ✅ Guarda la URL en la request
    next();
  } catch (error) {
    res.status(500).json({ error: "Error al subir archivo a Cloudinary" });
  }
};

// 📌 Exportar middleware de subida como exportación nombrada
export { upload, uploadCloudinary };