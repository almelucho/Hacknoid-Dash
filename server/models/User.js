const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Se guardará encriptada
    role: {
        type: String,
        enum: ['admin', 'auditor', 'client_viewer'],
        default: 'client_viewer'
    },
    // Vinculamos el usuario a un Cliente específico
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
