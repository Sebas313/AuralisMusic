import mongoose from "mongoose";
import Cantante from "../Modelos/cantanteModelos.js";
import Canciones from "../Modelos/cancionesModelos.js";
import path from "path";

// Función para buscar un cantante o crearlo si no existe
const buscarOCrearCantante = async (nombre) => {
  try {
    let cantanteEncontrado = await Cantante.findOne({ 
      nombre: { $regex: `^${nombre.trim()}$`, $options: "i" } // Búsqueda insensible a mayúsculas y espacios
    });

    if (!cantanteEncontrado) {
      cantanteEncontrado = new Cantante({ nombre });
      await cantanteEncontrado.save();
      console.log(`Cantante ${nombre} creado en la base de datos.`);
    } else {
      console.log(`Cantante ${nombre} encontrado.`);
    }

    return cantanteEncontrado;
  } catch (error) {
    console.error("Error en la búsqueda del cantante:", error);
    throw error;
  }
};

export const Crear = async (req, res) => {
  try {
    // Desestructuramos la información recibida
    const { cantante, cancion, album, genero } = req.body;

    // Verificar si se han subido los archivos requeridos
    if (!req.files || !req.files["song"] || req.files["song"].length === 0) {
      return res.status(400).json({ message: "El archivo de la canción es obligatorio." });
    }

    // Buscar o crear el cantante
    const cantanteEncontrado = await buscarOCrearCantante(cantante);

    // Obtener la URL del archivo de la canción
    const fileUrl = `http://localhost:3000/uploads/${req.files["song"][0].filename}`;

    // Manejar la imagen si se ha subido
    let imageUrl = "";
    if (req.files["image"] && req.files["image"].length > 0) {
      imageUrl = `http://localhost:3000/uploads/${req.files["image"][0].filename}`;
    }

    // Crear una nueva canción con la información proporcionada
    const NuevaCancion = new Canciones({
      cantante: cantanteEncontrado._id,
      cancion,
      album,
      genero,
      imagen: imageUrl,
      fileUrl,
    });

    console.log("Canción a guardar:", NuevaCancion);

    // Guardar la canción en la base de datos
    await NuevaCancion.save();
    res.status(201).json({ message: "Canción guardada con éxito", cancion: NuevaCancion });
  } catch (error) {
    console.error("Error al guardar la canción:", error.message);
    res.status(500).json({ message: "Error al guardar la canción.", error: error.message });
  }
};

// Exportación corregida
export default {
  Crear
};
