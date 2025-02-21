import Cantante from "../Modelos/cantanteModelos.js";
import mongoose from "mongoose";

export const crearCantante = async (req,res)=>{
  try{
    const{nombre, canciones, avatar} = req.body;
    const nuevoCantante = new Cantante({
      nombre,
      canciones,
      avatar,
    })

    await nuevoCantante.save();
    res.status(201).json("cantante guardado");
  }catch(error){
    console.error("Error al guardar el cantante", error.message);
    res.status(500).json({ message: "Error al guardar el cantante"})
  }
}
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
    const { nombre, canciones } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID no válido" });
    }
    const cantante = await Cantante.findByIdAndUpdate(
      id,
      { nombre, canciones },
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
  crearCantante,
    listarCantantes,
    obtenerCantante,
    actualizarCantante,
    eliminarCantante
}