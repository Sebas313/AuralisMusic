import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'; // 👉 Importa JWT
import { v4 as uuidv4 } from 'uuid'; 

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
  }
});

// Middleware para enviar correo de verificación
const sendVerificationEmailMiddleware = async (req, res, next) => {
  const { email } = req.body; 

  // 👉 Generar token JWT válido por 24 horas
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Verificación de cuenta', 
    html: `
    <div style="max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; text-align: center; font-family: Arial, sans-serif; border: 1px solid #ddd;">
      <h2 style="color: #B2A179;">¡Bienvenido!</h2>
      <p>Gracias por registrarte. Para activar tu cuenta, haz clic en el botón:</p>
      
      <a href="http://localhost:4200/Api/verificar-email?token=${encodeURIComponent(token)}" 
         style="display: inline-block; background-color: #B2A179; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
        Verificar mi cuenta
      </a>
  
      <p style="color: #666; font-size: 14px;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
      <p style="color: #007BFF; word-wrap: break-word;">http://localhost:4200/verificar?token=${encodeURIComponent(token)}</p>
  
      <p style="color: #666; font-size: 14px;">Este enlace es válido por <strong>24 horas</strong>.</p>
    </div>
  `,
  
  };

  try {   
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
app.get('/verificar', (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 👉 Aquí puedes realizar la lógica para marcar al usuario como "verificado" en la base de datos si es necesario

    // 👉 Redirige al frontend con el token en la URL
    res.redirect(`http://localhost:4200/home?auth=${token}`);
  } catch (error) {
    console.error('Token inválido o expirado:', error);
    res.status(400).send('El enlace de verificación no es válido o ha expirado.');
  }
});

export default sendVerificationEmailMiddleware;
