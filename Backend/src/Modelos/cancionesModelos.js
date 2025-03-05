import mongoose from "mongoose"

const cancionesSchema = new mongoose.Schema({
    cantante: {type:mongoose.Schema.Types.ObjectId, ref:"Cantante", requiered:true},
    cancion: String,
    album: String,
    genero: String,
    imagen: { type: String },  
    fileUrl: { type: String, required: true } 
  });


const Canciones = mongoose.model("Canciones", cancionesSchema)

export default Canciones;








