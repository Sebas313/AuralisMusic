import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid'; 

dotenv.config(); 

const app = express();
app.use(express.json()); 

// Configurar el transporter de nodemailer
const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  port: process.env.email_port,
  host: process.env.email_host,
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
  const verificationCode = uuidv4();

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Verificación de cuenta', 
    html: `
      <h2>¡Bienvenido!</h2>
      <p>Para activar tu cuenta, por favor haz clic en el siguiente enlace:</p>
      <a href="http://localhost:4200/${verificationCode}">Verificar mi cuenta</a>
      <p>Este enlace es válido solo por 24 horas.</p>
    `,
  };

  try {
    // Intentar enviar el correo
    await transporter.sendMail(mailOptions);
    console.log('Correo de verificación enviado a:', email);
    
    // Si el correo se envió correctamente, pasamos al siguiente middleware
    next();
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return res.status(500).json({ error: 'Hubo un problema al enviar el correo de verificación.' });
  }
};

// Ruta de registro con middleware
app.post('/Registro', sendVerificationEmailMiddleware, (req, res) => {
  // Si llega hasta aquí, significa que el correo fue enviado correctamente
  res.status(200).json({ message: 'Usuario registrado y correo de verificación enviado.' });
});

export default sendVerificationEmailMiddleware