import "dotenv/config";
import express from "express";
import { connectDB } from "./src/config/database.js"; 
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { upload } from "./src/config/multer.js";



import usuariosrutas from "./src/rutas/usuariosrutas.js";
import cancionesrutas from "./src/rutas/cancionesrutas.js";
import cantantesrutas from "./src/rutas/cantantesrutas.js";
import playlistrutas from "./src/rutas/playlistrutas.js";
import uploadRoutes from "./src/rutas/uploads.js";

// 📌 Configuración de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 🔗 Conectar a la base de datos
connectDB()
  .then()
  .catch((err) => {
    console.error("❌ Error en la conexión a la base de datos:", err);
    process.exit(1);
  });

const app = express();
app.use(cors({ origin: "*", credentials: true }));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/public/uploads", express.static(path.join(__dirname, "public/uploads")));


app.use("/Api", usuariosrutas);
app.use("/Api", cantantesrutas);
app.use("/Api", cancionesrutas);
app.use("/Api", playlistrutas);
app.use("/Api", uploadRoutes);


app.use((req, res, next) => {
  res.status(404).json({ error: "❌ Ruta no encontrada" });
});


app.use((err, req, res, next) => {
  console.error("💥 Error interno:", err);
  res.status(500).json({ error: "❌ Error interno del servidor" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en: ${process.env.BACKEND_URL_LOCAL || `http://localhost:${PORT}`}`);
});
