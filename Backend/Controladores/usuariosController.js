import Usuario from "../Modelos/usuariosModelos.js";
import formulario from "nodemailer";
import jwt from "jsonwebtoken"

export const Registro = async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    const NuevoUsuario = new Usuario({
      nombre,
      email,
      password,
    });

    if (post.nombre == undefined || post.nombre == null || post.nombre == "") {
      response.json({
        state: false,
        mensaje: "el campo nombre es oblogatorio",
      });
      return false;
    }

    if (post.email == undefined || post.email == null || post.email == "") {
      response.json({ state: false, mensaje: "el campo email es oblogatorio" });
      return false;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (regex.test(post.email) == false) {
      response.json({ state: false, mensaje: "el email no es valido" });
      return false;
    }

    if (
      post.password == undefined ||
      post.password == null ||
      post.password == ""
    ) {
      response.json({
        state: false,
        mensaje: "el campo password es oblogatorio",
      });
      return false;
    }

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
    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
      }

      // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, Usuario.password);

      // Si la contraseña no coincide, retorna un error
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }
    
    // Buscar al usuario en la base de datos
    const usuario = await Usuario.findOne({ email })
      

    // Si no se encuentra el usuario, retorna un error
    if (!Usuario) {
        return res.status(401).json({ message: 'Credenciales incorrectas.' });
      }
// Generar un token JWT con expiración
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Expira en 1 hora

// Responder con el token y los datos del usuario
res.status(200).json({
  message: 'Inicio de sesión exitoso.',
  token,
  user: {
    nombre: usuario.nombre,
    email: usuario.email,
  },
});
} catch (error) {
res.status(500).json({ message: 'error interno del servidor, no se envio el token' });
}
};

// Validación del token
export const tokenIsValid = (req, res) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Obtiene solo el token de 'Bearer token'
  
    if (!token) return res.status(401).json({ message: 'No se proporcionó token, autorización denegada.' });
  
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      res.status(200).json({ valid: true });
    } catch (error) {
      res.status(401).json({ message: 'Token no válido.' });
    }
  };    

export default { Registro,login, tokenIsValid };
