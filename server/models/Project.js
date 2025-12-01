const mongoose = require('mongoose');

// Nivel 3: Actividad
const ActivitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    status: { type: Number, enum: [0, 50, 100], default: 0 },
    evidenceFiles: [{ name: String, url: String }],
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
    safeguards: [SafeguardSchema],
    percentage: { type: Number, default: 0 }
});

const ProjectSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    projectName: { type: String, required: true },
    targetProfile: { type: String, enum: ['IG1', 'IG2', 'IG3'], default: 'IG1' },
    controls: [ProjectControlSchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
