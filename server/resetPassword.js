const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Corrected path from ./src/models/User to ./models/User
require('dotenv').config();

const update = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://audit-db:27017/audit_platform');
        console.log('🔌 Conectado...');

        const email = 'admin@hacknoid.com';
        const password = 'Caracas7121*_'; // <--- CLAVE SEGURA

        // Encriptar
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Buscar y actualizar o crear
        let user = await User.findOne({ email });
        if (user) {
            user.password = hashedPassword;
            user.role = 'admin';
            await user.save();
            console.log('✅ Usuario ACTUALIZADO.');
        } else {
            user = new User({ name: 'Super Admin', email, password: hashedPassword, role: 'admin' });
            await user.save();
            console.log('✅ Usuario CREADO.');
        }
        process.exit(0);
    } catch (e) { console.error(e); process.exit(1); }
};
update();
