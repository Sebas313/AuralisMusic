import Canciones from "../Modelos/cancionesModelos.js";
import Cantante from "../Modelos/cantanteModelos.js";
import mongoose from 'mongoose';


export const asignarGenero = async (tipo)=>{
  if(typeof tipo !== "string" || tipo.trim() === ""){
    throw new Error("el genero proporcionado debe ser un string no vacío")
  }
  const generoMap ={
    'rock':'Rock',
    'pop': 'Pop',
    'metal':'metal',
    'hip-hop & rap':'Hip-Hop & Rap',
    'R&B & Soul':'R&B & Soul',
    'eeggae': 'Reggae',
    'electronic & Dance':'Electronic & Dance',
    'indie':'Indie',
    'post-rock & experimental':'Post-Rock & Experimental',
    'psychedelic':'Psychedelic',
    'industrial':'Industrial',
    'folk & World Music': 'Folk & World Music',
    'salsa':'Salsa',
    'merengue':'Merengue',
    'cumbia':'Cumbia',
    'bachata':'Bachata',
    'tango':'Tango',
    'vallenato':'Vallenato',
    'bolero':'Bolero',
    'ranchera':'Ranchera',
    'reggaetón':'Reggaetón',
    'norteña':'Norteña',
    'k-pop':'K-Pop'
  };
  const nombreGenero = generoMap[tipo.toLowerCase()]

  if(!nombreGenero){
    throw new Error(`No existe un genero para el tipo:${tipo}`)
  }
  let genero = await Canciones.findOne({name:nombreGenero});
  if(!genero){
    genero = await Canciones.create({name:nombreGenero})
  }
  return genero._id;
}
export const Crear = async (req, res) => {
    try {
      const { cantante, cancion, album, imagen, tipo} = req.body;

      console.log("datos recibidos", req.body)
      const cantanteEncontrado = await Cantante.findOne({ nombre: cantante });

      if (!cantanteEncontrado) {
        return res.status(400).json({ message: `No se encontró el cantante: ${cantante}` });
      }

      const generoTipo = await asignarGenero(tipo);

      const NuevaCancion = new Canciones({
        cantante: cantanteEncontrado._id,
        cancion,
        album,
        genero: generoTipo,
        imagen,
      });

      
      await NuevaCancion.save();
      res.status(201).json("Canción Guardada");
    } catch (error) {
      console.error("Error al guardar la canción", error.message);
      res.status(500).json({ message: "Error al guardar la canción.", error:error.message })
    }
  };
  

 
export const ObtenerTodas = async (req, res) => {
    try {
      const canciones = await Canciones.find();
      res.status(200).json(canciones);
    } catch (error) {
      console.error("Error al obtener las canciones", error.message);
      res.status(500).json({ message: "Error al obtener las canciones.", error: error.message });
    }
  };
  
  
  export const ObtenerPorId = async (req, res) => {
    const { id } = req.params;
  
   
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID no válido" });
    }
  
    try {
    
      const cancion = await Canciones.findById(id);
  
      if (!cancion) {
        return res.status(404).json({ message: "Canción no encontrada" });
      }
  
     
      res.status(200).json(cancion);
    } catch (error) {
      console.error("Error al obtener la canción", error.message);
      res.status(500).json({ message: "Error al obtener la canción.", error: error.message });
    }
  };
  
  export const Actualizar = async (req, res) => {
    const { id } = req.params; 
    const { cantante, cancion, album, genero } = req.body;
  
    try {
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID no válido" });
      }
  
  
      const cancionActualizada = await Canciones.findByIdAndUpdate(
        id,
        { cantante, cancion, album, genero },
        { new: true } 
      );
  
      if (!cancionActualizada) {
        return res.status(404).json({ message: "Canción no encontrada" });
      }
  
      res.status(200).json(cancionActualizada);
    } catch (error) {
      console.error("Error al actualizar la canción", error.message);
      res.status(500).json({ message: "Error al actualizar la canción.", error: error.message });
    }
  };
  
  export const Eliminar = async (req, res) => {
    const { id } = req.params;
  
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID no válido" });
    }
  
    try {

      const cancionEliminada = await Canciones.findByIdAndDelete(id);
  
      if (!cancionEliminada) {
        return res.status(404).json({ message: "Canción no encontrada" });
      }
  
      res.status(200).json({ message: "Canción eliminada con éxito" });
    } catch (error) {
      console.error("Error al eliminar la canción", error.message);
      res.status(500).json({ message: "Error al eliminar la canción.", error: error.message });
    }
  };
  
  export default { Crear, ObtenerTodas, ObtenerPorId, Actualizar, Eliminar };