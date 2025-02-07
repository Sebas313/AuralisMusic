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

    await NuevoUsuario.save();
    res.status(201).json("Usuario Registrado");
  } catch (error) {
    console.error("Error al registrar el usuario", error.message);
    res.status(500).json({ message: "Error al registrar el usuario.", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Dejar que se puede leer el id de mongo
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID no válido" });
    }

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
    }

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const isMatch = await bcrypt.compare(password, usuario.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      token,
      user: {
        nombre: usuario.nombre,
        email: usuario.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor, no se pudo enviar el token.' });
  }
};

export const tokenValido = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  
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

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = verificado;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token no válido.' });
  }
};



