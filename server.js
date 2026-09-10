const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS y Límites de Payload elevados a 100MB
app.use(cors());
app.use(express.json({ limit: '100mb', extended: true }));
app.use(express.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 }));

// Inicialización de cliente Resend desde variable de entorno
const resend = new Resend(process.env.RESEND_API_KEY || 're_fallback');

// Ruta de estado del servidor
app.get('/', (req, res) => {
  res.send('Servidor MediData MonteMaría funcionando correctamente.');
});

// Endpoint principal para recibir y despachar el PDF
app.post('/api/enviar-pdf', async (req, res) => {
  const { email, pdfData } = req.body;

  // Validación de entrada
  if (!email || !pdfData) {
    return res.status(400).json({ 
      success: false, 
      error: 'Faltan datos requeridos (email o pdfData).' 
    });
  }

  try {
    // Limpieza del string Base64 si incluye el prefijo data URI
    const base64Clean = pdfData.includes(';base64,') 
      ? pdfData.split(';base64,').pop() 
      : pdfData;

    // Envío del correo con archivo adjunto vía Resend API
    const response = await resend.emails.send({
      from: 'MediData MonteMaría <onboarding@resend.dev>',
      to: email,
      replyTo: 'francotc0178@gmail.com',
      subject: 'Ficha Médica Registrada - MediData MonteMaría',
      html: '<p>Adjunto encontrarás el documento PDF correspondiente a la ficha médica registrada.</p>',
      attachments: [
        {
          filename: 'Ficha_Medica.pdf',
          content: base64Clean,
        },
      ],
    });

    // Control de errores informados por la API de Resend
    if (response.error) {
      console.error('Error reportado por Resend:', response.error);
      return res.status(400).json({ 
        success: false, 
        error: response.error.message || 'Error al despachar el correo.' 
      });
    }

    console.log('Correo enviado con éxito:', response.data?.id || response);
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

// Inicio del servicio
app.listen(PORT, () => {
  console.log(`Servidor activo escuchando en el puerto ${PORT}`);
});
