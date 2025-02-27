import multer from "multer";
import cloudinaryPkg from "cloudinary";
import streamifier from "streamifier";

// ✅ Configurar Cloudinary
const cloudinary = cloudinaryPkg.v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Configurar almacenamiento en memoria con Multer
const storage = multer.memoryStorage();
const upload = multer({ storage }); // ← Aquí se define correctamente

// ✅ Función para subir archivos a Cloudinary
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

// ✅ Middleware para subir archivos a Cloudinary
const uploadCloudinary = async (req, res, next) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: "No se ha subido ningún archivo" });
    }

    // 📌 Subir archivos a Cloudinary
    if (req.files.song) {
      const audioResult = await uploadToCloudinary(req.files.song[0].buffer, "audios");
      req.files.song[0].cloudinaryUrl = audioResult.secure_url;
    }

    if (req.files.imageCover) {
      const imageResult = await uploadToCloudinary(req.files.imageCover[0].buffer, "uploads");
      req.files.imageCover[0].cloudinaryUrl = imageResult.secure_url;
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Error al subir archivos a Cloudinary" });
  }
};

export { upload, uploadCloudinary };

