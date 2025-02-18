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
  <div style="max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; text-align: center; font-family: Arial, sans-serif; border: 1px solid #ddd;">
  
  <!-- Logo -->
  <div style="margin-bottom: 20px;">
    <img src="../public/uploads/logo.png" alt="Logo" style="max-width: 150px;">
  </div>

  <h2 style="color: #B2A179;">¡Bienvenido!</h2>
  
  <p style="color: #333; font-size: 16px;">
    Gracias por registrarte. Para activar tu cuenta, haz clic en el siguiente botón:
  </p>

  <a href="http://localhost:4200/${verificationCode}" 
     style="display: inline-block; background-color: #B2A179; color: #fff; padding: 12px 20px; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 5px; margin-top: 10px;">
    Verificar mi cuenta
  </a>

  <p style="color: #666; font-size: 14px; margin-top: 20px;">
    Este enlace es válido solo por <strong>24 horas</strong>.
  </p>

  <hr style="margin: 20px 0; border: 0.5px solid #ddd;">
  
  <p style="color: #999; font-size: 12px;">
    Si no te has registrado en nuestro sitio, puedes ignorar este correo.
  </p>
</div>

     
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