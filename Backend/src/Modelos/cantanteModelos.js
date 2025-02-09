import mongoose from "mongoose";

const cantanteSchema = new mongoose.Schema({
    nombre: String,
    genero: String,
    canciones: {type:mongoose.Schema.Types.ObjectId, ref:"Canciones", requiered:true},

})

const Cantante = mongoose.model("Cantante", cantanteSchema);

export default Cantante;