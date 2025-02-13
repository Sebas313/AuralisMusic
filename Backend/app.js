import "dotenv/config";
import express from "express";
import connectDB from "./src/config/database.js"
import usuariosrutas from "./src/rutas/usuariosrutas.js";
import cors from 'cors';
import cancionesrutas from "./src/rutas/cancionesrutas.js"
import cantantesrutas from "./src/rutas/cantantesrutas.js";

import path from "path"; 
import upload from "./src/config/multer.js";
import { saveImage } from "./src/config/multer.js";
import { fileURLToPath } from "url"; 
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB().catch(err => console.error('Error en la connección de la base de datos', err)); // Handle connection error
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post('/Images/Single', upload.single('imagePerfil', (req,res)=>{
    console.log(req.file);
    saveImage(req.file);
    res.send('imagenSingle terminada')
}))

app.post('Images/Multi', upload.array('photos',3), (req,res)=>{
    req.files.map(saveImage);
    res.send('imagenesMulti terminadas')
})

app.use("/Api",usuariosrutas)
app.use("/Api",cantantesrutas)
app.use("/Api",cancionesrutas)

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});



