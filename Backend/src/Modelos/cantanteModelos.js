import mongoose from "mongoose";

const cantanteSchema = new mongoose.Schema({
    cantante: { type: String, required: true, unique: true }, // 🔥 Ahora es "cantante"
    genero: { type: String, required: true },
    canciones: [{ type: mongoose.Schema.Types.ObjectId, ref: "Canciones" }], // 🔥 Cambiado a un array de referencias
    avatar: { type: String }
});

const Cantante = mongoose.model("Cantante", cantanteSchema);
export default Cantante;
