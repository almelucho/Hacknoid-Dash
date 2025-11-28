const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config(); // Cargar variables de entorno
const { processUserMessage } = require('./aiController');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors()); // Permite que React se conecte
app.use(express.json()); // Permite recibir JSON

// --- HELPER FUNCTIONS ---

// Leer Base de Datos
const readDB = () => {
  try {
    if (!fs.existsSync(DB_FILE)) {
      // Si no existe, creamos uno básico
      const initialData = { controls: [] };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData));
      return initialData;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error leyendo DB:", error);
    return { controls: [] };
  }
};

// Guardar Base de Datos
const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Error escribiendo DB:", error);
    return false;
  }
};

// --- RUTAS (ENDPOINTS) ---

// 1. Health Check
app.get('/', (req, res) => {
  res.send('API de Auditoría v2.0 (Docker) - Funcionando 🚀');
});

// 2. Obtener todos los datos (Dashboard)
app.get('/api/controls', (req, res) => {
  const db = readDB();
  res.json(db.controls);
});

// 3. Crear una Actividad en un Control
app.post('/api/controls/:id/activities', (req, res) => {
  const controlId = parseInt(req.params.id);
  const { nombre, tipo, responsable, estado } = req.body;

  const db = readDB();
  const control = db.controls.find(c => c.id === controlId);

  if (!control) {
    return res.status(404).json({ error: "Control no encontrado" });
  }

  const nuevaActividad = {
    id: uuidv4(), // ID único
    nombre,
    tipo,
    responsable,
    estado: estado || 0,
    fechaCreacion: new Date().toISOString(),
    archivos: []
  };

  control.activities.push(nuevaActividad);
  writeDB(db); // Guardar en disco

  res.json(nuevaActividad);
});

// RUTA IA: Chat Inteligente
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Mensaje vacío" });

  const response = await processUserMessage(message);
  res.json({ reply: response });
});

// Iniciar Servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
