const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.post('/', projectController.createProject);
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);

// NUEVA RUTA: Actualizar actividad
router.patch('/:projectId/controls/:controlId/activities/:activityId', projectController.updateActivityStatus);

module.exports = router;
