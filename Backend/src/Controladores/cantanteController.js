import Cantante from "../Modelos/cantanteModelos.js";
import mongoose from "mongoose";

export const crearCantante = async (req, res) => {
  try {
    const { cantante, canciones, avatar } = req.body; 

    if (!cantante) {
      return res.status(400).json({ message: "El nombre del cantante es requerido" });
    }

    const nuevoCantante = new Cantante({
      cantante,
      canciones: canciones || [], 
      avatar: avatar || null,
    });

    
    const cantanteGuardado = await nuevoCantante.save();
    res.status(201).json({ message: "Cantante guardado con éxito", cantante: cantanteGuardado });
  } catch (error) {
    console.error("Error al guardar el cantante", error.message);
    res.status(500).json({ message: "Error al guardar el cantante" });
  }
};

export const listarCantantes = async (req, res) => {
  try {
    const cantantes = await Cantante.find();
    res.status(200).json(cantantes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los cantantes" });
  }
};

export const obtenerCantante = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID no válido" });
    }

    const cantante = await Cantante.findById(id);

    if (!cantante) {
      return res.status(404).json({ message: "Cantante no encontrado" });
    }

    res.status(200).json(cantante);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const actualizarCantante = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantante, canciones } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID no válido" });
    }

    const cantanteActualizado = await Cantante.findByIdAndUpdate(
      id, 
      { cantante, canciones },
      { new: true }
    );

    if (!cantanteActualizado) {
      return res.status(404).json({ message: "Cantante no encontrado" });
    }

    res.status(200).json({ message: "Cantante actualizado con éxito", cantante: cantanteActualizado });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const eliminarCantante = async (req, res) => {
  try {
    const { id } = req.params;
   

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID no válido" });
    }

    const cantanteEliminado = await Cantante.findByIdAndDelete(req.params.id);

    if (!cantanteEliminado) {
      return res.status(404).json({ message: "Cantante no encontrado" });
    }

    res.status(200).json({ message: "Cantante eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default {
  crearCantante,
  listarCantantes,
  obtenerCantante,
  actualizarCantante,
  eliminarCantante,
};
