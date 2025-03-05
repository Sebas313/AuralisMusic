import mongoose from "mongoose";
import Cantante from "../Modelos/cantanteModelos.js";
import Canciones from "../Modelos/cancionesModelos.js";
import path from "path";


const buscarOCrearCantante = async (cantanteNombre) => {
  try {
    if (!cantanteNombre || typeof cantanteNombre !== "string") {
      throw new Error("El nombre del cantante es requerido y debe ser una cadena de texto.");
    }

    // Buscar si el cantante ya existe (sin importar mayúsculas o minúsculas)
    let cantanteEncontrado = await Cantante.findOne({ 
      cantante: new RegExp(`^${cantanteNombre.trim()}$`, "i") 
    });

    // Si no existe, crearlo
    if (!cantanteEncontrado) {
      cantanteEncontrado = new Cantante({ cantante: cantanteNombre.trim() });
      await cantanteEncontrado.save();
      console.log(`🎵 Cantante ${cantanteNombre} creado en la base de datos.`);
    } else {
      console.log(`✅ Cantante ${cantanteNombre} encontrado.`);
    }

    return cantanteEncontrado;
  } catch (error) {
    console.error("❌ Error en la búsqueda del cantante:", error.message);
    throw error;
  }
};
export const Crear = async (req, res) => {
  try {
  
    if (!req.files || !req.files.song || !req.files.imageCover) {
      return res.status(400).json({ message: "❌ Debes subir una imagen y un archivo de audio." });
    }


    const { cancion: titulo, album, genero, cantante } = req.body;
    
 
    const imageUrl = req.files.imageCover[0].cloudinaryUrl;
    const audioUrl = req.files.song[0].cloudinaryUrl;


    const cantanteEncontrado = await buscarOCrearCantante(cantante);




    const nuevaCancion = new Canciones({

      titulo,
      album, 
      genero,
      cantante: cantanteEncontrado._id, 
      imagen: imageUrl,
      fileUrl: audioUrl, 
    });

    await nuevaCancion.save();

    res.status(201).json({ message: "✅ Canción guardada con éxito", cancion: nuevaCancion });
  } catch (error) {
    console.error("❌ Error al guardar la canción:", error.message);
    res.status(500).json({ message: "Error interno del servidor." });
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
  buscarOCrearCantante,
  Crear,
  ObtenerTodas,
  ObtenerPorId,
  Actualizar,
  Eliminar
};
