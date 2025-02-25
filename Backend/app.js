import "dotenv/config";
import express from "express";
import { connectDB } from "./src/config/database.js"; 
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// 📌 Importar rutas
import usuariosrutas from "./src/rutas/usuariosrutas.js";
import cancionesrutas from "./src/rutas/cancionesrutas.js";
import cantantesrutas from "./src/rutas/cantantesrutas.js";
import playlistrutas from "./src/rutas/playlistrutas.js";
import uploadRoutes from "./src/rutas/uploads.js";

// 📌 Configuración de Cloudinary
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
    let resource_type = "image"; // Por defecto es imagen

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

const upload = multer({ storage });

// 📌 Configuración de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 🔗 Conectar a la base de datos
connectDB()
  .then(() => console.log("✅ Conexión a la base de datos establecida"))
  .catch((err) => {
    console.error("❌ Error en la conexión a la base de datos:", err);
    process.exit(1);
  });

const app = express();
app.use(cors({ origin: "*", credentials: true }));

// 📂 Middleware para JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📂 Servir archivos estáticos (Opcional si usas Cloudinary)
app.use("/public/uploads", express.static(path.join(__dirname, "public/uploads")));

// 📌 Definir rutas
app.use("/Api", usuariosrutas);
app.use("/Api", cantantesrutas);
app.use("/Api", cancionesrutas);
app.use("/Api", playlistrutas);
app.use("/Api", uploadRoutes);

// ⚠️ Middleware para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ error: "❌ Ruta no encontrada" });
});

// ⚠️ Middleware para manejo global de errores
app.use((err, req, res, next) => {
  console.error("💥 Error interno:", err);
  res.status(500).json({ error: "❌ Error interno del servidor" });
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en: ${process.env.BACKEND_URL_LOCAL || `http://localhost:${PORT}`}`);
});
