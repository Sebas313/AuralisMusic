import "dotenv/config";
import express from "express";
import { connectDB } from "./src/config/database.js";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Importar rutas organizadas
import usuariosrutas from "./src/rutas/usuariosrutas.js";
import cancionesrutas from "./src/rutas/cancionesrutas.js";
import cantantesrutas from "./src/rutas/cantantesrutas.js";
import playlistrutas from "./src/rutas/playlistrutas.js";
import uploadRoutes from "./src/rutas/uploads.js";

// Configuración de __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// 🛢️ Conectar a la base de datos
async function startServer() {
  try {
    await connectDB();
    console.log("✅ Base de datos conectada con éxito");

    // 🚀 Iniciar servidor después de la conexión
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al conectar la base de datos:", error);
    process.exit(1);
  }
}

// 📌 Configuración de CORS para local y producción
const allowedOrigins = [
  process.env.BACKEND_URL_LOCAL || "http://localhost:3000",
  process.env.BACKEND_URL_PROD || "https://auralismusic-production.up.railway.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// 📂 Middleware para JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📂 ⚠️ Manejo de `uploads` en Railway
const uploadsPath = path.join(__dirname, "public/uploads");

if (process.env.NODE_ENV !== "production") {
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
    console.log("📁 Carpeta 'uploads' creada:", uploadsPath);
  } else {
    console.log("📁 Carpeta 'uploads' ya existe:", uploadsPath);
  }
  app.use("/public/uploads", express.static(uploadsPath));
} else {
  console.log("⚠️ Railway no almacena archivos localmente. Usa un servicio como Cloudinary.");
}

/**
 * 📌 Rutas de la API
 */
app.use("/Api", usuariosrutas);
app.use("/Api", cantantesrutas);
app.use("/Api", cancionesrutas);
app.use("/Api", playlistrutas);
app.use("/Api", uploadRoutes);

// 🌐 Ruta por defecto para verificar estado del servidor
app.get("/", (req, res) => {
  res.json({ message: "🚀 API funcionando correctamente" });
});

// 🚀 Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
});
