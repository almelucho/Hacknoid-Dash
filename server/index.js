const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Conectado (audit-db)'))
  .catch(err => console.error('❌ Error de conexión Mongo:', err));

// Routes
app.use('/api/projects', require('./routes/projectRoutes'));

app.get('/', (req, res) => {
  res.send('🚀 Hacknoid API v1.0 is running inside Docker!');
});

app.listen(PORT, () => {
  console.log(`🔌 Server running on port ${PORT}`);
});
