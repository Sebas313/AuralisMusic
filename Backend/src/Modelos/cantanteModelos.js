import mongoose from "mongoose";

const cantanteSchema = new mongoose.Schema({
    nombre: String,
    genero: String,
    canciones: String,
    avatar: String,

})

const Cantante = mongoose.model("Cantante", cantanteSchema);

export default Cantante;