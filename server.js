const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS y Parser Ligero
app.use(cors());
app.use(express.json({ limit: '100mb', extended: true }));
app.use(express.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 }));

// Configuración del servicio de correo con Gmail (Nodemailer)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'francotc0178@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || ''
  }
});

app.get('/', (req, res) => {
  res.send('Servidor MediData MonteMaría activo y listo para procesar envíos.');
});

app.post('/api/enviar-pdf', async (req, res) => {
  const { email, pdfData } = req.body;

  if (!email || !pdfData) {
    return res.status(400).json({ success: false, error: 'Faltan datos obligatorios (email o pdfData).' });
  }

  try {
    // Limpiar el String Base64 de cabeceras
    const base64Clean = pdfData.includes(';base64,') 
      ? pdfData.split(';base64,').pop() 
      : pdfData;

    const mailOptions = {
      from: '"MediData MonteMaría" <francotc0178@gmail.com>',
      to: email,
      subject: 'Ficha Médica Registrada - MediData MonteMaría',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #0056b3;">MediData MonteMaría</h2>
          <p>Estimado/a,</p>
          <p>Adjunto a este correo encontrarás la copia digital de tu <strong>Ficha Médica</strong>.</p>
          <hr style="border: 0; border-top: 1px solid #ccc; margin: 20px 0;">
          <p style="font-size: 12px; color: #777;">Este es un mensaje automático, por favor no responder a esta dirección.</p>
        </div>
      `,
      attachments: [
        {
          filename: 'Ficha_Medica_MonteMaria.pdf',
          content: Buffer.from(base64Clean, 'base64')
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    console.log(`[EXITO] Correo despachado correctamente a: ${email}`);
    return res.status(200).json({ success: true, message: 'Ficha médica enviada exitosamente por correo.' });

  } catch (error) {
    console.error('[ERROR] Fallo al despachar correo:', error);
    return res.status(500).json({ success: false, error: error.message || 'Error en el servidor al enviar el correo.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado correctamente en el puerto ${PORT}`);
});
