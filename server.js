const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
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
    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    
    doc.fontSize(20).text('MediData MonteMaría', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Paciente: ${nombre || 'N/A'}`);
    doc.text(`RUT: ${rut || 'N/A'}`);
    doc.moveDown();
    doc.fontSize(12).text(`Detalles Registrados:\n${datos || 'Ficha generada exitosamente.'}`);
    doc.end();

    const pdfBuffer = await new Promise((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)));
    });

    const mailOptions = {
      from: '"MediData MonteMaría" <francotc0178@gmail.com>',
      to: email,
      subject: `Ficha Médica - ${nombre || 'Paciente'}`,
      html: `<p>Estimado/a,</p><p>Se adjunta la ficha médica del paciente <strong>${nombre}</strong>.</p>`,
      attachments: [
        {
          filename: `Ficha_Medica_${rut || 'Paciente'}.pdf`,
          content: pdfBuffer
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Ficha enviada con éxito.' });

  } catch (error) {
    console.error('Error en el servidor:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
