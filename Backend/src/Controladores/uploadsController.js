import { v2 as cloudinary } from "cloudinary";

// 📸 Subir una sola imagen a Cloudinary
export const uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "❌ No se recibió ninguna imagen." });
    }
    
    res.status(201).json({
      message: "✅ Imagen subida correctamente",
      imageUrl: req.file.path, // URL de Cloudinary
    });
  } catch (error) {
    res.status(500).json({ error: "❌ Error al subir la imagen.", details: error.message });
  }
};

// 📸 Subir múltiples imágenes a Cloudinary
export const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "❌ No se recibieron imágenes." });
    }

    const imageUrls = req.files.map((file) => file.path); // URLs de Cloudinary
    res.status(201).json({
      message: "✅ Imágenes subidas correctamente",
      imageUrls,
    });
  } catch (error) {
    res.status(500).json({ error: "❌ Error al subir imágenes.", details: error.message });
  }
};

export const uploadAudioFile = (req, res) => {
  console.log("📩 BODY:", req.body);
  console.log("📂 FILE:", req.file);
  
  if (!req.file) {
    return res.status(400).json({ message: "❌ No se ha recibido el archivo de audio." });
  }

  res.status(201).json({
    message: "✅ Canción subida con éxito",
    audioUrl: req.file.path, // Cloudinary devuelve la URL del archivo
  });
};


