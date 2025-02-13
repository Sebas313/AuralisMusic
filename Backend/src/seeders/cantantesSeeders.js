import "dotenv/config";
import mongoose from "mongoose";
import Cantante from "../Modelos/cantanteModelos.js"; // Asegúrate de que este modelo existe
import connectDB from "../config/database.js";

(async function cantantesSeeder() {
  try {
    await connectDB(); // Conectar a la base de datos

    // Eliminar todos los cantantes previos (opcional)
    await Cantante.deleteMany();
    console.log("[Seeder] Cantantes eliminados correctamente.");

    // Insertar nuevos cantantes con álbumes
    const cantantes = [
        {
          cantante: "Billie Barragan",
          genero: "Pop Alternativo",
          canciones: "Bad Guy", // 👈 Ahora es un string, no un array
          avatar: "https://example.com/billie.jpg",
        },
        {
          cantante: "The Weeknd",
          genero: "R&B",
          canciones: "Blinding Lights",
          avatar: "https://example.com/weeknd.jpg",
        },
        {
          cantante: "Bad Bunny",
          genero: "Reggaeton",
          canciones: "Tití Me Preguntó",
          avatar: "https://example.com/badbunny.jpg",
        },
        {
          cantante: "Metallica",
          genero: "Metal",
          canciones: "Enter Sandman",
          avatar: "https://example.com/metallica.jpg",
        },
        {
          cantante: "Adele",
          genero: "Soul",
          canciones: "Rolling in the Deep",
          avatar: "https://example.com/adele.jpg",
        },
        {
          cantante: "Eminem",
          genero: "Rap",
          canciones: "Lose Yourself",
          avatar: "https://example.com/eminem.jpg",
        },
        {
          cantante: "Coldplay",
          genero: "Rock Alternativo",
          canciones: "Yellow",
          avatar: "https://example.com/coldplay.jpg",
        },
        {
          cantante: "Shakira",
          genero: "Latino",
          canciones: "Hips Don't Lie",
          avatar: "https://example.com/shakira.jpg",
        },
      ];
      

    await Cantante.insertMany(cantantes);
    console.log("[Seeder] Cantantes insertados correctamente.");

    mongoose.connection.close(); // Cerrar conexión
  } catch (error) {
    console.error("[Seeder] Error:", error);
    mongoose.connection.close();
    process.exit(1);
  }
})();
