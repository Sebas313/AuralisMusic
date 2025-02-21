
export const uploadSingleImage = (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "❌ No se ha recibido la imagen." });
    }
    res.status(201).json({ message: "✅ Imagen subida correctamente", file: req.file });
  };
  
  export const uploadMultipleImages = (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "❌ No se han recibido imágenes." });
    }
    res.status(201).json({ message: "✅ Imágenes subidas correctamente", files: req.files });
  };
  
  export const uploadAudioFile = (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "❌ No se ha recibido el archivo de audio." });
    }
  
    // Generar la URL del archivo subido
    const audioUrl = `${req.protocol}://${req.get("host")}/public/uploads/${req.file.filename}`;
    res.status(201).json({ message: "✅ Canción subida con éxito", audioUrl });
  };
  