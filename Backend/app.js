import "dotenv/config";
import express from "express";
import connectDB from "./config/database.js";
import usuariosrutas from "./rutas/usuariosrutas.js";
import cors from 'cors';
import cancionesrutas from './rutas/cancionesrutas.js'

const app = express();
app.use(express.json());
connectDB().catch(err => console.error('Error en la connección de la base de datos', err)); // Handle connection error
app.use(cors());

app.use("/Api",usuariosrutas)

app.use("/Api",cancionesrutas)

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});



