import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'; // Importar JWT
import { v4 as uuidv4 } from 'uuid'; // UUID para identificar cada token

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

  
  const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
  // Configuración del correo
  const mailOptions = {
    from: process.env.MAIL_USER,
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
app.post('/Registro', sendVerificationEmailMiddleware, (req, res) => {
  res.status(200).json({ message: 'Usuario registrado y correo enviado.' });
});

// ✅ Ruta para verificar el token cuando el usuario hace clic en el enlace
app.get('/verificar', async (req, res) => {
  const { token } = req.query;

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar al usuario por email y actualizar "isVerified"
    const user = await Usuario.findOneAndUpdate(
      { email: decoded.email },
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado.' });
    }

    console.log("✅ Usuario verificado:", user.email);

    // 🔥 Generar un nuevo token de sesión para el usuario
    const newToken = jwt.sign(
      { email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' } // Token válido por 2 horas
    );

    // Enviar el nuevo token al frontend
    res.json({ success: true, token: newToken });

  } catch (error) {
    console.error('❌ Token inválido o expirado:', error);
    res.status(400).json({ msg: 'El enlace de verificación no es válido o ha expirado.' });
  }
});


export default sendVerificationEmailMiddleware;
