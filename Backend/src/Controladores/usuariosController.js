import Usuario from "../Modelos/usuariosModelos.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export const Registro = async (req, res) => {
  try {
    console.log("Datos recibidos en el registro:", req.body); // 👈 Agregado para depuración

    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: "El correo ya está registrado." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const NuevoUsuario = new Usuario({
      nombre,
      email,
      password: hashedPassword,
    });

    await NuevoUsuario.save();

    res.status(201).json({
      message: "Usuario Registrado",
      usuario: {
        id: NuevoUsuario._id,
        nombre: NuevoUsuario.nombre,
        email: NuevoUsuario.email,
      },
    });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res.status(500).json({ message: "Error al registrar el usuario.", error: error.message });
  }
};


export const login = async (req, res) => {
  try {
    console.log("Datos recibidos en login:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son requeridos." });
    }

    const usuario = await Usuario.findOne({ email });

    console.log("Usuario encontrado en BD:", usuario);

    if (!usuario) {
      return res.status(401).json({ message: "Credenciales incorrectas." });
    }

    console.log("Password almacenada en BD:", usuario.password);

    const isMatch = await bcrypt.compare(password, usuario.password);

    console.log("¿Contraseña válida?:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales incorrectas." });
    }

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    console.log("Token generado correctamente:", token);

    res.status(200).json({
      message: "Inicio de sesión exitoso.",
      token,
      user: {
        nombre: usuario.nombre,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error interno del servidor, no se pudo enviar el token." });
  }
};

export const tokenValido = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'No se proporcionó token, autorización denegada.' });

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = verificado;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token no válido.' });
  }
};

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
};

export const obtenerUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID no válido" });
    }
    const usuario = await Usuario.findById(id);
    if (!usuario) {return res.status(404).json({ message: "Usuario no encontrado" });}

    res.status(200).json(usuario);
  } catch (error) {
    console.error("Error en obtener usuario", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const {nombre,email,password} = req.body
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID no válido" });
    }
    const usuario = await Usuario.findByIdAndUpdate(id, {nombre,email,password}, { new: true });
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID recibido", id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID no válido" });
    }
    const usuario = await Usuario.findByIdAndDelete(id);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
    res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default {
  Registro,
  login,
  tokenValido,
  obtenerUsuarios,
  obtenerUsuario,
  eliminarUsuario,
  actualizarUsuario,
};