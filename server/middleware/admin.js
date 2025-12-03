module.exports = function (req, res, next) {
    // 1. Verificar si el usuario existe (debe venir del middleware auth)
    if (!req.user) {
        return res.status(401).json({ msg: 'No autorizado' });
    }

    // 2. Verificar Rol
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Acceso denegado: Requiere rol de Administrador' });
    }

    next();
};
