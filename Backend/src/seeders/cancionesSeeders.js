import "dotenv/config";
import Canciones from "../Modelos/cancionesModelos.js";
import connectDB from "../config/database.js";
import mongoose from "mongoose";
import cancionesController from "../Controladores/cancionesController.js";


(async function cancionesSeeder() {
  try {
   
    await connectDB();

    
    const cancion = await Canciones.create({
      artista: "Billie Barragan",
      cancion: "hotline",
      album: "DTMF", 
      genero: "rock", 
    });

    
    if (cancion) {
      console.log("[Seeder] Canción creada exitosamente.");
    } else {
      console.log("[Seeder] Error al crear la Canción.");
    }

    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("[Seeder] Error al crear la canción:", error);
    process.exit(1);
  }
})();
