import mongoose from "mongoose";

const cantanteSchema = new mongoose.Schema({
    cantante: { type: String, required: true, unique: true },
    canciones: [{ type: mongoose.Schema.Types.ObjectId, ref: "Canciones" }], 
    avatar: { type: String }
});

const Cantante = mongoose.model("Cantante", cantanteSchema);
export default Cantante;
