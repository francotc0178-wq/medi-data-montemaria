[index.html](https://github.com/user-attachments/files/32035794/index.html)
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MediData MonteMaría - Ficha Médica</title>

  <!-- LIBRERÍAS DE ESTILOS Y GENERADOR PDF -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
</head>
<body class="bg-slate-100 font-sans text-gray-800 antialiased p-4 md:p-8">

  <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200" id="ficha-medica-container">
    
    <!-- Encabezado con Logo -->
    <header class="bg-sky-800 text-white p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div class="flex items-center gap-4">
        <img src="https://graph.facebook.com/LiceoTecnologicoMontemaria/picture?type=large" 
             alt="Logo Liceo Tecnológico Monte María" 
             class="w-20 h-20 rounded-full border-2 border-white object-cover bg-white">
        <div>
          <h1 class="text-2xl font-bold">MediData MonteMaría</h1>
          <p class="text-sky-200 text-sm">Sistema Integrado de Ficha Médica de Pacientes</p>
        </div>
      </div>
      <div class="text-right">
        <span class="inline-block bg-sky-900 text-xs px-3 py-1 rounded-full text-sky-100 font-mono" id="fecha-actual"></span>
      </div>
    </header>

    <form id="fichaForm" class="p-6 md:p-8 space-y-8" enctype="multipart/form-data">
      
      <!-- Sección 1: Datos Demográficos -->
      <section>
        <h2 class="text-xl font-bold text-sky-800 border-b-2 border-sky-600 pb-2 mb-4">
          1. Datos Demográficos del Paciente
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold mb-1">RUT del Paciente *</label>
            <input type="text" id="rut" name="rut" placeholder="12.345.678-K" required
                   class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500">
            <p id="rut-error" class="text-red-500 text-xs hidden mt-1">RUT inválido. Formato esperado: 12345678-K</p>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">Nombre Completo *</label>
            <input type="text" id="nombre" name="nombre" required
                   class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500">
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">Fecha de Nacimiento *</label>
            <input type="date" id="fechaNacimiento" name="fechaNacimiento" required
                   class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500">
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">Género</label>
            <select id="genero" name="genero" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500">
              <option value="Femenino">Femenino</option>
              <option value="Masculino">Masculino</option>
              <option value="Otro">Otro / No especificado</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">Correo Electrónico (Para envío de PDF) *</label>
            <input type="email" id="email" name="email" required placeholder="correo@ejemplo.cl"
                   class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500">
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">Teléfono de Contacto</label>
            <input type="tel" id="telefono" name="telefono" placeholder="+56 9 1234 5678"
                   class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500">
          </div>
        </div>
      </section>

      <!-- Sección 2: Antecedentes Médicos -->
      <section>
        <h2 class="text-xl font-bold text-sky-800 border-b-2 border-sky-600 pb-2 mb-4">
          2. Antecedentes Médicos y de Salud
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-1">Antecedentes Médicos / Enfermedades Crónicas</label>
            <textarea id="antecedentes" name="antecedentes" rows="3" placeholder="Ej: Hipertensión, Diabetes Tipo II, etc."
                      class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"></textarea>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">Alergias Conocidas</label>
            <textarea id="alergias" name="alergias" rows="2" placeholder="Ej: Penicilina, AINEs, Polen..."
                      class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"></textarea>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">Medicamentos Actuales</label>
            <textarea id="medicamentos" name="medicamentos" rows="2" placeholder="Nombre de los medicamentos y dosis..."
                      class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"></textarea>
          </div>
        </div>
      </section>

      <!-- Sección 3: Documentación -->
      <section>
        <h2 class="text-xl font-bold text-sky-800 border-b-2 border-sky-600 pb-2 mb-4">
          3. Documentación y Exámenes Adjuntos
        </h2>
        
        <div>
          <label class="block text-sm font-semibold mb-1">Agregar Documento Adjunto (PDF, Imágenes, Exámenes)</label>
          <input type="file" id="documentoAdjunto" name="documentoAdjunto" accept=".pdf,.png,.jpg,.jpeg"
                 class="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-sky-700 file:text-white hover:file:bg-sky-800 cursor-pointer">
        </div>
      </section>

      <!-- Botones de Acción -->
      <div id="seccion-botones" class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
        <button type="submit" class="flex-1 bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-4 rounded-lg shadow transition duration-200">
          💾 Guardar en Servidor
        </button>

        <button type="button" onclick="imprimirFicha()" class="flex-1 bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-lg shadow transition duration-200">
          🖨️ Imprimir Ficha
        </button>

        <button type="button" onclick="generarYEnviarPDF()" class="flex-1 bg-sky-700 hover:bg-sky-800 text-white font-bold py-3 px-4 rounded-lg shadow transition duration-200">
          📧 Generar y Enviar PDF
        </button>
      </div>
    </form>
  </div>

  <script>
    // Mostrar fecha actual automáticamente
    document.getElementById('fecha-actual').innerText = new Date().toLocaleDateString('es-CL');

    // === VALIDACIÓN DE RUT CHILENO (MÓDULO 11) ===
    function validarRut(rutCompleto) {
      if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto)) return false;
      var tmp = rutCompleto.split('-');
      var digv = tmp[1];
      var rut = tmp[0];
      if (digv == 'K') digv = 'k';
      
      var M = 0, S = 1;
      for (; rut; rut = Math.floor(rut / 10)) {
        S = (S + rut % 10 * (9 - M++ % 6)) % 11;
      }
      var dvCalculado = S ? (S - 1).toString() : 'k';
      return dvCalculado === digv;
    }

    const rutInput = document.getElementById('rut');
    const rutError = document.getElementById('rut-error');

    rutInput.addEventListener('blur', () => {
      const valor = rutInput.value.trim().toUpperCase();
      if (valor && !validarRut(valor)) {
        rutError.classList.remove('hidden');
        rutInput.classList.add('border-red-500');
      } else {
        rutError.classList.add('hidden');
        rutInput.classList.remove('border-red-500');
      }
    });

    // === IMPRIMIR FICHA ===
    function imprimirFicha() {
      window.print();
    }

    // === GENERAR Y ENVIAR PDF ===
    async function generarYEnviarPDF() {
      const email = document.getElementById('email').value;
      const rut = document.getElementById('rut').value || 'Paciente';

      if (!email) {
        alert("Por favor ingresa un correo electrónico registrado antes de enviar.");
        return;
      }

      // Ocultar botones para no capturarlos en el PDF
      const botones = document.getElementById('seccion-botones');
      if (botones) botones.style.display = 'none';

      // Convertir campos interactivos a texto plano temporal para evitar cortes verticales
      const elementosForm = document.querySelectorAll('input, select, textarea');
      const elementosReemplazados = [];

      elementosForm.forEach(el => {
        if (el.type !== 'file' && el.type !== 'hidden') {
          const valor = el.value || '(Sin información)';
          const sustituto = document.createElement('div');
          sustituto.className = 'w-full px-2 py-1 border border-slate-300 rounded bg-slate-50 text-slate-900 text-xs whitespace-pre-wrap';
          sustituto.innerText = valor;

          elementosReemplazados.push({ original: el, sustituto: sustituto });
          el.parentNode.replaceChild(sustituto, el);
        }
      });

      const element = document.getElementById('ficha-medica-container');

      const opt = {
        margin:       [0.2, 0.2, 0.2, 0.2],
        filename:     `Ficha_Medica_${rut}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 1.2, useCORS: true, logging: false, scrollY: 0 },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
      };

      try {
        // Generar archivo Base64 del PDF
        const pdfBase64 = await html2pdf().set(opt).from(element).outputPdf('datauristring');

        // Restaurar formulario original
        elementosReemplazados.forEach(item => {
          item.sustituto.parentNode.replaceChild(item.original, item.sustituto);
        });
        if (botones) botones.style.display = 'flex';

        // Petición al servidor
        const response = await fetch('/api/enviar-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, pdfData: pdfBase64, rut: rut })
        });

        if (response.ok) {
          alert("¡Éxito! La ficha médica en PDF se generó completa y fue enviada por correo.");
        } else {
          alert("Error desde el servidor. Asegúrate de tener los límites de Express ampliados (limit: '50mb').");
        }
      } catch (err) {
        elementosReemplazados.forEach(item => {
          if (item.sustituto.parentNode) {
            item.sustituto.parentNode.replaceChild(item.original, item.sustituto);
          }
        });
        if (botones) botones.style.display = 'flex';
        alert("Error al generar o transmitir el PDF: " + err.message);
      }
    }

    // === GUARDAR DATOS EN SERVIDOR ===
    document.getElementById('fichaForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!validarRut(rutInput.value)) {
        alert("El RUT ingresado no es válido.");
        return;
      }

      const formData = new FormData(e.target);

      try {
        const response = await fetch('https://medidata-backend.onrender.com/api/enviar-pdf', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          alert("¡Ficha médica guardada correctamente en el servidor!");
        } else {
          alert("Hubo un fallo al guardar en el servidor.");
        }
      } catch (err) {
        console.error("Error al guardar:", err);
      }
    });
  </script>
</body>
</html>
