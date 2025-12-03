require('dotenv').config();
const mongoose = require('mongoose');
const CisTemplate = require('./models/CisTemplate');

const seedData = [
    {
        controlNumber: 1,
        title: "Inventario y Control de Activos Empresariales",
        description: "Gestionar activamente todos los activos empresariales.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "1.1",
                title: "Establecer y mantener un inventario de activos",
                description: "Utilizar una herramienta de descubrimiento activo.",
                assetType: "Devices",
                securityFunction: "Identify",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "1.2",
                title: "Abordar activos no autorizados",
                description: "Asegurar que exista un proceso para abordar activos no autorizados.",
                assetType: "Devices",
                securityFunction: "Respond",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            }
        ]
    },
    {
        controlNumber: 2,
        title: "Inventario y Control de Software",
        description: "Gestionar activamente todo el software.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "2.1",
                title: "Establecer y mantener un inventario de software",
                description: "Inventariar todo el software autorizado.",
                assetType: "Software",
                securityFunction: "Identify",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            }
        ]
    },
    {
        controlNumber: 3,
        title: "Protección de Datos",
        description: "Desarrollar procesos y controles técnicos para identificar, clasificar, manejar, retener y eliminar datos de manera segura.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "3.1",
                title: "Establecer y mantener un proceso de gestión de datos",
                description: "Establecer y mantener un proceso de gestión de datos.",
                assetType: "Data",
                securityFunction: "Identify",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            }
        ]
    },
    {
        controlNumber: 4,
        title: "Configuración Segura de Activos y Software",
        description: "Establecer y mantener la configuración segura de activos empresariales y software.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "4.1",
                title: "Establecer y mantener un proceso de configuración segura",
                description: "Establecer y mantener un proceso de configuración segura.",
                assetType: "Devices",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            }
        ]
    },
    {
        controlNumber: 5,
        title: "Gestión de Cuentas",
        description: "Usar procesos y herramientas para asignar y gestionar la autorización de credenciales para cuentas de usuario.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "5.1",
                title: "Establecer y mantener un inventario de cuentas",
                description: "Establecer y mantener un inventario de cuentas.",
                assetType: "Users",
                securityFunction: "Identify",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            }
        ]
    },
    {
        controlNumber: 6,
        title: "Gestión de Control de Acceso",
        description: "Usar procesos y herramientas para crear, asignar, gestionar y revocar credenciales de acceso y privilegios.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "6.1",
                title: "Establecer un proceso de otorgamiento de acceso",
                description: "Establecer un proceso de otorgamiento de acceso.",
                assetType: "Users",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            }
        ]
    },
    {
        controlNumber: 7,
        title: "Gestión Continua de Vulnerabilidades",
        description: "Desarrollar un plan para evaluar y rastrear vulnerabilidades continuamente en todos los activos empresariales.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "7.1",
                title: "Establecer y mantener un proceso de gestión de vulnerabilidades",
                description: "Establecer y mantener un proceso de gestión de vulnerabilidades.",
                assetType: "Devices",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            }
        ]
    },
    {
        controlNumber: 8,
        title: "Gestión de Registros de Auditoría",
        description: "Recopilar, alertar, revisar y retener registros de auditoría de eventos que podrían ayudar a detectar, comprender o recuperarse de un ataque.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "8.1",
                title: "Establecer y mantener un proceso de gestión de registros de auditoría",
                description: "Establecer y mantener un proceso de gestión de registros de auditoría.",
                assetType: "Network",
                securityFunction: "Detect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            }
        ]
    },
    {
        controlNumber: 9,
        title: "Protecciones de Correo Electrónico y Navegador Web",
        description: "Mejorar las protecciones y detecciones de amenazas provenientes de vectores de correo electrónico y web.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "9.1",
                title: "Asegurar que se utilicen navegadores web totalmente compatibles",
                description: "Asegurar que se utilicen navegadores web totalmente compatibles.",
                assetType: "Software",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            }
        ]
    },
    {
        controlNumber: 10,
        title: "Defensas contra Malware",
        description: "Prevenir o controlar la instalación, propagación y ejecución de aplicaciones, código o scripts maliciosos.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "10.1",
                title: "Desplegar y mantener software anti-malware",
                description: "Desplegar y mantener software anti-malware.",
                assetType: "Software",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            }
        ]
    },
    {
        controlNumber: 11,
        title: "Recuperación de Datos",
        description: "Establecer y mantener prácticas de recuperación de datos suficientes para restaurar activos empresariales a un estado de pre-incidente.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "11.1",
                title: "Establecer y mantener un proceso de recuperación de datos",
                description: "Establecer y mantener un proceso de recuperación de datos.",
                assetType: "Data",
                securityFunction: "Recover",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            }
        ]
    },
    {
        controlNumber: 12,
        title: "Gestión de Infraestructura de Red",
        description: "Establecer, implementar y gestionar activamente dispositivos de red para evitar que los atacantes exploten protocolos y servicios de red vulnerables.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "12.1",
                title: "Asegurar que la infraestructura de red esté actualizada",
                description: "Asegurar que la infraestructura de red esté actualizada.",
                assetType: "Network",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            }
        ]
    },
    {
        controlNumber: 13,
        title: "Monitoreo y Defensa de Red",
        description: "Operar procesos y herramientas para establecer y mantener una supervisión integral de la red y defensa contra amenazas de seguridad.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "13.1",
                title: "Centralizar alertas de seguridad",
                description: "Centralizar alertas de seguridad.",
                assetType: "Network",
                securityFunction: "Detect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            }
        ]
    },
    {
        controlNumber: 14,
        title: "Concientización y Capacitación en Seguridad",
        description: "Establecer y mantener un programa de concientización de seguridad para influir en el comportamiento de la fuerza laboral.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "14.1",
                title: "Establecer y mantener un programa de concientización de seguridad",
                description: "Establecer y mantener un programa de concientización de seguridad.",
                assetType: "Users",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            }
        ]
    },
    {
        controlNumber: 15,
        title: "Gestión de Proveedores de Servicios",
        description: "Desarrollar un proceso para evaluar a los proveedores de servicios que tienen datos confidenciales o son responsables de plataformas críticas.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "15.1",
                title: "Establecer y mantener un inventario de proveedores de servicios",
                description: "Establecer y mantener un inventario de proveedores de servicios.",
                assetType: "Other",
                securityFunction: "Identify",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            }
        ]
    },
    {
        controlNumber: 16,
        title: "Seguridad del Software de Aplicación",
        description: "Gestionar el ciclo de vida de seguridad del software desarrollado internamente y adquirido para prevenir, detectar y remediar vulnerabilidades.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "16.1",
                title: "Establecer y mantener un proceso de desarrollo seguro",
                description: "Establecer y mantener un proceso de desarrollo seguro.",
                assetType: "Applications",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            }
        ]
    },
    {
        controlNumber: 17,
        title: "Gestión de Respuesta a Incidentes",
        description: "Establecer un programa para desarrollar y mantener una capacidad de respuesta a incidentes.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "17.1",
                title: "Designar personal de respuesta a incidentes",
                description: "Designar personal de respuesta a incidentes.",
                assetType: "Other",
                securityFunction: "Respond",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            }
        ]
    },
    {
        controlNumber: 18,
        title: "Pruebas de Penetración",
        description: "Probar la efectividad y resistencia de los activos empresariales mediante la identificación y explotación de vulnerabilidades.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "18.1",
                title: "Establecer y mantener un programa de pruebas de penetración",
                description: "Establecer y mantener un programa de pruebas de penetración.",
                assetType: "Other",
                securityFunction: "Identify",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            }
        ]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://audit-db:27017/audit_platform');
        console.log('🔌 Conectado a MongoDB...');
        await CisTemplate.deleteMany({});
        await CisTemplate.insertMany(seedData);
        console.log('✅ Plantillas CIS Maestras cargadas correctamente.');
        mongoose.connection.close();
    } catch (error) {
        console.error(error);
    }
};

seedDB();
