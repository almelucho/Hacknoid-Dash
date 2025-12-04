const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    logoUrl: { type: String }, // URL del logo subido
    contactName: String,
    contactEmail: String,
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Client', ClientSchema);
