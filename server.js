const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de almacenamiento para archivos adjuntos subidos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

// Base de Datos Simulada en Memoria
let baseDeDatosFichas = [];

app.get('/api/fichas', (req, res) => {
  res.json(baseDeDatosFichas);
});

// API: Enviar PDF a correo electrónico registrado
app.post('/api/enviar-pdf', async (req, res) => {
  const { email, pdfData } = req.body;

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: 'francotc0178@gmail.com',
      pass: 'cvwfmmmladatdbtu'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    await transporter.sendMail({
      from: '"MediData MonteMaría" <francotc0178@gmail.com>',
      to: email,
      subject: 'Ficha Médica Registrada - MediData MonteMaría',
      text: 'Adjunto encontrarás el documento PDF con los datos de tu ficha médica.',
      attachments: [
        {
          filename: 'ficha_medica.pdf',
          content: pdfData.split(';base64,').pop(),
          encoding: 'base64'
        }
      ]
    });

    res.status(200).json({ success: true, message: 'Correo enviado con éxito' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
