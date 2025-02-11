import Cantante from "../Modelos/cantanteModelos.js";
import mongoose from "mongoose";

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
    const cantante = await res
      .status(404)
      .json({ message: "Cantante no encontrado" });
    res.status(200).json(cantante);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
export const actualizarCantante = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, genero, canciones } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID no válido" });
    }
    const cantante = await Cantante.findByIdAndUpdate(
      id,
      { nombre, genero, canciones },
      { new: true }
    );
    if (!cantante)
      return res.status(404).json({ message: "Cantante no encontrado" });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
export const eliminarCantante = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID recibido", id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID no válido" });
    }
    const cantante = await Cantante.findByIdAndDelete(id);
    if (!cantante)
      return res.status(404).json({ message: "Cantante no encontrado" });
    res.status(200).json({ message: "Cantante elimindao" });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor " });
  }
};

export default {
    listarCantantes,
    obtenerCantante,
    actualizarCantante,
    eliminarCantante
}