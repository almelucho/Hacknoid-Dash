const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// --- PROYECTOS ---
router.post('/', projectController.createProject);
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);

// --- CONTROLES (Nuevo) ---
router.post('/:projectId/controls', projectController.addControl); // Crear Control
router.delete('/:projectId/controls/:controlId', projectController.deleteControl); // Borrar Control

// --- SALVAGUARDAS (Nuevo) ---
router.post('/:projectId/controls/:controlId/safeguards', projectController.addSafeguard); // Crear Salvaguarda
router.delete('/:projectId/controls/:controlId/safeguards/:safeguardId', projectController.deleteSafeguard); // Borrar Salvaguarda
router.patch('/:projectId/controls/:controlId/safeguards/:safeguardId/applicability', projectController.toggleSafeguardApplicability); // Toggle N/A

// --- ACTIVIDADES ---
router.post('/:projectId/controls/:controlId/safeguards/:safeguardId/activities', projectController.addActivity);
router.patch('/:projectId/controls/:controlId/safeguards/:safeguardId/activities/:activityId', projectController.updateActivityStatus);

module.exports = router;
