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

// 🔗 Conectar base de datos con mejor manejo de errores
connectDB()
  .then(() => console.log("✅ Conexión a la base de datos establecida"))
  .catch((err) => {
    console.error("❌ Error en la conexión de la base de datos:", err);
    process.exit(1); // Sale del proceso si la conexión falla
  });

const app = express();

// 🌍 Configuración de CORS
const allowedOrigins = ["https://auralis-music.vercel.app", "http://localhost:4200"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ No permitido por CORS"));
    }
  },
  methods: "GET,PUT,POST,DELETE,OPTIONS,HEAD",
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  credentials: true, // Permitir cookies y headers con credenciales
};

app.use(cors(corsOptions));

// 📂 Middleware para JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📂 Definir la carpeta de uploads
const uploadsPath = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log("📁 Carpeta 'uploads' creada en:", uploadsPath);
} else {
  console.log("📁 Carpeta 'uploads' ya existe en:", uploadsPath);
}

// 📂 Servir archivos estáticos
app.use("/public/uploads", express.static(uploadsPath));

/**
 * 📌 Rutas de la API
 */
app.use("/Api", usuariosrutas);
app.use("/Api", cantantesrutas);
app.use("/Api", cancionesrutas);
app.use("/Api", playlistrutas);
app.use("/Api", uploadRoutes);

// 🚀 Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
});
