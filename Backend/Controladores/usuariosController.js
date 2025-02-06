import Usuario from "../Modelos/usuariosModelos.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
  } catch (error) {
    res.status(401).json({ message: 'Token no válido.' });
  }
};

export default { Registro, login, tokenValido };

