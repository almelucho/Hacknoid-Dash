const Client = require('../models/Client');

// 1. Obtener todos los clientes
exports.getClients = async (req, res) => {
    try {
        const clients = await Client.find().sort({ createdAt: -1 });
        res.json(clients);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener clientes" });
    }
};

// 2. Crear un nuevo cliente
exports.createClient = async (req, res) => {
    try {
        const { name, contactName, contactEmail } = req.body;

        const newClient = new Client({
            name,
            contactName,
            contactEmail
        });

        await newClient.save();
        res.status(201).json(newClient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al crear cliente" });
    }
};

// 3. Subir Logo
exports.uploadLogo = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.file) {
            return res.status(400).json({ msg: "No se subió ningún archivo" });
        }

        // Construir URL del archivo (asumiendo que servimos 'uploads' estáticamente)
        // El archivo se guarda en 'server/uploads', la URL pública sería '/uploads/filename'
        const logoUrl = `/uploads/${req.file.filename}`;

        const client = await Client.findByIdAndUpdate(
            id,
            { logoUrl },
            { new: true }
        );

        if (!client) {
            return res.status(404).json({ msg: "Cliente no encontrado" });
        }

        res.json(client);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al subir logo" });
    }
};
