import mongoose from "mongoose"

const cancionesSchema = new mongoose.Schema({
    cantante: {type:mongoose.Schema.Types.ObjectId, ref:"Cantante", requiered:true},
    cancion: String,
    album: String,
    genero: String,
    imagen: { type: String },  // Imagen de la canción (si la tienes)
    fileUrl: { type: String, required: true }  // URL del archivo de audio
  });


const Canciones = mongoose.model("Canciones", cancionesSchema)

export default Canciones;








