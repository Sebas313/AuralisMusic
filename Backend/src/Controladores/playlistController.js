import playList from "../Modelos/playlistModelos";
import Canciones from "../Modelos/cancionesModelos";
import Usuario from "../Modelos/usuariosModelos";
import mongoose from "mongoose";

export const crear = async (req,res)=>{
    try{
        const { creadoPor, canciones,nombre, descripcion} = req.body;

        const cancionesEncontradas = await Canciones.findOne({ nombre: canciones });
        const usuarioEncontrado = await Usuario.findOne({ nombre: creadoPor });

        if(!cancionesEncontradas){
            return res.status(400).json({ message:`No se encontro la cancion: ${canciones}`})
        }
        if(!usuarioEncontrado){
            return res.status(400).json({message:`No se encontro el usuario: ${creadoPor}`
            })
        }
        const nuevaPlaylist = new playList({
            canciones: cancionesEncontradas._id,
            creadoPor: usuarioEncontrado._id,
            nombre,
            descripcion,
        })

        await nuevaPlaylist.save();
        res.status(201).json("Playlist guardada");
    }catch(error){
        console.error("Error al guardar la cancion",error.message);
        res.status(500).json({message:"Error al guardar la cancion",error:error.message})
    }
};

export const listar = async (req,res) =>{
    try {
        const Playlist = await playList.find();
        res.status(200).json(Playlist);
    } catch (error) {
        console.error("Error al obtener las canciones", error.message);
        res.status(500).json({ message:"Error al obtener la playlist", error:error.message});
    }
};

export const ObtenerPorId = async (req,res)=>{
    const { id } = req.params;
        if(!mongoose.Type.ObjectId.isValid(id)){
            return res.status(400).json({message:"ID no valido"});
        }
    try {
    const Playlist = await playList.findById(id);

    if(!Playlist){
        return res.status(400).json({ message:"playlist no encontrado"});
    }

    res.status(200).json(playList);
    } catch (error) {
        console.error("Error al obtener la cancion", error.message);
        res.status(500).json({ message:"Error al obtener la playlisy",error:error.message})
    }
};

export const Actualizar = async (req,res) => {
    const { id } = req.params;
    const {creadoPor, canciones,nombre, descripcion } = req.body;
    try{
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"ID no valido"});  
        }
        const playlistActualizada = await playList.findByIdAndUpdate(
            id,
            {creadoPor, canciones, nombre, descripcion},
            {new:true}
        );
        if(!playlistActualizada){
            return res.status(404).json({ message:"playlist no encontrada"})
        }
        res.status(200).json(playlistActualizada);
    }catch(error){
        console.error("Error al actualizar la cancion", error.message);
        res.status(500).json({message:"error al actualizar playlsit", error:error.message})
    }
};

export const Eliminar = async (req,res)=>{
    const { id } = req.params;
  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).json({ message: " ID no valido"});
  }
  try {
    const playlistEliminada = await playList.findByIdAndDelete(id);

    if(!playlistEliminada){
        return res.status(404).json({message:"playlsit no encontrada"})
    }
    res.status(200).json({ message:"playlist eliminada con exito"})
  } catch (error) {
    console.error("error al eliminra la playlsit", error.message);
    res.status(500).json({ message: "Error al eliminar la cancion", error:error.message})
  }
};

export default { crear, listar, ObtenerPorId, Actualizar,Eliminar}