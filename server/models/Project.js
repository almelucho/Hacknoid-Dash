const mongoose = require('mongoose');

// Esquema de Comentarios (Chat)
const CommentSchema = new mongoose.Schema({
    user: String,       // Nombre de quien comenta
    role: String,       // Rol (Admin/Cliente)
    text: String,
    createdAt: { type: Date, default: Date.now }
});

// Nivel 3: Actividad
const ActivitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    status: { type: Number, enum: [0, 50, 100], default: 0 },

    // --- NUEVOS CAMPOS ---
    periodicity: {
        type: String,
        enum: ['Única', 'Semanal', 'Mensual', 'Trimestral', 'Anual'],
        default: 'Única'
    },
    comments: [CommentSchema], // Caja de comentarios
    // ---------------------

    evidenceFiles: [{
        name: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

// Nivel 2: Salvaguarda
const SafeguardSchema = new mongoose.Schema({
    templateRef: String,
    title: String,
    description: String,
    implementationGroup: String,

    // --- NUEVOS CAMPOS PARA N/A ---
    isApplicable: { type: Boolean, default: true }, // true = Cuenta para el promedio
    nonApplicableReason: { type: String, default: '' }, // Justificación del auditor
    // ------------------------------

    activities: [ActivitySchema],
    percentage: { type: Number, default: 0 }
});

// Nivel 1: Control
const ProjectControlSchema = new mongoose.Schema({
    controlNumber: Number,
    title: String,
    controlPolicies: [ActivitySchema], // <--- NUEVO CAMPO
    safeguards: [SafeguardSchema],
    percentage: { type: Number, default: 0 }
});

const ProjectSchema = new mongoose.Schema({
    // Vinculamos el Proyecto a un Cliente de la base de datos
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }, // <--- AHORA ES REQUIRED

    clientName: { type: String, required: true }, // Mantenemos esto por facilidad visual
    projectName: { type: String, required: true },
    targetProfile: { type: String, enum: ['IG1', 'IG2', 'IG3'], default: 'IG1' },

    // 🔥 ESTA LÍNEA ES CRÍTICA: Define que es un ARRAY []
    generalPolicies: [ActivitySchema],

    controls: [ProjectControlSchema],
    globalPercentage: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
