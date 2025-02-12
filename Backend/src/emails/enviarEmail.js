import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid'; 


dotenv.config(); 

const app = express();
app.use(express.json()); 

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE, 
  auth: {
    user: process.env.MAIL_USER, 
    pass: process.env.MAIL_PASS   
  }
});


const sendVerificationEmail = async (userEmail) => {
  
  const verificationCode = uuidv4();

  const mailOptions = {
    from: process.env.MAIL_USER,   
    to: userEmail,                
    subject: 'Verificación de cuenta', 
    html: `
      <h2>¡Bienvenido!</h2>
      <p>Para activar tu cuenta, por favor haz clic en el siguiente enlace:</p>
      <a href="https://tusitio.com/verificar/${verificationCode}">Verificar mi cuenta</a>
      <p>Este enlace es válido solo por 24 horas.</p>
    ` // El código de verificación se incluye en el enlace
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo de verificación enviado a:', userEmail);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};


app.post('/Registro', async (req, res) => {
  const { email } = req.body; 
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: 'Correo electrónico inválido.' });
  }

  

  try {
    await sendVerificationEmail(email);
    res.status(200).json({ message: 'Usuario registrado y correo de verificación enviado.' });
  } catch (error) {
    res.status(500).json({ error: 'Hubo un problema al enviar el correo de verificación.' });
  }
});


app.listen(3000, () => {
  console.log('Servidor escuchando en puerto 3000');
});
