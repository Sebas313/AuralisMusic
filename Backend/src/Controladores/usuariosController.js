import Usuario from "../Modelos/usuariosModelos.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

import Cantante from "../Modelos/cantanteModelos.js"; 

export const Registro = async (req, res) => {
  try {
    console.log("Datos recibidos en el registro:", req.body); // 👈 Agregado para depuración

    const { nombre, email, password, rol } = req.body;

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
      rol: rol || "usuario",
    });

    await NuevoUsuario.save();

    res.status(201).json({
      message: "Usuario Registrado",
      usuario: {
        id: NuevoUsuario._id,
        nombre: NuevoUsuario.nombre,
        email: NuevoUsuario.email,
        rol: NuevoUsuario.rol,
      },
    });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res.status(500).json({ message: "Error al registrar el usuario.", error: error.message });
  }
};
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params; // ✅ Obtener token de los parámetros

    if (!token) {
      return res.status(400).json({ msg: "Token no proporcionado" });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Verificar si el usuario existe
    const user = await Usuario.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    if (user.isVerified) {
      return res.status(400).json({ msg: "La cuenta ya está verificada" });
    }

    // Actualizar usuario como verificado
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    // 🔥 Si la solicitud viene de Angular (acepta JSON), responder con JSON
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.json({
        success: true,
        msg: "Cuenta verificada correctamente",
        user: {
          email: user.email,
          isVerified: user.isVerified
        }
      });
    }

    // 🔄 Si la solicitud viene del navegador (correo electrónico), redirigir al frontend
    res.redirect("/login?verified=true");

  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: "Token inválido o expirado" });
  }
};
export const login = async (req, res) => {
  try {
    console.log("📥 Datos recibidos en login:", req.body);

    const { email, password } = req.body;

    // 🔍 Validar que se envíen email y contraseña
    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son requeridos." });
    }

    // 🔎 Buscar usuario en la base de datos
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      console.log("❌ Usuario no encontrado.");
      return res.status(401).json({ message: "Credenciales incorrectas." });
    }

    console.log("✅ Usuario encontrado en BD:", usuario);

    // 🔐 Verificar si el usuario ya confirmó su correo
    if (!usuario.isVerified) {
      console.log("⚠ Usuario no verificado:", usuario.email);
      return res.status(403).json({ message: "Debes verificar tu correo antes de iniciar sesión." });
    }

    console.log("🔑 Contraseña ingresada:", password);
    console.log("🔑 Contraseña almacenada en BD:", usuario.password);

    // 🔑 Verificar si la contraseña es correcta
    const isMatch = await bcrypt.compare(password, usuario.password);

    console.log("✅ ¿Contraseña válida?:", isMatch);

    if (!isMatch) {
      console.log("❌ Contraseña incorrecta.");
      return res.status(401).json({ message: "Credenciales incorrectas." });
    }

    // 📌 Verificar si el usuario tiene un rol asignado
    const rol = usuario.rol || "usuario"; // Si no tiene rol, asignamos 'usuario' por defecto
    console.log("👤 Rol del usuario:", rol);

    // 🛡 Generar token con el ID y el rol del usuario
    const token = jwt.sign({ id: usuario._id, rol: rol }, process.env.JWT_SECRET, { expiresIn: "1h" });

    console.log("🔑 Token generado correctamente:", token);

    // ✅ Respuesta con datos del usuario
    res.status(200).json({
      message: "Inicio de sesión exitoso.",
      token,
      user: {
        _id: usuario._id, 
        nombre: usuario.nombre,
        email: usuario.email,
        rol: rol,
        isVerified: usuario.isVerified,
      },
    });

  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ message: "Error interno del servidor, no se pudo procesar la solicitud." });
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

   
    const usuario = await Usuario.findById(id).populate("playlists");  

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

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

export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  console.log("ID recibido:", id);
  console.log("Rol recibido:", role);

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID no válido" });
    }

    const user = await Usuario.findById(id);
    console.log("Usuario encontrado:", user);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    user.rol = role;
    await user.save();

    // Si el usuario se convierte en "cantante", crearlo si no existe
    if (role === "cantante") {
      let cantanteExistente = await Cantante.findOne({ cantante: user.nombre });

      if (!cantanteExistente) {
        const nuevoCantante = new Cantante({
          cantante: user.nombre, // Usa el nombre del usuario como nombre de cantante
          canciones: [], // Inicialmente sin canciones
          avatar: user.avatar || null, // Usa el avatar del usuario si tiene
        });

        await nuevoCantante.save();
        console.log("Nuevo cantante creado:", nuevoCantante);
      }
    }

    res.json({ message: "Rol actualizado con éxito", user });
  } catch (error) {
    console.error("Error al actualizar el rol:", error);
    res.status(500).json({ error: "Error al actualizar el rol" });
  }
};



export default {
  Registro,
  login,
  obtenerUsuarios,
  obtenerUsuario,
  eliminarUsuario,
  actualizarUsuario,
  updateUserRole
};