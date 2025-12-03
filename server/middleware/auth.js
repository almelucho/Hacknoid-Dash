const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Leer el token del header
    const token = req.header('x-auth-token');

    // 2. Verificar si no hay token
    if (!token) {
        return res.status(401).json({ msg: 'No hay token, permiso denegado' });
    }

    // 3. Verificar token
    try {
        // NOTA: En producción usar process.env.JWT_SECRET
        // Usamos el mismo secreto que en authController
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_super_seguro_hacknoid');

        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token no es válido' });
    }
};
