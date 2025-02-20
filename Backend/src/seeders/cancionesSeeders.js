import mongoose from "mongoose";
import dotenv from "dotenv";
import Canciones from "../Modelos/cancionesModelos.js";
import Cantante from "../Modelos/cantanteModelos.js";

dotenv.config();

// Verificar que la URI está definida
if (!process.env.MONGODB_URI) {
  console.error("❌ No se encontró la URI de conexión a MongoDB. Revisa tu archivo .env");
  process.exit(1);
}

const canciones = [
  {
    artista: "Billie Eilish",
    cancion: "Bad Guy",
    album: "When We All Fall Asleep, Where Do We Go?",
    genero: "Pop Alternativo",
    imagen: "https://example.com/bad-guy.jpg",
    fileUrl: "https://example.com/bad-guy.mp3",
  },
  {
    artista: "The Weeknd",
    cancion: "Save Your Tears",
    album: "After Hours",
    genero: "R&B",
    imagen: "https://example.com/save-your-tears.jpg",
    fileUrl: "https://example.com/save-your-tears.mp3",
  },
];

const cancionesSeeder = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Conectado a la base de datos");

    for (const cancion of canciones) {
      const cantante = await Cantante.findOne({ cantante: cancion.artista });

      if (!cantante) {
        console.warn(`⚠️ No se encontró el cantante: ${cancion.artista}`);
        continue;
      }

      const nuevaCancion = new Canciones({
        cantante: cantante._id,
        cancion: cancion.cancion,
        album: cancion.album,
        genero: cancion.genero,
        imagen: cancion.imagen,
        fileUrl: cancion.fileUrl,
      });

      await nuevaCancion.save();
      console.log(`🎵 Canción guardada: ${cancion.cancion}`);
    }

    console.log("✅ Seeding completado");
  } catch (error) {
    console.error("❌ Error en el seeding:", error);
  } finally {
    mongoose.connection.close();
  }
};

cancionesSeeder();
