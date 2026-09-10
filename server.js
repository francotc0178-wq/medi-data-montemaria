const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '100mb', extended: true }));
app.use(express.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 }));

const resend = new Resend(process.env.RESEND_API_KEY || 're_fallback');

app.get('/', (req, res) => {
  res.send('Servidor activo');
});

app.post('/api/enviar-pdf', async (req, res) => {
  const { email, pdfData } = req.body;

  if (!email || !pdfData) {
    return res.status(400).json({ success: false, error: 'Faltan datos requeridos.' });
  }

  try {
    const base64Clean = pdfData.includes(';base64,') 
      ? pdfData.split(';base64,').pop() 
      : pdfData;

    // IMPORTANTE: En el plan gratuito de Resend, 'to' DEBE SER el mismo correo con el que te registraste en Resend.
    const response = await resend.emails.send({
      from: 'MediData <onboarding@resend.dev>',
      to: [email], // Si falla, reemplaza temporalmente aquí por tu correo de registro de Resend
      subject: 'Ficha Médica Registrada - MediData MonteMaría',
      html: '<p>Adjunto encontraras la ficha médica.</p>',
      attachments: [
        {
          filename: 'ficha_medica.pdf',
          content: base64Clean,
        },
      ],
    });

    if (response.error) {
      console.error('Error detallado de Resend:', response.error);
      return res.status(400).json({ success: false, error: response.error.message });
    }

    return res.status(200).json({ success: true, message: 'Correo enviado con éxito' });

  } catch (error) {
    console.error('Error del servidor:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Puerto ${PORT}`);
});
