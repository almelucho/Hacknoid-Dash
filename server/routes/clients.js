const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads');
        // Asegurar que existe el directorio
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Nombre único: timestamp + extensión original
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Rutas (Todas protegidas para ADMIN)
router.get('/', auth, admin, clientController.getClients);
router.post('/', auth, admin, clientController.createClient);
router.post('/:id/logo', auth, admin, upload.single('file'), clientController.uploadLogo);
router.post('/:id/users', auth, admin, clientController.createUserForClient);
router.put('/:id', auth, admin, clientController.updateClient);
router.delete('/:id', auth, admin, clientController.deleteClient);

module.exports = router;
