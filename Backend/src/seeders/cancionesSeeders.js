import "dotenv/config";
import Canciones from "../Modelos/cancionesModelos.js";
import connectDB from "../config/database.js";
import mongoose from "mongoose";
import cancionesController from "../Controladores/cancionesController.js";

// Wrapping the whole seeding process in an async IIFE (Immediately Invoked Function Expression)
(async function cancionesSeeder() {
  try {
    // Connect to the database
    await connectDB();

    // Create the song
    const cancion = await Canciones.create({
      artista: "Billie Barragan",
      cancion: "hotline",
      album: "DTMF", // Phone stored as string
      genero: "rock", // Address stored as string
    });

    // Check if the song was created successfully
    if (cancion) {
      console.log("[Seeder] Canción creada exitosamente.");
    } else {
      console.log("[Seeder] Error al crear la Canción.");
    }

    // Close the connection after the seeding process is complete
    mongoose.connection.close();
    process.exit(0); // Exit successfully
  } catch (error) {
    console.error("[Seeder] Error al crear la canción:", error);
    process.exit(1); // Exit with error
  }
})();
