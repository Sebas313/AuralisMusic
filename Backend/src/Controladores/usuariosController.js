import Usuario from "../Modelos/usuariosModelos.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import Cantante from "../Modelos/cantanteModelos.js";

 const Registro = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: "El correo ya está registrado." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const NuevoUsuario = new Usuario({ nombre, email, password: hashedPassword, rol: rol || "usuario" });
    await NuevoUsuario.save();

    res.status(201).json({ message: "Usuario Registrado", usuario: { id: NuevoUsuario._id, nombre, email, rol: NuevoUsuario.rol } });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

 const login = async (req, res) => {
  try {
   
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email y contraseña son requeridos." });

    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(401).json({ message: "Credenciales incorrectas." });

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) return res.status(401).json({ message: "Credenciales incorrectas." });

    const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ 
      message: "Inicio de sesión exitoso.", 
      token, 
      user: { 
        _id: usuario._id, 
        nombre: usuario.nombre, 
        email: usuario.email, 
        rol: usuario.rol 
      } 
    });
      } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

 const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
};

 const obtenerUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "ID no válido" });
    const usuario = await Usuario.findById(id).populate("playlists");
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
    res.status(200).json(usuario);
  } catch (error) {
    console.error("Error en obtener usuario", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, password } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "ID no válido" });
    let updateData = { nombre, email };
    if (password) updateData.password = await bcrypt.hash(password, 10);
    const usuario = await Usuario.findByIdAndUpdate(id, updateData, { new: true });
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

 const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "ID no válido" });
    const usuario = await Usuario.findByIdAndDelete(id);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
    res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

 const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "ID no válido" });
    const user = await Usuario.findById(id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    user.rol = role;
    await user.save();
    if (role === "cantante") {
      let cantanteExistente = await Cantante.findOne({ cantante: user.nombre });
      if (!cantanteExistente) {
        const nuevoCantante = new Cantante({ cantante: user.nombre, canciones: [], avatar: user.avatar || null });
        await nuevoCantante.save();
      }
    }
    res.json({ message: "Rol actualizado con éxito", user });
  } catch (error) {
    console.error("Error al actualizar el rol:", error);
    res.status(500).json({ error: "Error al actualizar el rol" });
  }
};
export default { Registro,
   login, 
   obtenerUsuarios,
    obtenerUsuario,
     actualizarUsuario,
      eliminarUsuario, 
      updateUserRole };
