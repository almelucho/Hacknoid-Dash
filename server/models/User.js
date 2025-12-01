const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Will need hashing later
    role: { type: String, enum: ['admin', 'auditor', 'viewer'], default: 'auditor' },
    avatar: String
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
