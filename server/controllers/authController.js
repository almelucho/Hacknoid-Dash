const User = require('../models/User');
const Client = require('../models/Client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_super_seguro_hacknoid';

// 1. Registro (Solo para Admin inicial)
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, clientName } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'Usuario ya existe' });

        // Si es cliente, creamos la empresa
        let clientId = null;
        if (role === 'client_viewer' && clientName) {
            const newClient = new Client({ name: clientName });
            await newClient.save();
            clientId = newClient._id;
        }

        user = new User({ name, email, password, role, clientId });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Token
        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) { res.status(500).send('Error server'); }
};

// 2. Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Credenciales inválidas' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Credenciales inválidas' });

        const payload = { user: { id: user.id, role: user.role, clientId: user.clientId } };

        jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
        });
    } catch (err) { res.status(500).send('Error server'); }
};
