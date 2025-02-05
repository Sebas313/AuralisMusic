
import mongoose from "mongoose"
const usuarioSchema = new mongoose.Schema({

    nombre : String,
    email : String,
    password: String



})

export default Usuario;



