import cloudinaryPkg from "cloudinary";
import streamifier from "streamifier";


const cloudinary = cloudinaryPkg.v2;


const uploadToCloudinary = (fileBuffer, folder, resourceType = "auto") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};



export const uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "❌ No se recibió ninguna imagen." });
    }

 
    const result = await uploadToCloudinary(req.file.buffer, "uploads", "image");

    res.status(201).json({
      message: "✅ Imagen subida correctamente",
      imageUrl: result.secure_url, 
    });
  } catch (error) {
    res.status(500).json({ error: "❌ Error al subir la imagen.", details: error.message });
  }
};


export const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "❌ No se recibieron imágenes." });
    }


    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer, "uploads", "image")
    );
    const results = await Promise.all(uploadPromises);

    const imageUrls = results.map((result) => result.secure_url);

    res.status(201).json({
      message: "✅ Imágenes subidas correctamente",
      imageUrls,
    });
  } catch (error) {
    res.status(500).json({ error: "❌ Error al subir imágenes.", details: error.message });
  }
};


export const uploadAudioFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "❌ No se ha recibido el archivo de audio." });
    }


    const result = await uploadToCloudinary(req.file.buffer, "audios", "audio");

    res.status(201).json({
      message: "✅ Canción subida con éxito",
      audioUrl: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({ error: "❌ Error al subir el audio.", details: error.message });
  }
  
};
