const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth'); // <--- IMPORTAR
const upload = require('../middleware/upload'); // <--- IMPORTAR MULTER

// --- PROYECTOS ---
router.post('/', projectController.createProject);
router.get('/', auth, projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.put('/:id', auth, projectController.updateProject); // <--- EDITAR PROYECTO
router.delete('/:id', auth, projectController.deleteProject); // <--- BORRAR PROYECTO

// POLÍTICAS GENERALES
router.post('/:projectId/policies', projectController.addGeneralPolicy);
router.put('/:projectId/policies/:policyId', projectController.updateGeneralPolicy); // Editar Título Política General
router.delete('/:projectId/policies/:policyId', projectController.deleteGeneralPolicy);
router.patch('/:projectId/policies/:policyId', projectController.updateGeneralPolicyStatus);
router.post('/:projectId/policies/:policyId/evidence', upload.single('file'), projectController.uploadGeneralPolicyEvidence);

// --- CONTROLES (Nuevo) ---
router.post('/:projectId/controls', projectController.addControl); // Crear Control
router.put('/:projectId/controls/:controlId', projectController.updateControl); // Editar Título Control
router.delete('/:projectId/controls/:controlId', projectController.deleteControl); // Borrar Control

// POLÍTICAS DE CONTROL
router.post('/:projectId/controls/:controlId/policies', projectController.addControlPolicy);
router.put('/:projectId/controls/:controlId/policies/:policyId', projectController.updateControlPolicy); // Editar Título Política Control
router.delete('/:projectId/controls/:controlId/policies/:policyId', projectController.deleteControlPolicy);
router.patch('/:projectId/controls/:controlId/policies/:policyId', projectController.updateControlPolicyStatus);
router.post('/:projectId/controls/:controlId/policies/:policyId/evidence', upload.single('file'), projectController.uploadControlPolicyEvidence);

// --- SALVAGUARDAS (Nuevo) ---
router.post('/:projectId/controls/:controlId/safeguards', projectController.addSafeguard); // Crear Salvaguarda
router.put('/:projectId/controls/:controlId/safeguards/:safeguardId', projectController.updateSafeguard); // Editar Título Salvaguarda
router.delete('/:projectId/controls/:controlId/safeguards/:safeguardId', projectController.deleteSafeguard); // Borrar Salvaguarda
router.patch('/:projectId/controls/:controlId/safeguards/:safeguardId/applicability', projectController.toggleSafeguardApplicability); // Toggle N/A

// --- ACTIVIDADES ---
router.post('/:projectId/controls/:controlId/safeguards/:safeguardId/activities', projectController.addActivity);
router.put('/:projectId/controls/:controlId/safeguards/:safeguardId/activities/:activityId', projectController.updateActivity); // Editar Título Actividad
router.patch('/:projectId/controls/:controlId/safeguards/:safeguardId/activities/:activityId', projectController.updateActivityStatus);
router.post('/:projectId/controls/:controlId/safeguards/:safeguardId/activities/:activityId/evidence', upload.single('file'), projectController.uploadActivityEvidence);
router.delete('/:projectId/controls/:controlId/safeguards/:safeguardId/activities/:activityId', projectController.deleteActivity);

module.exports = router;
