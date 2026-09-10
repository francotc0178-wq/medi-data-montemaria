const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;

// Inicialización de la API de Resend mediante Variable de Entorno
const resend = new Resend(process.env.RESEND_API_KEY || 're_fallback');

// Configuración de límites y CORS
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor MediData MonteMaría activo.');
});

// Endpoint principal para enviar el PDF
app.post('/api/enviar-pdf', async (req, res) => {
  const { email, pdfData } = req.body;

  if (!email || !pdfData) {
    return res.status(400).json({ 
      success: false, 
      error: 'Faltan datos requeridos (email o pdfData).' 
    });
  }

  try {
    // Limpieza de cabecera Base64
    const base64Clean = pdfData.includes(';base64,') 
      ? pdfData.split(';base64,').pop() 
      : pdfData;

    // Despacho del correo a través de Resend
    const response = await resend.emails.send({
      from: 'MediData MonteMaría <onboarding@resend.dev>',
      to: email,
      replyTo: 'francotc0178@gmail.com',
      subject: 'Ficha Médica Registrada - MediData MonteMaría',
      html: '<p>Adjunto encontrarás la ficha médica solicitada.</p>',
      attachments: [
        {
          filename: 'Ficha_Medica.pdf',
          content: base64Clean,
        },
      ],
    });

    if (response.error) {
      console.error('Error reportado por Resend:', response.error);
      return res.status(400).json({ 
        success: false, 
        error: response.error.message 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Correo enviado con éxito' 
    });

  } catch (error) {
    console.error('Error interno del servidor:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Error interno del servidor.' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
