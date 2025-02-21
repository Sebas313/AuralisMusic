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
connectDB().catch(err => console.error('Error en la connección de la base de datos', err)); 
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
});
