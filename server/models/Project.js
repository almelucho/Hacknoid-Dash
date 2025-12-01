const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    projectName: { type: String, required: true },
    targetProfile: { type: String, enum: ['IG1', 'IG2', 'IG3'], required: true },
    controls: [{
        controlNumber: Number,
        title: String,
        percentage: { type: Number, default: 0 },
        activities: [{
            templateRef: String, // e.g., "1.1"
            title: String,
            description: String,
            status: { type: Number, default: 0 }, // 0, 50, 100
            isApplicable: { type: Boolean, default: true },
            implementationGroup: String,
            notes: String,
            evidenceFiles: [String]
        }]
    }]
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
