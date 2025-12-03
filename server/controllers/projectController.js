const Project = require('../models/Project');
const CisTemplate = require('../models/CisTemplate');
const Client = require('../models/Client');

// --- MOTOR DE CÁLCULO MEJORADO (Soporte N/A) ---
const recalculatePercentages = async (project, control, safeguard) => {
    // 1. Calcular % de la Salvaguarda (Nivel 2)
    const totalActs = safeguard.activities.length;
    if (totalActs > 0) {
        const sumStatus = safeguard.activities.reduce((acc, act) => acc + act.status, 0);
        safeguard.percentage = Math.round(sumStatus / totalActs);
    } else {
        safeguard.percentage = 0;
    }

    // 2. Calcular % del Control (Nivel 1)
    // Filtramos solo las que aplican (isApplicable === true)
    const applicableSafeguards = control.safeguards.filter(s => s.isApplicable);
    const totalApplicable = applicableSafeguards.length;

    if (totalApplicable === 0) {
        // Si NINGUNA salvaguarda aplica, el control tiene 100% (Cumple por defecto)
        control.percentage = 100;
    } else {
        const sumSafeguardPerc = applicableSafeguards.reduce((acc, sg) => acc + sg.percentage, 0);
        control.percentage = Math.round(sumSafeguardPerc / totalApplicable);
    }
};

const recalculateGlobalProgress = async (project) => {
    const totalControls = project.controls.length;
    if (totalControls > 0) {
        const sum = project.controls.reduce((acc, c) => acc + (c.percentage || 0), 0);
        project.globalPercentage = Math.round(sum / totalControls);
    } else {
        project.globalPercentage = 0;
    }
};

// A. Crear Política General (Nivel 0)
exports.addGeneralPolicy = async (req, res) => {
    try {
        console.log("➕ Agregando Política General al proyecto:", req.params.projectId);

        const project = await Project.findById(req.params.projectId);
        if (!project) return res.status(404).json({ msg: "Proyecto no encontrado" });

        // Asegurar que el array exista
        if (!project.generalPolicies) project.generalPolicies = [];

        // Agregar la política
        project.generalPolicies.push({
            title: req.body.title,
            status: 0,
            evidenceFiles: [] // Inicializar vacío
        });

        await recalculateGlobalProgress(project);
        await project.save();

        console.log("✅ Política guardada. Total:", project.generalPolicies.length);
        res.json(project);

    } catch (error) {
        console.error("❌ Error al guardar política:", error);
        res.status(500).send('Error al agregar política');
    }
};

// B. Eliminar Política General
exports.deleteGeneralPolicy = async (req, res) => {
    try {
        const { projectId, policyId } = req.params;
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ msg: "Proyecto no encontrado" });

        project.generalPolicies.pull({ _id: policyId });

        await recalculateGlobalProgress(project);
        await project.save();
        res.json(project);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error eliminando política');
    }
};

// C. Actualizar Estado Política General
exports.updateGeneralPolicyStatus = async (req, res) => {
    try {
        const { projectId, policyId } = req.params;
        const { status } = req.body;

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ msg: "Proyecto no encontrado" });

        const policy = project.generalPolicies.id(policyId);
        if (!policy) return res.status(404).json({ msg: "Política no encontrada" });

        policy.status = status;

        await recalculateGlobalProgress(project);
        await project.save();
        res.json(project);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error actualizando estado');
    }
};

// D. Subir Evidencia a Política General
exports.uploadGeneralPolicyEvidence = async (req, res) => {
    try {
        const { projectId, policyId } = req.params;

        if (!req.file) {
            return res.status(400).json({ msg: "No se subió ningún archivo" });
        }

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ msg: "Proyecto no encontrado" });

        const policy = project.generalPolicies.id(policyId);
        if (!policy) return res.status(404).json({ msg: "Política no encontrada" });

        const newFile = {
            name: req.file.originalname,
            url: `/uploads/${req.file.filename}`,
            uploadedAt: new Date()
        };

        policy.evidenceFiles.push(newFile);

        await project.save();
        res.json(project);

    } catch (error) {
        console.error("Error subiendo evidencia:", error);
        res.status(500).send('Error subiendo archivo');
    }
};

// 1. CREAR PROYECTO
exports.createProject = async (req, res) => {
    try {
        const { clientId, projectName, targetProfile } = req.body;

        if (!clientId) {
            return res.status(400).json({ msg: "Error: Debes seleccionar un cliente." });
        }

        // Validar Cliente
        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ msg: "Error: El cliente seleccionado no existe." });
        }

        // Obtener Molde
        const templates = await CisTemplate.find().sort({ controlNumber: 1 });
        if (!templates || templates.length === 0) {
            return res.status(500).json({ msg: "Error Crítico: Falta seed de datos." });
        }

        const projectControls = templates.map(template => {
            // Filtrar por IG
            const validSafeguards = template.safeguards.filter(sg => {
                if (targetProfile === 'IG3') return sg.implementationGroups.ig3;
                if (targetProfile === 'IG2') return sg.implementationGroups.ig2;
                return sg.implementationGroups.ig1;
            });

            const mappedSafeguards = validSafeguards.map(sg => ({
                templateRef: sg.originalId,
                title: sg.title,
                description: sg.description,
                implementationGroup: targetProfile,
                isApplicable: true,
                activities: [],
                percentage: 0
            }));

            return {
                controlNumber: template.controlNumber,
                title: template.title,
                controlPolicies: [{
                    title: `Política de ${template.title}`,
                    description: "Documento oficial del control.",
                    status: 0,
                    evidenceFiles: []
                }],
                safeguards: mappedSafeguards,
                percentage: 0
            };
        });

        const newProject = new Project({
            clientId: client._id,
            clientName: client.name,
            projectName,
            targetProfile,
            generalPolicies: [{
                title: "Política General de Seguridad de la Información",
                status: 0,
                evidenceFiles: []
            }],
            controls: projectControls,
            globalPercentage: 0
        });

        await newProject.save();

        // Vincular al cliente
        if (!client.projects) client.projects = [];
        client.projects.push(newProject._id);
        await client.save();

        res.status(201).json(newProject);

    } catch (error) {
        console.error("Error creando proyecto:", error);
        res.status(500).send('Error en el servidor');
    }
};

// 2. OBTENER PROYECTOS
exports.getProjects = async (req, res) => {
    try {
        let query = {};
        if (req.user && req.user.role === 'client_viewer') {
            query = { clientId: req.user.clientId };
        }

        const projects = await Project.find(query).select('clientName projectName targetProfile globalPercentage createdAt controls');

        const projectsWithStats = projects.map(p => {
            const totalControls = p.controls.length;
            const globalProgress = p.controls.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / (totalControls || 1);
            return {
                ...p._doc,
                globalProgress: Math.round(globalProgress)
            };
        });

        res.json(projectsWithStats);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error obteniendo proyectos');
    }
};

// GET: Obtener un proyecto específico
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ msg: 'Proyecto no encontrado' });
        res.json(project);
    } catch (error) {
        res.status(500).send('Error del servidor');
    }
};

// PATCH: Alternar estado de Aplicabilidad (N/A)
exports.toggleSafeguardApplicability = async (req, res) => {
    try {
        const { projectId, controlId, safeguardId } = req.params;
        const { isApplicable, reason } = req.body;

        const project = await Project.findById(projectId);
        const control = project.controls.id(controlId);
        const safeguard = control.safeguards.id(safeguardId);

        if (!safeguard) return res.status(404).json({ msg: "Salvaguarda no encontrada" });

        safeguard.isApplicable = isApplicable;
        safeguard.nonApplicableReason = reason || "";

        await recalculatePercentages(project, control, safeguard);
        await recalculateGlobalProgress(project);
        await project.save();

        res.json({
            msg: "Aplicabilidad actualizada",
            controlPercentage: control.percentage,
            safeguard: safeguard
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error actualizando aplicabilidad');
    }
};

// PATCH: Actualizar estado de una actividad
exports.updateActivityStatus = async (req, res) => {
    try {
        const { projectId, controlId, activityId } = req.params;
        const { status } = req.body;

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ msg: "Proyecto no encontrado" });

        const control = project.controls.id(controlId);
        if (!control) return res.status(404).json({ msg: "Control no encontrado" });

        let safeguard;
        let activity;

        if (req.params.safeguardId) {
            safeguard = control.safeguards.id(req.params.safeguardId);
            if (safeguard) activity = safeguard.activities.id(activityId);
        } else {
            for (const sg of control.safeguards) {
                const act = sg.activities.id(activityId);
                if (act) {
                    safeguard = sg;
                    activity = act;
                    break;
                }
            }
        }

        if (!activity) return res.status(404).json({ msg: "Actividad no encontrada" });

        activity.status = status;

        await recalculatePercentages(project, control, safeguard);
        await recalculateGlobalProgress(project);
        await project.save();

        res.json({
            msg: "Estado actualizado",
            controlPercentage: control.percentage,
            safeguardPercentage: safeguard.percentage,
            activityStatus: activity.status
        });

    } catch (error) {
        console.error("Error actualizando actividad:", error);
        res.status(500).send('Error del servidor');
    }
};

// --- GESTIÓN DE CONTROLES (NIVEL 1) ---

exports.addControl = async (req, res) => {
    try {
        console.log("➕ Request to add control received. Project:", req.params.projectId, "Body:", req.body);
        const { projectId } = req.params;
        const { title, description, controlNumber } = req.body;

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ msg: "Proyecto no encontrado" });

        project.controls.push({
            controlNumber: controlNumber || project.controls.length + 1,
            title,
            description,
            safeguards: [],
            percentage: 0
        });

        await recalculateGlobalProgress(project);
        await project.save();
        console.log("✅ Control added successfully. Total controls:", project.controls.length);
        res.json(project);
    } catch (error) {
        console.error("Error creando control:", error);
        res.status(500).send('Error creando control');
    }
};

exports.deleteControl = async (req, res) => {
    try {
        const { projectId, controlId } = req.params;
        await Project.updateOne(
            { _id: projectId },
            { $pull: { controls: { _id: controlId } } }
        );
        // Recalcular global después de borrar (necesitamos volver a buscar el proyecto)
        const project = await Project.findById(projectId);
        if (project) {
            await recalculateGlobalProgress(project);
            await project.save();
        }
        res.json({ msg: "Control eliminado" });
    } catch (error) {
        res.status(500).send('Error eliminando control');
    }
};

// --- GESTIÓN DE POLÍTICAS DE CONTROL (NIVEL 1.5) ---

exports.addControlPolicy = async (req, res) => {
    try {
        const { projectId, controlId } = req.params;
        const { title } = req.body;

        const project = await Project.findById(projectId);
        const control = project.controls.id(controlId);
        if (!control) return res.status(404).json({ msg: "Control no encontrado" });

        if (!control.controlPolicies) control.controlPolicies = [];

        control.controlPolicies.push({
            title,
            status: 0,
            evidenceFiles: []
        });

        await project.save();
        res.json(project);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creando política de control');
    }
};

exports.deleteControlPolicy = async (req, res) => {
    try {
        const { projectId, controlId, policyId } = req.params;
        const project = await Project.findById(projectId);
        const control = project.controls.id(controlId);

        control.controlPolicies.pull({ _id: policyId });

        await project.save();
        res.json(project);
    } catch (error) {
        res.status(500).send('Error eliminando política de control');
    }
};

exports.updateControlPolicyStatus = async (req, res) => {
    try {
        const { projectId, controlId, policyId } = req.params;
        const { status } = req.body;

        const project = await Project.findById(projectId);
        const control = project.controls.id(controlId);
        const policy = control.controlPolicies.id(policyId);

        if (!policy) return res.status(404).json({ msg: "Política no encontrada" });

        policy.status = status;

        await project.save();
        res.json(project);
    } catch (error) {
        res.status(500).send('Error actualizando estado');
    }
};

exports.uploadControlPolicyEvidence = async (req, res) => {
    try {
        const { projectId, controlId, policyId } = req.params;
        if (!req.file) return res.status(400).json({ msg: "No se subió archivo" });

        const project = await Project.findById(projectId);
        const control = project.controls.id(controlId);
        const policy = control.controlPolicies.id(policyId);

        if (!policy) return res.status(404).json({ msg: "Política no encontrada" });

        policy.evidenceFiles.push({
            name: req.file.originalname,
            url: `/uploads/${req.file.filename}`,
            uploadedAt: new Date()
        });

        await project.save();
        res.json(project);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error subiendo evidencia');
    }
};

// --- GESTIÓN DE SALVAGUARDAS (NIVEL 2) ---

exports.addSafeguard = async (req, res) => {
    try {
        const { projectId, controlId } = req.params;
        const { title, description } = req.body;

        const project = await Project.findById(projectId);
        const control = project.controls.id(controlId);

        if (!control) return res.status(404).json({ msg: "Control no encontrado" });

        control.safeguards.push({
            title,
            description,
            templateRef: "Manual",
            isApplicable: true,
            activities: [],
            percentage: 0
        });

        await recalculateGlobalProgress(project);
        await project.save();
        res.json(project);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creando salvaguarda');
    }
};

exports.deleteSafeguard = async (req, res) => {
    try {
        const { projectId, controlId, safeguardId } = req.params;
        const project = await Project.findById(projectId);
        const control = project.controls.id(controlId);
        control.safeguards.pull({ _id: safeguardId });
        await recalculateGlobalProgress(project);
        await project.save();
        res.json(project);
    } catch (error) {
        res.status(500).send('Error eliminando salvaguarda');
    }
};

// --- GESTIÓN DE ACTIVIDADES (NIVEL 3) ---

exports.addActivity = async (req, res) => {
    try {
        const { projectId, controlId, safeguardId } = req.params;
        const { title, description } = req.body;

        const project = await Project.findById(projectId);
        const control = project.controls.id(controlId);
        const safeguard = control.safeguards.id(safeguardId);

        if (!safeguard) return res.status(404).json({ msg: "Salvaguarda no encontrada" });

        safeguard.activities.push({
            title,
            description,
            status: 0
        });

        await recalculatePercentages(project, control, safeguard);
        await recalculateGlobalProgress(project);
        await project.save();
        res.json(project);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creando actividad');
    }
};

exports.uploadActivityEvidence = async (req, res) => {
    try {
        const { projectId, controlId, safeguardId, activityId } = req.params;
        if (!req.file) return res.status(400).json({ msg: "No se subió archivo" });

        const project = await Project.findById(projectId);
        const control = project.controls.id(controlId);
        const safeguard = control.safeguards.id(safeguardId);
        const activity = safeguard.activities.id(activityId);

        if (!activity) return res.status(404).json({ msg: "Actividad no encontrada" });

        activity.evidenceFiles.push({
            name: req.file.originalname,
            url: `/uploads/${req.file.filename}`,
            uploadedAt: new Date()
        });

        await project.save();
        res.json(project);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error subiendo evidencia a actividad');
    }
};

exports.deleteActivity = async (req, res) => {
    try {
        const { projectId, controlId, safeguardId, activityId } = req.params;
        const project = await Project.findById(projectId);
        const control = project.controls.id(controlId);
        const safeguard = control.safeguards.id(safeguardId);

        safeguard.activities.pull({ _id: activityId });

        await recalculatePercentages(project, control, safeguard);
        await recalculateGlobalProgress(project);
        await project.save();
        res.json(project);
    } catch (error) {
        res.status(500).send('Error eliminando actividad');
    }
};

// --- EDICIÓN DE TÍTULOS (NUEVO) ---

exports.updateControl = async (req, res) => {
    try {
        const { projectId, controlId } = req.params;
        const { title } = req.body;
        const project = await Project.findById(projectId);
        const control = project.controls.id(controlId);
        if (!control) return res.status(404).json({ msg: "Control no encontrado" });

        control.title = title;
        await project.save();
        res.json(project);
    } catch (error) { res.status(500).send('Error actualizando control'); }
};

exports.updateSafeguard = async (req, res) => {
    try {
        const { projectId, controlId, safeguardId } = req.params;
        const { title } = req.body;
        const project = await Project.findById(projectId);
        const control = project.controls.id(controlId);
        const safeguard = control.safeguards.id(safeguardId);
        if (!safeguard) return res.status(404).json({ msg: "Salvaguarda no encontrada" });

        safeguard.title = title;
        await project.save();
        res.json(project);
    } catch (error) { res.status(500).send('Error actualizando salvaguarda'); }
};

exports.updateActivity = async (req, res) => {
    try {
        const { projectId, controlId, safeguardId, activityId } = req.params;
        const { title } = req.body;
        const project = await Project.findById(projectId);
        const control = project.controls.id(controlId);
        const safeguard = control.safeguards.id(safeguardId);
        const activity = safeguard.activities.id(activityId);
        if (!activity) return res.status(404).json({ msg: "Actividad no encontrada" });

        activity.title = title;
        await project.save();
        res.json(project);
    } catch (error) { res.status(500).send('Error actualizando actividad'); }
};

exports.updateGeneralPolicy = async (req, res) => {
    try {
        const { projectId, policyId } = req.params;
        const { title } = req.body;
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ msg: "Proyecto no encontrado" });

        const policy = project.generalPolicies.id(policyId);
        if (!policy) return res.status(404).json({ msg: "Política no encontrada" });

        policy.title = title;
        await project.save();
        res.json(project);
    } catch (error) { res.status(500).send('Error actualizando política general'); }
};

exports.updateControlPolicy = async (req, res) => {
    try {
        const { projectId, controlId, policyId } = req.params;
        const { title } = req.body;
        const project = await Project.findById(projectId);
        const control = project.controls.id(controlId);
        if (!control) return res.status(404).json({ msg: "Control no encontrado" });

        const policy = control.controlPolicies.id(policyId);
        if (!policy) return res.status(404).json({ msg: "Política no encontrada" });

        policy.title = title;
        await project.save();
        res.json(project);
    } catch (error) { res.status(500).send('Error actualizando política de control'); }
};

// --- GESTIÓN DE PROYECTOS (NIVEL SUPERIOR) ---

exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { projectName, clientName } = req.body;

        const project = await Project.findById(id);
        if (!project) return res.status(404).json({ msg: "Proyecto no encontrado" });

        if (projectName) project.projectName = projectName;
        if (clientName) project.clientName = clientName;

        await project.save();
        res.json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al actualizar proyecto" });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findByIdAndDelete(id);

        if (!project) return res.status(404).json({ msg: "Proyecto no encontrado" });

        // Opcional: Desvincular del cliente si es necesario, pero no es estrictamente obligatorio si el cliente tiene solo referencia
        // Si el cliente tiene array de proyectos, deberíamos hacer pull
        if (project.clientId) {
            await Client.updateOne(
                { _id: project.clientId },
                { $pull: { projects: id } }
            );
        }

        res.json({ msg: "Proyecto eliminado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al eliminar proyecto" });
    }
};
