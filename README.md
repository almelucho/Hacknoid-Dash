# 🛡️ Hacknoid CIS Control Panel

Plataforma integral para la gestión, auditoría y cumplimiento de ciberseguridad basada en los controles **CIS v8.1**.

## 🚀 Instalación y Despliegue

### Requisitos Previos
*   Docker y Docker Compose
*   Node.js (Opcional, para desarrollo local sin Docker)

### Iniciar Entorno de Desarrollo
```bash
# Levantar contenedores (Frontend + Backend + MongoDB)
docker-compose -f docker-compose.dev.yml up --build
```
El sistema estará disponible en:
*   **Frontend**: http://localhost:5173
*   **Backend API**: http://localhost:5000

---

## ✨ Funcionalidades Principales

### 🔐 1. Seguridad y Accesos
*   **Autenticación Robusta**: Sistema de Login seguro basado en **JWT (JSON Web Tokens)**.
*   **Control de Acceso Basado en Roles (RBAC)**:
    *   `Admin`: Control total del sistema (Crear proyectos, gestionar clientes, editar auditorías).
    *   `Client Viewer`: Acceso restringido de solo lectura a sus propios proyectos asignados.
*   **Protección de Rutas**: Middleware de seguridad que protege endpoints críticos tanto en el Backend como en el Frontend.

### 🏢 2. Gestión de Clientes y Proyectos
*   **Gestión de Clientes**: Módulo para dar de alta empresas, subir sus logotipos corporativos y administrar sus usuarios.
*   **Proyectos de Auditoría**:
    *   Creación de proyectos vinculados a clientes específicos.
    *   **Perfiles de Implementación CIS**: Selección automática de perfiles (IG1, IG2, IG3) que adapta la carga de controles según el tamaño de la organización.
*   **Dashboard Ejecutivo**: Vista resumen con tarjetas de estado de proyectos y barras de progreso global en tiempo real.

### 📋 3. Motor de Auditoría (Core)
El corazón del sistema sigue estrictamente la jerarquía **CIS v8.1**:
1.  **Políticas Generales**: Gobernanza de alto nivel del proyecto.
2.  **Controles (1-18)**: Los 18 dominios críticos de seguridad.
3.  **Salvaguardas**: Requerimientos técnicos y procedimentales específicos.
4.  **Actividades**: Tareas granulares y accionables para cumplir cada salvaguarda.

*   **Cálculo Automático de Cumplimiento**: Algoritmo que calcula el porcentaje de avance en tiempo real (Actividad → Salvaguarda → Control → Global).
*   **Gestión de Aplicabilidad (N/A)**:
    *   Permite marcar salvaguardas como "No Aplica".
    *   Excluye automáticamente estas salvaguardas del denominador en los cálculos matemáticos.
    *   Requiere justificación obligatoria para auditoría.

### 🛠️ 4. Gestión Operativa Avanzada
*   **Flexibilidad Total (CRUD)**: Capacidad de agregar controles, salvaguardas y actividades personalizadas ("a medida") fuera del estándar CIS si es necesario.
*   **Detalle de Actividad Enriquecido**:
    *   **Periodicidad**: Configuración de frecuencia (Única, Semanal, Mensual, Trimestral, Anual).
    *   **Chat de Auditoría**: Hilo de comentarios con fecha, hora y usuario para trazabilidad de discusiones.
    *   **Bitácora de Ejecuciones**: Historial para registrar cumplimientos recurrentes (ej: "Revisión de Logs - Semana 42: OK").
*   **Gestión de Evidencias**:
    *   Subida de archivos probatorios a nivel de Políticas Generales.
    *   Subida de evidencias específicas por Actividad.
    *   Adjunto de archivos en cada ejecución de la Bitácora.

### 🤖 5. Herramientas Inteligentes
*   **Agente IA (Hacknoid AI)**:
    *   Asistente virtual integrado en la vista de auditoría.
    *   **Context-Aware**: Conoce el estado real del proyecto (porcentajes, controles fallidos) para dar recomendaciones precisas.
    *   *Nota: Actualmente opera en "Modo Simulación" (Mock) a la espera de activación de API Key.*
*   **Reportes Ejecutivos PDF**: Generación automática de informes profesionales con portada, resumen ejecutivo, score global y tablas detalladas de cumplimiento.

### ⚙️ 6. Infraestructura Tecnológica
*   **Arquitectura de Microservicios (Docker)**: Frontend (React/Vite) y Backend (Node/Express) en contenedores aislados.
*   **Base de Datos NoSQL**: MongoDB con esquemas anidados optimizados para estructuras jerárquicas complejas.
*   **Frontend Moderno**: React + TailwindCSS para una interfaz rápida, responsiva y profesional.