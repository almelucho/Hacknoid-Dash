const mongoose = require('mongoose');

const CisTemplateSchema = new mongoose.Schema({
    controlNumber: { type: Number, required: true }, // e.g., 1
    title: { type: String, required: true }, // e.g., "Inventory and Control of Enterprise Assets"
    safeguards: [{
        originalId: String, // e.g., "1.1"
        title: String,
        description: String,
        implementationGroups: {
            ig1: Boolean,
            ig2: Boolean,
            ig3: Boolean
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('CisTemplate', CisTemplateSchema);
