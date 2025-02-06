import mongoose from "mongoose"
const usuarioSchema = new mongoose.Schema({
    artista: String,
    cancion: String,
    album: String,
    genero: String,
    id: String
});

const Canciones = mongoose.model("Canciones", usuarioSchema)

export default Canciones;