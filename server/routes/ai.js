const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

// Ruta protegida: Solo usuarios logueados pueden hablar con la IA
router.post('/chat', auth, aiController.chat);

module.exports = router;
