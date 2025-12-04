require('dotenv').config();
const mongoose = require('mongoose');
const CisTemplate = require('./models/CisTemplate');

const seedData = [
    {
        controlNumber: 1,
        title: "Inventario y Control de Activos Empresariales",
        description: "Administrar activamente (inventariar, rastrear y corregir) todos los activos empresariales conectados a la infraestructura de forma física, virtual, remota y aquellos en entornos de nube.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "1.1",
                title: "Establecer y mantener un inventario de activos empresariales",
                description: "Establecer y mantener un inventario preciso, detallado y actualizado de todos los activos empresariales con el potencial de almacenar o procesar datos.",
                assetType: "Devices",
                securityFunction: "Identify",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "1.2",
                title: "Abordar activos no autorizados",
                description: "Asegurar que exista un proceso para abordar los activos no autorizados de manera semanal. La empresa puede optar por retirar el activo de la red, denegar su conexión remota o ponerlo en cuarentena.",
                assetType: "Devices",
                securityFunction: "Respond",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "1.3",
                title: "Utilizar una herramienta de descubrimiento activo",
                description: "Utilizar una herramienta de descubrimiento activo para identificar los activos conectados a la red de la empresa. Configurar para ejecutarse diariamente o con mayor frecuencia.",
                assetType: "Devices",
                securityFunction: "Detect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "1.4",
                title: "Utilizar registro DHCP",
                description: "Utilizar el registro DHCP en todos los servidores DHCP o herramientas de gestión de direcciones IP para actualizar el inventario de activos de la empresa semanalmente o con mayor frecuencia.",
                assetType: "Devices",
                securityFunction: "Identify",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "1.5",
                title: "Utilizar una herramienta de descubrimiento pasivo",
                description: "Usar una herramienta de descubrimiento pasivo para identificar los activos conectados a la red de la empresa y actualizar el inventario al menos semanalmente.",
                assetType: "Devices",
                securityFunction: "Detect",
                implementationGroups: { ig1: false, ig2: false, ig3: true }
            }
        ]
    },
    {
        controlNumber: 2,
        title: "Inventario y Control de Activos de Software",
        description: "Gestionar activamente todo el software en la red para que solo el software autorizado esté instalado y pueda ejecutarse.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "2.1",
                title: "Establecer y mantener un inventario de software",
                description: "Establecer y mantener un inventario detallado de todo el software con licencia instalado en los activos empresariales.",
                assetType: "Software",
                securityFunction: "Identify",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "2.2",
                title: "Asegurar el uso de software autorizado",
                description: "Garantizar que solo el software actualmente soportado esté designado como autorizado en el inventario de software. Revisar al menos mensualmente.",
                assetType: "Software",
                securityFunction: "Identify",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "2.3",
                title: "Abordar software no autorizado",
                description: "Asegurar que el software no autorizado sea eliminado de los activos empresariales o cuente con una excepción documentada. Revisar mensualmente.",
                assetType: "Software",
                securityFunction: "Respond",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "2.4",
                title: "Utilizar herramientas de inventario de software automatizadas",
                description: "Utilizar herramientas de inventario de software, cuando sea posible, en toda la empresa para automatizar el descubrimiento y la documentación del software instalado.",
                assetType: "Software",
                securityFunction: "Detect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "2.5",
                title: "Utilizar listas de permitidos (allowlisting)",
                description: "Utilizar controles técnicos, como listas de permitidos para aplicaciones, para garantizar que solo el software autorizado pueda ejecutarse o ser accedido.",
                assetType: "Software",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "2.6",
                title: "Permitir solo bibliotecas autorizadas",
                description: "Utilizar controles técnicos para garantizar que solo las bibliotecas de software autorizadas (ej. .dll, .ocx, .so) puedan cargarse en un proceso del sistema.",
                assetType: "Software",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "2.7",
                title: "Permitir solo scripts autorizados",
                description: "Utilizar controles técnicos, como firmas digitales y control de versiones, para garantizar que solo los scripts autorizados (ej. .ps1, .py) puedan ejecutarse.",
                assetType: "Software",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: false, ig3: true }
            }
        ]
    },
    {
        controlNumber: 3,
        title: "Protección de Datos",
        description: "Desarrollar procesos y controles técnicos para identificar, clasificar, manejar de forma segura, retener y eliminar datos.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "3.1",
                title: "Establecer y mantener un proceso de gestión de datos",
                description: "Establecer y mantener un proceso documentado de gestión de datos que aborde sensibilidad, propiedad, manejo, retención y eliminación.",
                assetType: "Data",
                securityFunction: "Govern",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "3.2",
                title: "Establecer y mantener un inventario de datos",
                description: "Establecer y mantener un inventario de datos basado en el proceso de gestión de datos de la empresa, priorizando los datos sensibles.",
                assetType: "Data",
                securityFunction: "Identify",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "3.3",
                title: "Configurar listas de control de acceso a datos",
                description: "Configurar listas de control de acceso a datos según la necesidad de conocimiento del usuario en sistemas de archivos, bases de datos y aplicaciones.",
                assetType: "Data",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "3.4",
                title: "Retener datos",
                description: "Retener los datos conforme al proceso documentado de gestión de datos de la empresa, incluyendo plazos mínimos y máximos.",
                assetType: "Data",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "3.5",
                title: "Eliminar datos de forma segura",
                description: "Eliminar los datos de forma segura según lo estipulado en el proceso de gestión de datos, acorde con la sensibilidad de los datos.",
                assetType: "Data",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "3.6",
                title: "Cifrar datos en dispositivos de usuario final",
                description: "Cifrar los datos en los dispositivos del usuario final que contengan datos sensibles (ej. BitLocker, FileVault).",
                assetType: "Data",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "3.7",
                title: "Establecer y mantener un esquema de clasificación de datos",
                description: "Establecer y mantener un esquema general de clasificación de datos (ej. Sensible, Confidencial, Público).",
                assetType: "Data",
                securityFunction: "Identify",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "3.8",
                title: "Documentar flujos de datos",
                description: "Documentar los flujos de datos, incluyendo aquellos con proveedores de servicios.",
                assetType: "Data",
                securityFunction: "Identify",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "3.9",
                title: "Cifrar datos en medios removibles",
                description: "Cifrar los datos almacenados en medios removibles.",
                assetType: "Data",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "3.10",
                title: "Cifrar datos sensibles en tránsito",
                description: "Cifrar los datos sensibles en tránsito (ej. TLS, OpenSSH).",
                assetType: "Data",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "3.11",
                title: "Cifrar datos sensibles en reposo",
                description: "Cifrar los datos sensibles en reposo en servidores, aplicaciones y bases de datos.",
                assetType: "Data",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "3.12",
                title: "Segmentar procesamiento y almacenamiento de datos",
                description: "Segmentar el procesamiento y almacenamiento de datos según su sensibilidad. No procesar datos sensibles en activos para datos de menor sensibilidad.",
                assetType: "Data",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: false, ig3: true }
            },
            {
                originalId: "3.13",
                title: "Implementar herramienta de prevención de pérdida de datos (DLP)",
                description: "Implementar una herramienta automatizada (ej. DLP basada en host) para identificar datos sensibles almacenados, procesados o transmitidos.",
                assetType: "Data",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: false, ig3: true }
            },
            {
                originalId: "3.14",
                title: "Registrar acceso a datos sensibles",
                description: "Registrar el acceso a datos sensibles, incluida su modificación y eliminación.",
                assetType: "Data",
                securityFunction: "Detect",
                implementationGroups: { ig1: false, ig2: false, ig3: true }
            }
        ]
    },
    {
        controlNumber: 4,
        title: "Configuración Segura de Activos Empresariales y Software",
        description: "Establecer y mantener la configuración segura de los activos empresariales y del software.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "4.1",
                title: "Proceso de configuración segura de activos empresariales",
                description: "Establecer y mantener un proceso documentado de configuración segura para activos empresariales y software.",
                assetType: "Documentation",
                securityFunction: "Govern",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "4.2",
                title: "Proceso de configuración segura de dispositivos de red",
                description: "Establecer y mantener un proceso documentado de configuración segura para los dispositivos de red.",
                assetType: "Documentation",
                securityFunction: "Govern",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "4.3",
                title: "Configurar bloqueo automático de sesión",
                description: "Configurar bloqueo automático tras inactividad (máx 15 min sistemas generales, 2 min dispositivos móviles).",
                assetType: "Devices",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "4.4",
                title: "Implementar y gestionar cortafuegos en servidores",
                description: "Implementar y gestionar un cortafuegos en los servidores, cuando sea compatible.",
                assetType: "Devices",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "4.5",
                title: "Implementar cortafuegos en dispositivos de usuario final",
                description: "Implementar y gestionar un cortafuegos basado en host en dispositivos de usuario final con regla predeterminada de denegación.",
                assetType: "Devices",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "4.6",
                title: "Gestionar de forma segura activos y software",
                description: "Gestionar de forma segura activos y software usando canales seguros (SSH, HTTPS) y evitando protocolos inseguros (Telnet, HTTP).",
                assetType: "Devices",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "4.7",
                title: "Gestionar cuentas predeterminadas",
                description: "Gestionar (deshabilitar o hacer inutilizables) las cuentas predeterminadas en activos y software (ej. root, admin).",
                assetType: "Users",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "4.8",
                title: "Desinstalar o deshabilitar servicios innecesarios",
                description: "Desinstalar o deshabilitar servicios innecesarios en los activos empresariales y el software.",
                assetType: "Devices",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "4.9",
                title: "Configurar servidores DNS confiables",
                description: "Configurar servidores DNS confiables en la infraestructura de red (controlados por la empresa o externos de buena reputación).",
                assetType: "Devices",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "4.10",
                title: "Hacer cumplir bloqueo automático de dispositivos",
                description: "Bloqueo automático tras intentos fallidos de autenticación (máx 20 laptops, 10 móviles).",
                assetType: "Devices",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "4.11",
                title: "Borrar remotamente datos empresariales",
                description: "Borrar remotamente los datos empresariales de dispositivos portátiles cuando sea apropiado (robo, pérdida, desvinculación).",
                assetType: "Data",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "4.12",
                title: "Separar espacios de trabajo en dispositivos móviles",
                description: "Asegurar que se utilicen espacios de trabajo separados (perfil de trabajo) en dispositivos móviles para aislar datos empresariales de personales.",
                assetType: "Data",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: false, ig3: true }
            }
        ]
    },
    {
        controlNumber: 5,
        title: "Gestión de Cuentas",
        description: "Utilizar procesos y herramientas para asignar y gestionar la autorización de credenciales para cuentas de usuario, administrador y servicio.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "5.1",
                title: "Establecer y mantener un inventario de cuentas",
                description: "Establecer y mantener un inventario de todas las cuentas gestionadas (usuario, administrador, servicio).",
                assetType: "Users",
                securityFunction: "Identify",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "5.2",
                title: "Usar contraseñas únicas",
                description: "Usar contraseñas únicas para todos los activos empresariales (mínimo 8 caracteres con MFA, 14 sin MFA).",
                assetType: "Users",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "5.3",
                title: "Deshabilitar cuentas inactivas",
                description: "Eliminar o deshabilitar cualquier cuenta inactiva después de 45 días de inactividad.",
                assetType: "Users",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "5.4",
                title: "Restringir privilegios de administrador",
                description: "Restringir privilegios de administrador a cuentas dedicadas. Realizar actividades generales desde cuentas no privilegiadas.",
                assetType: "Users",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "5.5",
                title: "Establecer y mantener un inventario de cuentas de servicio",
                description: "Establecer y mantener un inventario de cuentas de servicio y revisarlas periódicamente.",
                assetType: "Users",
                securityFunction: "Identify",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "5.6",
                title: "Centralizar la gestión de cuentas",
                description: "Centralizar la gestión de cuentas mediante un directorio o servicio de identidad.",
                assetType: "Users",
                securityFunction: "Govern",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            }
        ]
    },
    {
        controlNumber: 6,
        title: "Gestión de Control de Acceso",
        description: "Utilizar procesos y herramientas para crear, asignar, gestionar y revocar credenciales de acceso y privilegios.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "6.1",
                title: "Proceso de otorgamiento de acceso",
                description: "Establecer y seguir un proceso documentado para otorgar acceso a activos empresariales (nuevos empleados o cambios de rol).",
                assetType: "Documentation",
                securityFunction: "Govern",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "6.2",
                title: "Proceso de revocación de acceso",
                description: "Establecer y seguir un proceso para revocar acceso y deshabilitar cuentas inmediatamente tras la terminación o cambio de rol.",
                assetType: "Documentation",
                securityFunction: "Govern",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "6.3",
                title: "Requerir MFA para aplicaciones expuestas externamente",
                description: "Requerir MFA para todas las aplicaciones empresariales o de terceros expuestas externamente.",
                assetType: "Users",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "6.4",
                title: "Requerir MFA para acceso remoto",
                description: "Requerir MFA para el acceso remoto a la red.",
                assetType: "Users",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "6.5",
                title: "Requerir MFA para acceso administrativo",
                description: "Requerir MFA para todas las cuentas con acceso administrativo en todos los activos empresariales.",
                assetType: "Users",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "6.6",
                title: "Inventario de sistemas de autenticación y autorización",
                description: "Establecer y mantener un inventario de los sistemas de autenticación y autorización de la empresa.",
                assetType: "Software",
                securityFunction: "Identify",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "6.7",
                title: "Centralizar el control de acceso",
                description: "Centralizar el control de acceso para todos los activos empresariales a través de un servicio de directorio o SSO.",
                assetType: "Users",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "6.8",
                title: "Definir y mantener control de acceso basado en roles",
                description: "Definir y mantener el control de acceso basado en roles (RBAC) y realizar revisiones periódicas.",
                assetType: "Users",
                securityFunction: "Govern",
                implementationGroups: { ig1: false, ig2: false, ig3: true }
            }
        ]
    },
    {
        controlNumber: 7,
        title: "Gestión Continua de Vulnerabilidades",
        description: "Desarrollar un plan para evaluar y rastrear continuamente las vulnerabilidades en todos los activos empresariales para remediarlas.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "7.1",
                title: "Proceso de gestión de vulnerabilidades",
                description: "Establecer y mantener un proceso documentado de gestión de vulnerabilidades para los activos empresariales.",
                assetType: "Documentation",
                securityFunction: "Govern",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "7.2",
                title: "Estrategia de remediación basada en riesgos",
                description: "Establecer y mantener una estrategia de remediación basada en riesgos documentada en un proceso de remediación.",
                assetType: "Documentation",
                securityFunction: "Govern",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "7.3",
                title: "Actualizaciones automáticas del sistema operativo",
                description: "Realizar actualizaciones del sistema operativo mediante gestión automatizada de parches mensualmente o más frecuente.",
                assetType: "Software",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "7.4",
                title: "Actualizaciones automáticas de aplicaciones",
                description: "Realizar actualizaciones de aplicaciones mediante gestión automatizada de parches mensualmente o más frecuente.",
                assetType: "Software",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "7.5",
                title: "Escaneos automatizados de vulnerabilidades internas",
                description: "Realizar escaneos automatizados de vulnerabilidades en activos internos trimestralmente o más frecuente.",
                assetType: "Software",
                securityFunction: "Identify",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "7.6",
                title: "Escaneos automatizados de vulnerabilidades externas",
                description: "Realizar escaneos automatizados de vulnerabilidades en activos expuestos externamente mensualmente o más frecuente.",
                assetType: "Software",
                securityFunction: "Identify",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "7.7",
                title: "Remediar vulnerabilidades detectadas",
                description: "Remediar las vulnerabilidades detectadas en el software mensualmente o más frecuente, según el proceso de remediación.",
                assetType: "Software",
                securityFunction: "Respond",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            }
        ]
    },
    {
        controlNumber: 8,
        title: "Gestión de Registros de Auditoría",
        description: "Recopilar, alertar, revisar y conservar los registros de auditoría de eventos que puedan ayudar a detectar, comprender o recuperarse de un ataque.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "8.1",
                title: "Proceso de gestión de registros de auditoría",
                description: "Establecer y mantener un proceso documentado de gestión de registros de auditoría.",
                assetType: "Documentation",
                securityFunction: "Govern",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "8.2",
                title: "Recopilar registros de auditoría",
                description: "Recopilar los registros de auditoría y asegurar que el registro esté habilitado en todos los activos empresariales.",
                assetType: "Data",
                securityFunction: "Detect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "8.3",
                title: "Asegurar capacidad de almacenamiento de registros",
                description: "Garantizar que los destinos de registro mantengan una capacidad de almacenamiento adecuada.",
                assetType: "Data",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "8.4",
                title: "Estandarizar sincronización de tiempo",
                description: "Configurar al menos dos fuentes de tiempo sincronizadas en todos los activos empresariales.",
                assetType: "Network",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "8.5",
                title: "Configurar registro detallado de auditoría",
                description: "Configurar el registro detallado para activos con datos sensibles (fuente, fecha, usuario, timestamp, direcciones, etc.).",
                assetType: "Data",
                securityFunction: "Detect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "8.6",
                title: "Recopilar registros de consultas DNS",
                description: "Recopilar registros de auditoría de consultas DNS en los activos empresariales.",
                assetType: "Data",
                securityFunction: "Detect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "8.7",
                title: "Recopilar registros de solicitudes URL",
                description: "Recopilar registros de auditoría de solicitudes de URL en los activos empresariales.",
                assetType: "Data",
                securityFunction: "Detect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "8.8",
                title: "Recopilar registros de línea de comandos",
                description: "Recopilar registros de auditoría de línea de comandos (ej. PowerShell, BASH).",
                assetType: "Data",
                securityFunction: "Detect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "8.9",
                title: "Centralizar registros de auditoría",
                description: "Centralizar la recopilación y retención de registros de auditoría (ej. usando SIEM).",
                assetType: "Data",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "8.10",
                title: "Conservar registros de auditoría",
                description: "Conservar los registros de auditoría por un mínimo de 90 días.",
                assetType: "Data",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "8.11",
                title: "Realizar revisiones de registros de auditoría",
                description: "Realizar revisiones de los registros para detectar anomalías al menos semanalmente.",
                assetType: "Data",
                securityFunction: "Detect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "8.12",
                title: "Recopilar registros del proveedor de servicios",
                description: "Recopilar registros del proveedor de servicios (eventos de autenticación, creación de datos, etc.).",
                assetType: "Data",
                securityFunction: "Detect",
                implementationGroups: { ig1: false, ig2: false, ig3: true }
            }
        ]
    },
    {
        controlNumber: 9,
        title: "Protección del Correo Electrónico y Navegadores Web",
        description: "Mejorar las protecciones y detecciones contra amenazas provenientes de vectores de correo electrónico y web.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "9.1",
                title: "Usar solo navegadores y clientes de correo soportados",
                description: "Garantizar que solo se permita la ejecución de navegadores y clientes de correo totalmente compatibles y actualizados.",
                assetType: "Software",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "9.2",
                title: "Utilizar filtrado DNS",
                description: "Utilizar servicios de filtrado DNS en todos los dispositivos de usuario final para bloquear dominios maliciosos.",
                assetType: "Devices",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "9.3",
                title: "Hacer cumplir filtros de URL",
                description: "Hacer cumplir y actualizar los filtros de URL basados en la red para limitar la conexión a sitios web maliciosos.",
                assetType: "Network",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "9.4",
                title: "Restringir extensiones de navegador/correo",
                description: "Restringir, desinstalar o deshabilitar extensiones o complementos no autorizados o innecesarios.",
                assetType: "Software",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "9.5",
                title: "Implementar DMARC",
                description: "Implementar política y verificación DMARC, comenzando con SPF y DKIM.",
                assetType: "Network",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "9.6",
                title: "Bloquear tipos de archivos innecesarios",
                description: "Bloquear los tipos de archivos innecesarios en la puerta de enlace de correo electrónico.",
                assetType: "Network",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "9.7",
                title: "Implementar protecciones antimalware en correo",
                description: "Implementar protecciones antimalware en el servidor de correo (escaneo de adjuntos, sandboxing).",
                assetType: "Network",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: false, ig3: true }
            }
        ]
    },
    {
        controlNumber: 10,
        title: "Defensas Contra Malware",
        description: "Prevenir o controlar la instalación, propagación y ejecución de aplicaciones, código o scripts maliciosos.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "10.1",
                title: "Implementar y mantener software antimalware",
                description: "Implementar y mantener software antimalware en todos los activos empresariales.",
                assetType: "Devices",
                securityFunction: "Detect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "10.2",
                title: "Configurar actualizaciones automáticas de firmas",
                description: "Configurar actualizaciones automáticas de los archivos de firmas antimalware en todos los activos.",
                assetType: "Devices",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "10.3",
                title: "Deshabilitar ejecución automática",
                description: "Deshabilitar la funcionalidad de ejecución automática y reproducción automática para medios extraíbles.",
                assetType: "Devices",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "10.4",
                title: "Escanear medios extraíbles",
                description: "Configurar el software antimalware para que escanee automáticamente los medios extraíbles.",
                assetType: "Devices",
                securityFunction: "Detect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "10.5",
                title: "Habilitar protección contra explotación",
                description: "Habilitar funciones de protección contra explotación (DEP, WDEG, SIP, Gatekeeper) cuando sea posible.",
                assetType: "Devices",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "10.6",
                title: "Gestionar centralizadamente el antimalware",
                description: "Gestionar centralizadamente el software antimalware.",
                assetType: "Devices",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "10.7",
                title: "Utilizar antimalware basado en comportamiento",
                description: "Utilizar software antimalware basado en comportamiento.",
                assetType: "Devices",
                securityFunction: "Detect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            }
        ]
    },
    {
        controlNumber: 11,
        title: "Recuperación de Datos",
        description: "Establecer y mantener prácticas de recuperación de datos suficientes para restaurar los activos empresariales.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "11.1",
                title: "Establecer proceso de recuperación de datos",
                description: "Establecer y mantener un proceso documentado de recuperación de datos que incluya procedimientos de respaldo.",
                assetType: "Documentation",
                securityFunction: "Govern",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "11.2",
                title: "Realizar respaldos automatizados",
                description: "Realizar respaldos automatizados semanalmente o con mayor frecuencia.",
                assetType: "Data",
                securityFunction: "Recover",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "11.3",
                title: "Proteger datos de recuperación",
                description: "Proteger los datos de recuperación con controles equivalentes a los originales (cifrado, separación).",
                assetType: "Data",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "11.4",
                title: "Mantener instancia aislada de recuperación",
                description: "Establecer y mantener una instancia aislada de los datos de recuperación (offline, nube, offsite).",
                assetType: "Data",
                securityFunction: "Recover",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "11.5",
                title: "Probar recuperación de datos",
                description: "Probar la recuperación de respaldos trimestralmente o con mayor frecuencia para una muestra de activos.",
                assetType: "Data",
                securityFunction: "Recover",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            }
        ]
    },
    {
        controlNumber: 12,
        title: "Gestión de la Infraestructura de Red",
        description: "Establecer, implementar y gestionar activamente los dispositivos de red.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "12.1",
                title: "Mantener infraestructura de red actualizada",
                description: "Asegurar que la infraestructura de red se mantenga actualizada con versiones estables y soportadas.",
                assetType: "Network",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "12.2",
                title: "Arquitectura de red segura",
                description: "Diseñar y mantener una arquitectura de red segura (segmentación, menor privilegio, disponibilidad).",
                assetType: "Network",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "12.3",
                title: "Gestionar infraestructura de red de forma segura",
                description: "Gestionar de forma segura la infraestructura de red (IaC, SSH, HTTPS).",
                assetType: "Network",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "12.4",
                title: "Documentación de arquitectura de red",
                description: "Establecer y mantener diagramas de arquitectura y documentación del sistema de red.",
                assetType: "Documentation",
                securityFunction: "Govern",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "12.5",
                title: "Centralizar AAA de la red",
                description: "Centralizar los servicios de Autenticación, Autorización y Auditoría (AAA) de la red.",
                assetType: "Network",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "12.6",
                title: "Protocolos seguros de gestión y comunicación",
                description: "Adoptar protocolos seguros de gestión (802.1X) y comunicación (WPA2 Enterprise).",
                assetType: "Network",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "12.7",
                title: "Autenticación para acceso remoto",
                description: "Requerir autenticación en VPN y servicios antes de acceder a recursos desde dispositivos de usuario final.",
                assetType: "Devices",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "12.8",
                title: "Recursos de administración dedicados",
                description: "Establecer recursos informáticos dedicados y segmentados para tareas administrativas.",
                assetType: "Devices",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: false, ig3: true }
            }
        ]
    },
    {
        controlNumber: 13,
        title: "Monitoreo y Defensa de la Red",
        description: "Operar procesos y herramientas para establecer y mantener un monitoreo integral de la red y defensa contra amenazas.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "13.1",
                title: "Centralizar alertas de eventos",
                description: "Centralizar la generación de alertas de eventos de seguridad para correlación y análisis (SIEM).",
                assetType: "Network",
                securityFunction: "Detect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "13.2",
                title: "Detección de intrusiones basada en host",
                description: "Implementar solución de detección de intrusiones basada en host (HIDS) cuando sea apropiado.",
                assetType: "Devices",
                securityFunction: "Detect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "13.3",
                title: "Detección de intrusiones en red",
                description: "Implementar solución de detección de intrusiones en red (NIDS) cuando sea apropiado.",
                assetType: "Network",
                securityFunction: "Detect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "13.4",
                title: "Filtrado de tráfico entre segmentos",
                description: "Realizar filtrado de tráfico entre segmentos de red.",
                assetType: "Network",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "13.5",
                title: "Gestionar control de acceso remoto",
                description: "Gestionar el acceso remoto basándose en el estado de seguridad del dispositivo (antimalware, parches, configuración).",
                assetType: "Devices",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "13.6",
                title: "Recopilar registros de tráfico de red",
                description: "Recopilar registros de flujo de tráfico (NetFlow) para revisión y alertas.",
                assetType: "Network",
                securityFunction: "Detect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "13.7",
                title: "Prevención de intrusiones basada en host",
                description: "Implementar prevención de intrusiones basada en host (HIPS/EDR).",
                assetType: "Devices",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: false, ig3: true }
            },
            {
                originalId: "13.8",
                title: "Prevención de intrusiones en red",
                description: "Implementar prevención de intrusiones en red (NIPS).",
                assetType: "Network",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: false, ig3: true }
            },
            {
                originalId: "13.9",
                title: "Control de acceso a nivel de puerto",
                description: "Implementar control de acceso a nivel de puerto (802.1x).",
                assetType: "Network",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: false, ig3: true }
            },
            {
                originalId: "13.10",
                title: "Filtrado a nivel de capa de aplicación",
                description: "Realizar filtrado a nivel de capa de aplicación (proxy, firewall de capa 7).",
                assetType: "Network",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: false, ig3: true }
            },
            {
                originalId: "13.11",
                title: "Ajustar umbrales de alerta",
                description: "Ajustar los umbrales de alerta de eventos de seguridad mensualmente o con mayor frecuencia.",
                assetType: "Network",
                securityFunction: "Detect",
                implementationGroups: { ig1: false, ig2: false, ig3: true }
            }
        ]
    },
    {
        controlNumber: 14,
        title: "Concientización sobre Seguridad y Capacitación en Habilidades",
        description: "Establecer y mantener un programa de concientización sobre seguridad para influir en el comportamiento del personal.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "14.1",
                title: "Establecer programa de concientización",
                description: "Establecer y mantener un programa de concientización sobre seguridad. Impartir capacitación al contratar y anualmente.",
                assetType: "Documentation",
                securityFunction: "Govern",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "14.2",
                title: "Capacitar sobre ingeniería social",
                description: "Capacitar al personal para reconocer ataques de ingeniería social (phishing, BEC, pretexting).",
                assetType: "Users",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "14.3",
                title: "Capacitar sobre autenticación",
                description: "Capacitar al personal en buenas prácticas de autenticación (MFA, contraseñas).",
                assetType: "Users",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "14.4",
                title: "Capacitar sobre manejo de datos",
                description: "Capacitar al personal sobre cómo identificar, almacenar, transferir y destruir datos sensibles.",
                assetType: "Users",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "14.5",
                title: "Capacitar sobre exposición de datos",
                description: "Capacitar al personal sobre causas de exposición involuntaria de datos.",
                assetType: "Users",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "14.6",
                title: "Capacitar sobre reconocimiento de incidentes",
                description: "Capacitar al personal para reconocer y reportar posibles incidentes.",
                assetType: "Users",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "14.7",
                title: "Capacitar sobre reporte de fallas de actualización",
                description: "Capacitar al personal para verificar y reportar falta de actualizaciones o fallas en herramientas automatizadas.",
                assetType: "Users",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "14.8",
                title: "Capacitar sobre redes inseguras",
                description: "Capacitar sobre los peligros de conectarse a redes inseguras.",
                assetType: "Users",
                securityFunction: "Protect",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "14.9",
                title: "Capacitación específica según rol",
                description: "Realizar capacitación en concientización y habilidades específicas según el rol.",
                assetType: "Users",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            }
        ]
    },
    {
        controlNumber: 15,
        title: "Gestión de Proveedores de Servicios",
        description: "Desarrollar un proceso para evaluar a los proveedores de servicios que manejan datos sensibles o plataformas críticas.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "15.1",
                title: "Inventario de proveedores de servicios",
                description: "Establecer y mantener un inventario de proveedores de servicios con clasificaciones y contactos.",
                assetType: "Users",
                securityFunction: "Identify",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "15.2",
                title: "Política de gestión de proveedores",
                description: "Establecer y mantener una política de gestión de proveedores que aborde clasificación, evaluación y monitoreo.",
                assetType: "Documentation",
                securityFunction: "Govern",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "15.3",
                title: "Clasificar proveedores",
                description: "Clasificar proveedores según sensibilidad, volumen de datos, riesgo, etc.",
                assetType: "Users",
                securityFunction: "Govern",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "15.4",
                title: "Incluir requisitos de seguridad en contratos",
                description: "Asegurar que los contratos incluyan requisitos de seguridad (notificación de incidentes, cifrado, etc.).",
                assetType: "Documentation",
                securityFunction: "Govern",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "15.5",
                title: "Evaluar proveedores",
                description: "Evaluar proveedores según la política (SOC 2, cuestionarios, etc.) al menos anualmente.",
                assetType: "Users",
                securityFunction: "Govern",
                implementationGroups: { ig1: false, ig2: false, ig3: true }
            },
            {
                originalId: "15.6",
                title: "Monitorear proveedores",
                description: "Monitorear proveedores según la política (reevaluación, notas de versión, dark web).",
                assetType: "Data",
                securityFunction: "Govern",
                implementationGroups: { ig1: false, ig2: false, ig3: true }
            },
            {
                originalId: "15.7",
                title: "Desactivar proveedores de forma segura",
                description: "Desactivar de forma segura a los proveedores (desactivar cuentas, eliminar datos).",
                assetType: "Data",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: false, ig3: true }
            }
        ]
    },
    {
        controlNumber: 16,
        title: "Seguridad del Software de Aplicación",
        description: "Gestionar el ciclo de vida de seguridad del software desarrollado internamente, alojado o adquirido.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "16.1",
                title: "Proceso de desarrollo seguro",
                description: "Establecer y mantener un proceso de desarrollo seguro de aplicaciones (diseño seguro, codificación segura, pruebas).",
                assetType: "Documentation",
                securityFunction: "Govern",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "16.2",
                title: "Proceso de vulnerabilidades de software",
                description: "Establecer un proceso para aceptar y abordar reportes de vulnerabilidades de software.",
                assetType: "Documentation",
                securityFunction: "Govern",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "16.3",
                title: "Análisis de causa raíz",
                description: "Realizar análisis de causa raíz sobre las vulnerabilidades de seguridad.",
                assetType: "Software",
                securityFunction: "Detect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "16.4",
                title: "Inventario de componentes de terceros",
                description: "Establecer y gestionar un inventario actualizado (SBOM) de componentes de terceros.",
                assetType: "Software",
                securityFunction: "Identify",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "16.5",
                title: "Usar componentes confiables",
                description: "Usar componentes de software de terceros que sean confiables y estén actualizados.",
                assetType: "Software",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "16.6",
                title: "Sistema de clasificación de severidad",
                description: "Establecer un sistema de clasificación de severidad para priorizar vulnerabilidades.",
                assetType: "Documentation",
                securityFunction: "Govern",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "16.7",
                title: "Plantillas de configuración reforzada",
                description: "Utilizar plantillas estándar de configuración reforzada para la infraestructura de aplicaciones.",
                assetType: "Software",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "16.8",
                title: "Separar entornos",
                description: "Mantener entornos separados para los sistemas de producción y no producción.",
                assetType: "Network",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "16.9",
                title: "Capacitación a desarrolladores",
                description: "Asegurar que el personal de desarrollo reciba capacitación en codificación segura al menos anualmente.",
                assetType: "Users",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "16.10",
                title: "Principios de diseño seguro",
                description: "Aplicar principios de diseño seguro (menor privilegio, validación de entradas) en la arquitectura.",
                assetType: "Software",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "16.11",
                title: "Módulos verificados",
                description: "Utilizar módulos o servicios verificados para componentes de seguridad (identidad, cifrado, auditoría).",
                assetType: "Software",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "16.12",
                title: "Análisis estático y dinámico",
                description: "Aplicar herramientas de análisis estático y dinámico (SAST/DAST) para verificar prácticas de codificación segura.",
                assetType: "Software",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: false, ig3: true }
            },
            {
                originalId: "16.13",
                title: "Pruebas de penetración en aplicaciones",
                description: "Realizar pruebas de penetración en aplicaciones (autenticadas y no autenticadas).",
                assetType: "Software",
                securityFunction: "Detect",
                implementationGroups: { ig1: false, ig2: false, ig3: true }
            },
            {
                originalId: "16.14",
                title: "Modelado de amenazas",
                description: "Realizar modelado de amenazas para identificar fallas de diseño antes de crear el código.",
                assetType: "Software",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: false, ig3: true }
            }
        ]
    },
    {
        controlNumber: 17,
        title: "Gestión de Respuesta ante Incidentes",
        description: "Establecer un programa para desarrollar y mantener una capacidad de respuesta ante incidentes.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "17.1",
                title: "Designar personal de gestión de incidentes",
                description: "Designar a una persona clave y un respaldo encargados del proceso de manejo de incidentes.",
                assetType: "Users",
                securityFunction: "Respond",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "17.2",
                title: "Información de contacto",
                description: "Establecer y mantener información de contacto para las partes que deben ser informadas sobre incidentes.",
                assetType: "Documentation",
                securityFunction: "Govern",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "17.3",
                title: "Proceso de reporte de incidentes",
                description: "Establecer y mantener un proceso para que el personal reporte incidentes de seguridad.",
                assetType: "Documentation",
                securityFunction: "Govern",
                implementationGroups: { ig1: true, ig2: true, ig3: true }
            },
            {
                originalId: "17.4",
                title: "Proceso de respuesta ante incidentes",
                description: "Establecer y mantener un proceso documentado de respuesta ante incidentes (roles, cumplimiento, comunicación).",
                assetType: "Documentation",
                securityFunction: "Govern",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "17.5",
                title: "Roles y responsabilidades",
                description: "Asignar roles y responsabilidades clave para la respuesta ante incidentes.",
                assetType: "Users",
                securityFunction: "Respond",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "17.6",
                title: "Mecanismos de comunicación",
                description: "Determinar mecanismos primarios y secundarios de comunicación y reporte durante un incidente.",
                assetType: "Users",
                securityFunction: "Respond",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "17.7",
                title: "Ejercicios de respuesta",
                description: "Planificar y ejecutar ejercicios y escenarios rutinarios de respuesta ante incidentes.",
                assetType: "Users",
                securityFunction: "Recover",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "17.8",
                title: "Revisiones posteriores a incidentes",
                description: "Realizar revisiones posteriores (lecciones aprendidas) para prevenir recurrencia.",
                assetType: "Users",
                securityFunction: "Recover",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "17.9",
                title: "Umbrales de incidentes",
                description: "Establecer umbrales para diferenciar incidentes de eventos.",
                assetType: "Documentation",
                securityFunction: "Govern",
                implementationGroups: { ig1: false, ig2: false, ig3: true }
            }
        ]
    },
    {
        controlNumber: 18,
        title: "Pruebas de Penetración",
        description: "Probar la eficacia y resiliencia de los activos empresariales mediante la identificación y explotación de debilidades.",
        version: "v8.1",
        safeguards: [
            {
                originalId: "18.1",
                title: "Programa de pruebas de penetración",
                description: "Establecer y mantener un programa de pruebas de penetración (alcance, frecuencia, limitaciones).",
                assetType: "Documentation",
                securityFunction: "Govern",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "18.2",
                title: "Pruebas de penetración externas",
                description: "Realizar pruebas de penetración externas periódicas (al menos anualmente).",
                assetType: "Network",
                securityFunction: "Detect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "18.3",
                title: "Remediar hallazgos",
                description: "Remediar los hallazgos de las pruebas de penetración según el proceso de remediación.",
                assetType: "Network",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: true, ig3: true }
            },
            {
                originalId: "18.4",
                title: "Validar medidas de seguridad",
                description: "Validar las medidas de seguridad después de cada prueba de penetración.",
                assetType: "Network",
                securityFunction: "Protect",
                implementationGroups: { ig1: false, ig2: false, ig3: true }
            },
            {
                originalId: "18.5",
                title: "Pruebas de penetración internas",
                description: "Realizar pruebas de penetración internas periódicas (al menos anualmente).",
                assetType: "Network",
                securityFunction: "Detect",
                implementationGroups: { ig1: false, ig2: false, ig3: true }
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
