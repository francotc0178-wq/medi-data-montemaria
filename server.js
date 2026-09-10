const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'francotc0178@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

app.get('/', (req, res) => {
  res.send('Servidor activo.');
});

app.post('/api/enviar-pdf', async (req, res) => {
  const { email, nombre, rut, datos } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'El correo es obligatorio.' });
  }

  try {
    const mailOptions = {
      from: '"MediData MonteMaría" <francotc0178@gmail.com>',
      to: email,
      subject: `Ficha Médica - ${nombre || 'Paciente'} (${rut || 'Sin RUT'})`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #1e40af;">Ficha Médica Registrada</h2>
          <p><strong>Paciente:</strong> ${nombre || 'N/A'}</p>
          <p><strong>RUT:</strong> ${rut || 'N/A'}</p>
          <hr />
          <p><strong>Detalles registrados:</strong></p>
          <p>${datos || 'Registro completado exitosamente.'}</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Correo enviado con éxito.' });

  } catch (error) {
    console.error('Error al enviar:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
