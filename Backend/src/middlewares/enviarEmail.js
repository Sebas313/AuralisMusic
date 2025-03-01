import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'; // Importar JWT
import User from '../Modelos/usuariosModelos.js'; // Importa el modelo User desde donde lo tengas

dotenv.config();

const app = express();
app.use(express.json());

// Configurar el transporter de nodemailer
const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  port: process.env.EMAIL_PORT,
  host: process.env.EMAIL_HOST,
  requireTLS: true,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Middleware para enviar correo de verificación
const sendVerificationEmailMiddleware = async (req, res, next) => {
  const { email } = req.body;

  // Generar token JWT válido por 24 horas
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });

  const backendUrl = process.env.NODE_ENV === "production"
    ? process.env.BACKEND_URL_PROD
    : process.env.BACKEND_URL_LOCAL;

  // Configuración del correo
  const mailOptions = {
    from: process.env.MAIL_USER, // Usar la dirección de correo desde la variable de entorno
    to: email,
    subject: 'Verificación de cuenta',
    html: `
      <div style="max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; text-align: center; font-family: Arial, sans-serif; border: 1px solid #ddd;">
        <h2 style="color: #B2A179;">¡Bienvenido!</h2>
        <p>Gracias por registrarte. Para activar tu cuenta, haz clic en el botón:</p>
        
        <a href="${backendUrl}/Api/verificar/${encodeURIComponent(token)}"
          style="display: inline-block; background-color: #B2A179; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
          Verificar mi cuenta
        </a>

        <p style="color: #666; font-size: 14px;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
        <p style="color: #007BFF; word-wrap: break-word;">
          ${backendUrl}/Api/verificar/${encodeURIComponent(token)}
        </p>

        <p style="color: #666; font-size: 14px;">Este enlace es válido por <strong>24 horas</strong>.</p>
      </div>
    `,
  };

  try {
    // Enviar correo
    await transporter.sendMail(mailOptions);
    console.log('Correo de verificación enviado a:', email);
    next();
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return res.status(500).json({ error: 'Error al enviar el correo de verificación.' });
  }
};

// Ruta de registro con middleware
app.post('/Registro', sendVerificationEmailMiddleware, async (req, res) => {
  // Aquí puedes registrar al usuario, lo cual no estaba en el código original, solo se muestra el correo de verificación.
  // Supongo que el registro ya se maneja en otra parte, por lo que solo se envía el correo de verificación aquí.
  res.status(200).json({ message: 'Usuario registrado y correo enviado.' });
});

// Ruta para verificar el token cuando el usuario hace clic en el enlace
app.get('/verificar/:token', async (req, res) => {
  const { token } = req.params;
  try {
    // Verificar si el token es válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar al usuario con el correo del token
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado. El correo podría no estar registrado.' });
    }

    // Verificar si ya está verificado
    if (user.isVerified) {
      return res.status(200).json({ message: 'Tu cuenta ya está verificada.' });
    }

    // Marcar al usuario como verificado
    user.isVerified = true;
    await user.save();

    const frontendUrl = process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL_PROD
      : process.env.FRONTEND_URL_LOCAL;

      return res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);


  } catch (error) {
    return res.status(400).json({ message: 'Token inválido o expirado.' });
  }
});


console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("Redirigiendo a:", process.env.FRONTEND_URL_LOCAL);


export default sendVerificationEmailMiddleware;
