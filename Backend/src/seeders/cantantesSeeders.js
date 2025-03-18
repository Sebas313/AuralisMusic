import "dotenv/config";
import mongoose from "mongoose";
import Cantante from "../Modelos/cantanteModelos.js"; 
import connectDB from "../config/database.js";

(async function cantantesSeeder() {
  try {
    await connectDB(); 

    await Cantante.deleteMany();
    console.log("[Seeder] Cantantes eliminados correctamente.");

    const cantantes = [
      {
        cantante: "Billie Eilish",
        genero: "Pop Alternativo",
        canciones: [], // Debería ser un array de ObjectId si referenciarás canciones en el futuro
        avatar: "https://example.com/billie.jpg",
      },
      {
        cantante: "The Weeknd",
        genero: "R&B",
        canciones: [],
        avatar: "https://example.com/weeknd.jpg",
      },
      {
        cantante: "Bad Bunny",
        genero: "Reggaeton",
        canciones: [],
        avatar: "https://example.com/badbunny.jpg",
      },
      {
        cantante: "Metallica",
        genero: "Metal",
        canciones: [],
        avatar: "https://example.com/metallica.jpg",
      },
      {
        cantante: "Adele",
        genero: "Soul",
        canciones: [],
        avatar: "https://example.com/adele.jpg",
      },
      {
        cantante: "Eminem",
        genero: "Rap",
        canciones: [],
        avatar: "https://example.com/eminem.jpg",
      },
      {
        cantante: "Coldplay",
        genero: "Rock Alternativo",
        canciones: [],
        avatar: "https://example.com/coldplay.jpg",
      },
      {
        cantante: "Shakira",
        genero: "Latino",
        canciones: [],
        avatar: "https://example.com/shakira.jpg",
      },
    ];

    await Cantante.insertMany(cantantes);
    console.log("[Seeder] Cantantes insertados correctamente.");
  } catch (error) {
    console.error("[Seeder] Error:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("[Seeder] Conexión a MongoDB cerrada.");
  }
})();
