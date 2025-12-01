const Project = require('../models/Project');
const CisTemplate = require('../models/CisTemplate');

// POST: Crear un nuevo proyecto (Clonar la plantilla)
exports.createProject = async (req, res) => {
    try {
        const { clientName, projectName, targetProfile } = req.body;
        // targetProfile puede ser 'IG1', 'IG2' o 'IG3'

        // 1. Buscamos la "Plantilla Maestra" (Los 18 Controles Oficiales)
        const templates = await CisTemplate.find().sort({ controlNumber: 1 });
        console.log(`🔍 Debug: Found ${templates.length} templates in DB`);

        if (!templates.length) {
            return res.status(500).json({ msg: "⚠️ Error: No hay plantillas CIS en la DB. Ejecuta 'node seed.js'" });
        }

        // 2. MAGIA: Clonamos y filtramos según el perfil (IG1/IG2/IG3)
        const projectControls = templates.map(template => {
            // Filtramos las salvaguardas que apliquen al perfil seleccionado
            const filteredActivities = template.safeguards
                .filter(sg => {
                    // Lógica de herencia: IG3 incluye todo, IG2 incluye IG1, etc.
                    if (targetProfile === 'IG3') return sg.implementationGroups.ig3;
                    if (targetProfile === 'IG2') return sg.implementationGroups.ig2;
                    return sg.implementationGroups.ig1; // Por defecto IG1
                })
                .map(sg => ({
                    templateRef: sg.originalId, // Guardamos referencia al ID original (ej: 1.1)
                    title: sg.title,
                    description: sg.description,
                    status: 0,       // Empieza en 0%
                    isApplicable: true,
                    implementationGroup: targetProfile
                }));

            return {
                controlNumber: template.controlNumber,
                title: template.title,
                activities: filteredActivities,
                percentage: 0
            };
        });

        // 3. Guardamos el proyecto independiente para este cliente
        const newProject = new Project({
            clientName,
            projectName,
            targetProfile,
            controls: projectControls
        });

        await newProject.save();
        res.status(201).json({ msg: "Proyecto creado exitosamente", id: newProject._id, project: newProject });

    } catch (error) {
        console.error("Error creando proyecto:", error);
        res.status(500).send('Error en el servidor');
    }
};

// GET: Obtener todos los proyectos (Para el Dashboard)
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find().select('clientName projectName targetProfile createdAt controls');

        // Calculamos un % global rápido para mostrar en el dashboard
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
        res.status(500).send('Error obteniendo proyectos');
    }
};

// GET: Obtener un proyecto específico (Para la vista de Auditoría)
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ msg: 'Proyecto no encontrado' });
        res.json(project);
    } catch (error) {
        res.status(500).send('Error del servidor');
    }
};

// PATCH: Actualizar estado de una actividad y recalcular porcentajes
exports.updateActivityStatus = async (req, res) => {
    try {
        const { projectId, controlId, activityId } = req.params;
        const { status } = req.body; // 0, 50, 100

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ msg: "Proyecto no encontrado" });

        // 1. Encontrar el control y la actividad específica
        const control = project.controls.id(controlId);
        if (!control) return res.status(404).json({ msg: "Control no encontrado" });

        const activity = control.activities.id(activityId);
        if (!activity) return res.status(404).json({ msg: "Actividad no encontrada" });

        // 2. Actualizar el estado
        activity.status = status;

        // 3. --- MOTOR DE CÁLCULO (Según reglas CIS) ---

        // A. Calcular porcentaje del CONTROL
        // Filtrar solo las aplicables (excluir N/A si implementamos esa lógica futura)
        const applicableActivities = control.activities.filter(a => a.isApplicable);
        const totalPointsPossible = applicableActivities.length;

        let earnedPoints = 0;
        applicableActivities.forEach(act => {
            if (act.status === 100) earnedPoints += 1;
            else if (act.status === 50) earnedPoints += 0.5;
            // 0% suma 0 puntos
        });

        // Evitar división por cero
        control.percentage = totalPointsPossible === 0 ? 0 : Math.round((earnedPoints / totalPointsPossible) * 100);

        // B. Calcular porcentaje GLOBAL del Proyecto (Promedio de los controles)
        // Nota: Podríamos ponderar controles, pero por ahora es promedio simple
        const totalControls = project.controls.length;
        const sumPercentages = project.controls.reduce((acc, curr) => acc + curr.percentage, 0);

        // Guardamos el global (si tuviéramos un campo en el schema raíz, si no, se calcula al vuelo)
        // Para este MVP, el dashboard lo calcula al vuelo, así que con guardar el control basta.

        await project.save();

        res.json({
            msg: "Estado actualizado",
            controlPercentage: control.percentage,
            activityStatus: activity.status
        });

    } catch (error) {
        console.error("Error actualizando actividad:", error);
        res.status(500).send('Error del servidor');
    }
};
