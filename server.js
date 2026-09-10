const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;

// Utiliza la variable de entorno de Render o una clave directa si existe
const apiKey = process.env.RESEND_API_KEY || 're_AQUI_TU_API_KEY';
const resend = new Resend(apiKey);

// Middleware con límites ampliados
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Ruta de estado
app.get('/', (req, res) => {
  res.send('Servidor MediData MonteMaría funcionando correctamente.');
});

// Endpoint principal
app.post('/api/enviar-pdf', async (req, res) => {
  const { email, pdfData } = req.body;

  if (!email || !pdfData) {
    return res.status(400).json({ success: false, error: 'Faltan datos requeridos.' });
  }

  try {
    const base64Clean = pdfData.includes(';base64,') 
      ? pdfData.split(';base64,').pop() 
      : pdfData;

    const result = await resend.emails.send({
      from: 'MediData <onboarding@resend.dev>',
      to: email,
      subject: 'Ficha Médica Registrada - MediData MonteMaría',
      html: '<p>Adjunto encontrarás el documento PDF con los datos de tu ficha médica.</p>',
      attachments: [
        {
          filename: 'ficha_medica.pdf',
          content: base64Clean,
        },
      ],
    });

    if (result.error) {
      console.error('Error de Resend:', result.error);
      return res.status(400).json({ success: false, error: result.error.message });
    }

    return res.status(200).json({ success: true, message: 'Correo enviado con éxito' });

  } catch (error) {
    console.error('Error interno:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});
