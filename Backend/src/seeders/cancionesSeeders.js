import "dotenv/config";
import Canciones from "../Modelos/cancionesModelos.js";
import connectDB from "../config/database.js"
import mongoose from "mongoose";
import cancionesController from "../Controladores/cancionesController.js";

// Wrapping the whole seeding process in an async IIFE (Immediately Invoked Function Expression)
(async function cancionesSeeder() {
    try {
      // Connect to the database
      await connectDB();
  
      // Create the user
      const canciones = await Canciones.Crear({
        artista: "Billie Barragan",
        cancion: "hotline",
        album: "DTMF", // Phone stored as string
        genero: "rock", // Address stored as string
      });
  
      // Check if the user was created successfully
      if (user) {
        console.log("[Seeder] Usuario creado exitosamente.");
      } else {
        console.log("[Seeder] Error al crear el Usuario.");
      }
      
      // Exit the process with success
      process.exit(0);
    } catch (error) {
      // Exit with error
      process.exit(1);
    }
  })();