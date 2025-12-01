require('dotenv').config();
const mongoose = require('mongoose');
const CisTemplate = require('./models/CisTemplate');

const seedData = [
    {
        controlNumber: 1,
        title: "Inventario y Control de Activos Empresariales",
        description: "Administrar activamente (inventariar, rastrear y corregir) todos los activos empresariales conectados a la infraestructura.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "1.1",
                title: "Establecer y mantener un inventario de activos",
                description: "Establecer y mantener un inventario preciso, detallado y actualizado de todos los activos empresariales.",
                assetType: "Devices",
                securityFunction: "Identify",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "1.2",
                title: "Abordar activos no autorizados",
                description: "Asegurar que exista un proceso para abordar los activos no autorizados de manera semanal.",
                assetType: "Devices",
                securityFunction: "Respond",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "1.3",
                title: "Utilizar herramientas de descubrimiento activo",
                description: "Utilizar una herramienta de descubrimiento activo para identificar los activos conectados a la red.",
                assetType: "Devices",
                securityFunction: "Detect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "1.4",
                title: "Utilizar registro DHCP",
                description: "Utilizar el registro DHCP para actualizar el inventario de activos.",
                assetType: "Devices",
                securityFunction: "Identify",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "1.5",
                title: "Utilizar herramientas de descubrimiento pasivo",
                description: "Usar una herramienta de descubrimiento pasivo para identificar los activos conectados a la red.",
                assetType: "Devices",
                securityFunction: "Detect",
                implementationGroups: { ig1: false, ig2: false, ig3: true }
            }
        ]
    },
    // ... Aquí irían los otros 17 controles ...
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://audit-db:27017/audit_platform');
        console.log('🔌 Conectado a MongoDB...');

        // Limpiamos plantillas viejas
        await CisTemplate.deleteMany({});

        // Insertamos la nueva estructura
        await CisTemplate.insertMany(seedData);
        console.log('✅ Base de datos sembrada con Estructura Correcta (Control -> Salvaguarda).');

        mongoose.connection.close();
    } catch (error) {
        console.error(error);
    }
};

seedDB();
