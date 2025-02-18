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



export const ObtenerTodas = async (req, res) => {
  try {
    const canciones = await Canciones.find().populate("cantante");
    res.status(200).json(canciones);
  } catch (error) {
    console.error("Error al obtener canciones:", error.message);
    res.status(500).json({ message: "Error al obtener canciones", error: error.message });
  }
};

export const ObtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const cancion = await Canciones.findById(id).populate("cantante");

    if (!cancion) {
      return res.status(404).json({ message: "Canción no encontrada" });
    }

    res.status(200).json(cancion);
  } catch (error) {
    console.error("Error al obtener la canción:", error.message);
    res.status(500).json({ message: "Error al obtener la canción", error: error.message });
  }
};


export const Actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancion, album, genero } = req.body;

    const cancionActualizada = await Canciones.findByIdAndUpdate(
      id,
      { cancion, album, genero },
      { new: true }
    );

    if (!cancionActualizada) {
      return res.status(404).json({ message: "Canción no encontrada" });
    }

    res.status(200).json({ message: "Canción actualizada con éxito", cancion: cancionActualizada });
  } catch (error) {
    console.error("Error al actualizar la canción:", error.message);
    res.status(500).json({ message: "Error al actualizar la canción", error: error.message });
  }
};


export const Eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const cancionEliminada = await Canciones.findByIdAndDelete(id);

    if (!cancionEliminada) {
      return res.status(404).json({ message: "Canción no encontrada" });
    }

    res.status(200).json({ message: "Canción eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar la canción:", error.message);
    res.status(500).json({ message: "Error al eliminar la canción", error: error.message });
  }
};

export default {
  Crear,
  ObtenerTodas,
  ObtenerPorId,
  Actualizar,
  Eliminar
};
