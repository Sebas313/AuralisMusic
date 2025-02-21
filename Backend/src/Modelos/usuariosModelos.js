import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  password: String,
  avatar: {
    type: String,
    default: null  
  },
  playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Playlist" }],
  rol: {
    type: String,
    enum: ["administrador", "usuario", "cantante"],
    default: "usuario",
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  }, // 👈 Agregamos este campo para manejar la verificación de email
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;
