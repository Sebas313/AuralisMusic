import mongoose from "mongoose"
const usuarioSchema = new mongoose.Schema({
    cantante: {type:mongoose.Schema.Types.ObjectId, ref:"Cantante", requiered:true},
    cancion: String,
    album: String,
    genero: String,
    imagen: String, 
});

const Canciones = mongoose.model("Canciones", usuarioSchema)

export default Canciones;