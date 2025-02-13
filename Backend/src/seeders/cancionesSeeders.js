import "dotenv/config";
import mongoose from "mongoose";
import Cancion from "../Modelos/cancionesModelos.js"; // Asegúrate de que este modelo existe
import connectDB from "../config/database.js";

(async function cancionesSeeder() {
  try {
    await connectDB(); // Conectar a la base de datos

    
    // Insertar nuevas canciones
    const canciones = [
      {
        artista: "Billie Eilish",
        cancion: "Bad Guy",
        album: "When We All Fall Asleep, Where Do We Go?",
        genero: "Pop Alternativo",
        imagen: "https://example.com/bad-guy.jpg",
      },
      {
        artista: "The Weeknd",
        cancion: "Save Your Tears",
        album: "After Hours",
        genero: "R&B",
        imagen: "https://example.com/save-your-tears.jpg",
      },
      {
        artista: "Bad Bunny",
        cancion: "Me Porto Bonito",
        album: "Un Verano Sin Ti",
        genero: "Reggaeton",
        imagen: "https://example.com/me-porto-bonito.jpg",
      },
      {
        artista: "Metallica",
        cancion: "Master of Puppets",
        album: "Master of Puppets",
        genero: "Metal",
        imagen: "https://example.com/master-of-puppets.jpg",
      },
      {
        artista: "Adele",
        cancion: "Easy on Me",
        album: "30",
        genero: "Soul",
        imagen: "https://example.com/easy-on-me.jpg",
      },
      {
        artista: "Eminem",
        cancion: "Without Me",
        album: "The Eminem Show",
        genero: "Rap",
        imagen: "https://example.com/without-me.jpg",
      },
      {
        artista: "Coldplay",
        cancion: "Fix You",
        album: "X&Y",
        genero: "Rock Alternativo",
        imagen: "https://example.com/fix-you.jpg",
      },
      {
        artista: "Shakira",
        cancion: "Waka Waka",
        album: "Sale el Sol",
        genero: "Latino",
        imagen: "https://example.com/waka-waka.jpg",
      },
    ];

    await Cancion.insertMany(canciones);
    console.log("[Seeder] Canciones insertadas correctamente.");

    mongoose.connection.close(); // Cerrar conexión
  } catch (error) {
    console.error("[Seeder] Error:", error);
    mongoose.connection.close();
    process.exit(1);
  }
})();
