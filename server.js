const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS y Límites de Carga Ampliados a 100MB
app.use(cors());
app.use(express.json({ limit: '100mb', extended: true }));
app.use(express.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 }));

// Cliente de Resend
const resend = new Resend(process.env.RESEND_API_KEY || 're_fallback');

app.get('/', (req, res) => {
  res.send('Servidor MediData MonteMaría totalmente operativo.');
});

app.post('/api/enviar-pdf', async (req, res) => {
  const { email, pdfData } = req.body;

  if (!email || !pdfData) {
    return res.status(400).json({ 
      success: false, 
      error: 'Faltan datos requeridos (email o pdfData).' 
    });
  }

  try {
    const base64Clean = pdfData.includes(';base64,') 
      ? pdfData.split(';base64,').pop() 
      : pdfData;

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
      console.error('Error de Resend:', response.error);
      return res.status(400).json({ 
        success: false, 
        error: response.error.message || 'Error en el despacho del correo.' 
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
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
