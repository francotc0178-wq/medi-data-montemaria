const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;

// Inicialización de la API de Resend
// Reemplaza 're_TU_API_KEY_AQUI' con tu clave real obtenida en Resend
const resend = new Resend('re_TU_API_KEY_AQUI');

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor MediData MonteMaría funcionando correctamente.');
});

// Endpoint para consultar fichas (si aplica)
app.get('/api/fichas', (req, res) => {
  res.json([]);
});

// Endpoint principal para recibir y enviar el PDF por correo
app.post('/api/enviar-pdf', async (req, res) => {
  const { email, pdfData } = req.body;

  // Validación de campos requeridos
  if (!email || !pdfData) {
    return res.status(400).json({ 
      success: false, 
      error: 'Faltan datos requeridos (email o pdfData).' 
    });
  }

  try {
    // Limpieza de cabecera Base64 si viene del navegador
    const base64Clean = pdfData.includes(';base64,') 
      ? pdfData.split(';base64,').pop() 
      : pdfData;

    // Petición de envío mediante la API HTTP de Resend
    const { data, error } = await resend.emails.send({
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

    // Manejo de errores devueltos por la API de Resend
    if (error) {
      console.error('Error devuelto por Resend:', error);
      return res.status(400).json({ 
        success: false, 
        error: error.message || 'Error al despachar el correo.' 
      });
    }

    // Respuesta exitosa al cliente (Netlify)
    console.log('Correo enviado con éxito. ID:', data.id);
    return res.status(200).json({ 
      success: true, 
      message: 'Correo enviado con éxito',
      id: data.id 
    });

  } catch (error) {
    console.error('Error interno del servidor:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Error interno del servidor.' 
    });
  }
});

// Inicio del servidor Express
app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});
