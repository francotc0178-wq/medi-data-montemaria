const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
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
app.use(express.static('public')); // Carpeta para renderizar index.html

// Base de Datos Simulada en Memoria (Sustituir por MongoDB / PostgreSQL en producción)
let baseDeDatosFichas = [];

// API: Guardar datos y adjuntos en el Servidor
app.post('/api/fichas', upload.single('documentoAdjunto'), (req, res) => {
  try {
    const nuevaFicha = {
      id: Date.now(),
      rut: req.body.rut,
      nombre: req.body.nombre,
      fechaNacimiento: req.body.fechaNacimiento,
      genero: req.body.genero,
      email: req.body.email,
      telefono: req.body.telefono,
      antecedentes: req.body.antecedentes,
      alergias: req.body.alergias,
      medicamentos: req.body.medicamentos,
      adjuntoPath: req.file ? req.file.path : null,
      fechaRegistro: new Date()
    };

    baseDeDatosFichas.push(nuevaFicha);
    res.status(201).json({ mensaje: 'Ficha médica guardada con éxito', ficha: nuevaFicha });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno en el servidor', error });
  }
});

// API: Consultar todas las fichas almacenadas (Permite revisar desde cualquier lugar)
app.get('/api/fichas', (req, res) => {
  res.json(baseDeDatosFichas);
});

// API: Enviar PDF a correo electrónico registrado
app.post('/api/enviar-pdf', async (req, res) => {
  const { email, pdfData } = req.body;

  // Configurar servidor SMTP de correo (Ejemplo: Gmail, SendGrid, etc.)
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'francotc0178@gmail.com', 
      pass: 'tvks qymw zfej bhpx' 
    }
  });

  try {
    await transporter.sendMail({
      from: '"MediData MonteMaría" <tu_correo_emisor@gmail.com>',
      to: email,
      subject: 'Ficha Médica Registrada - MediData MonteMaría',
      text: 'Adjunto encontrarás el documento PDF con los datos de tu ficha médica.',
      attachments: [
        {
          filename: 'Ficha_Medica.pdf',
          path: pdfData // Base64 del archivo PDF
        }
      ]
    });

    res.status(200).json({ mensaje: 'Correo enviado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error enviando el correo', error });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor "MediData MonteMaría" escuchando en el puerto ${PORT}`);
});