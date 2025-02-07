import Usuario from "../Modelos/usuariosModelos.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import mongoose from "mongoose";

export const Registro = async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    const NuevoUsuario = new Usuario({
      nombre,
      email,
      password,
    });

    //validaciones que hay que corregir

    // if (post.nombre == undefined || post.nombre == null || post.nombre == "") {
    //   response.json({
    //     state: false,
    //     mensaje: "el campo nombre es oblogatorio",
    //   });
    //   return false;
    // }

    // if (post.email == undefined || post.email == null || post.email == "") {
    //   response.json({ state: false, mensaje: "el campo email es oblogatorio" });
    //   return false;
    // }

    // const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (regex.test(post.email) == false) {
    //   response.json({ state: false, mensaje: "el email no es valido" });
    //   return false;
    // }

    // if (
    //   post.password == undefined ||
    //   post.password == null ||
    //   post.password == ""
    // ) {
    //   response.json({
    //     state: false,
    //     mensaje: "el campo password es oblogatorio",
    //   });
    //   return false;
    // }

    await NuevoUsuario.save();
    res.status(201).json("Usuario Registrado");
  } catch (error) {
    console.error("Error al registrar el usuario", error.message);
    res.status(500).json({ message: "Error al registrar el usuario.", error:error.message })
  }
};

export const login = async (req, res) => {
    try{
        const {nombre, email, password}= req.body;
        // Validar los campos requeridos

        //  // Buscar al usuario en la base de datos
    const usuario = await Usuario.findOne({ email });

    //Dejar que se puede leer el id de mongo
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID no válido" });
    }

    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
      }

// Si no se encuentra el usuario, retorna un error
    if (!usuario) {
        return res.status(401).json({ message: 'Credenciales incorrectas.' });
      }

      // Comparar contraseñas
    const validacionContraseña = bcrypt.compare(password, usuario.password);

      // Si la contraseña no coincide, retorna un error
    if (!validacionContraseña) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }
    
// Generar un token JWT con expiración
const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Expira en 1 hora
res.json({token});

// // Responder los datos del usuario
// res.status(200).json({
//   message: 'Inicio de sesión exitoso.',
//   token,
//   user: {
//     nombre: usuario.nombre,
//     email: usuario.email,
//   },
// });
} catch (error) {
res.status(500).json({ message: 'error interno del servidor, no se envio el token' });
}
};

// Validación del token
export const tokenValido = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Obtiene solo el token de 'Bearer token'
  
    if (!token) return res.status(401).json({ message: 'No se proporcionó token, autorización denegada.' });
  
    try {
      const verificado = jwt.verify(token, process.env.JWT_SECRET);
      req.usuario = verificado;
      next();
      res.status(200).json({ valid: true });
    } catch (error) {
      res.status(401).json({ message: 'Token no válido.' });
    }
  }; 

export const obtenerUsuarios = async(req, res)=>{
    try{
      const usuarios = await Usuario.find();
      res.status(200).json(usuarios)
    } catch(error){
      res.status(500).json({message: "Error al obtener los usuarios"})
    }
  };
export const obtenerUsuario = async(req,res) =>{
  try{
    //Dejar que se puede leer el id de mongo
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID no válido" });
    }
    const usuario = await Usuario.findById(req.params.id);
    if(!usuario) return res.status(404).json({message: "Usuario no encontrado"})
      res.status(200).json(usuario)
  }catch(error){
res.status(500).json({message:"Error interno del servidor"})
}
}
export const actualizarUsuario = async(req,res)=>{
  try{
    //Dejar que se puede leer el id de mongo
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID no válido" });
    }
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, {new:true})
    if(!usuario) return res.status(404).json({message:"Usuario no encontrado"})
    res.status(200).json(usuario);
  }catch(error){
    res.status(500).json({message:"Error interno del servidor"})
  }
}
export const eliminarUsuario = async (req,res)=>{
  try {
    console.log("ID recibido", req.params.id);
    const { id } = req.params;
    console.log("ID perdido", req. params.id);
    //Dejar que se puede leer el id de mongo
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID no válido" });
    }
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if(!usuario) return res.status(404).json({message:"Usuario no encontrado"});
    res.status(200).json({message: "Usuario eliminado"});
  } catch (error) {
    res.status(500).json({message:"Error interno del servidor"});
  }
}
export default { 
  Registro,
  login,
   tokenValido,
   obtenerUsuarios,
   obtenerUsuario,
   eliminarUsuario,
   actualizarUsuario 
  };
