import "dotenv/config";
import express from "express";
import connectDB from "./src/config/database.js"
import usuariosrutas from "./src/rutas/usuariosrutas.js";
import cors from 'cors';
import cancionesrutas from "./src/rutas/cancionesrutas.js"
import cantantesrutas from "./src/rutas/cantantesrutas.js";

console.log('MongoDB URI:', process.env.MONGODB_URI); 


const app = express();
app.use(express.json());
connectDB().catch(err => console.error('Error en la connección de la base de datos', err)); 
app.use(cors());

app.use("/Api",usuariosrutas)
app.use("/Api",cantantesrutas)
app.use("/Api",cancionesrutas)

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});



