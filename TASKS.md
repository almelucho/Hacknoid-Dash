# 📋 Roadmap: Hacknoid CIS Platform

## 🏗️ Fase 0: Andamiaje e Infraestructura (EN PROGRESO)
- [x] 0.1. Inicializar repositorio Git (`git init`).
- [x] 0.2. Crear estructura de carpetas (`client`, `server`).
- [x] 0.3. Crear `docker-compose.dev.yml`.
- [x] 0.4. Configurar `Dockerfile` Backend.
- [x] 0.5. Configurar `Dockerfile` Frontend.
- [x] 0.6. Validar que los contenedores levantan (`docker-compose up`).
- [ ] 0.7. Configurar protección de rama `main` en GitHub (Manual).
- [ ] 0.8. Sincronizar repositorio remoto:
  - [ ] Ejecutar: `git push -u origin main`
  - [ ] Ejecutar: `git push -u origin develop`

## 🧠 Fase 1: El Cerebro de Datos (Backend Core)
- [x] 1.1. Configurar conexión MongoDB (Mongoose).
- [x] 1.2. Crear Modelos: `CisTemplate`, `Project`, `User`.
- [x] 1.3. Crear script `seed.js` con los datos de CIS v8.1.
- [x] 1.4. Implementar endpoints básicos (`GET /projects`, `POST /projects`).

## 🎨 Fase 2: La Cara Visible (Frontend UI)
- [x] 2.1. Instalar TailwindCSS con colores corporativos.
- [x] 2.2. Crear Layout Principal (Sidebar, Navbar).
- [x] 2.3. Crear Dashboard de Clientes.
- [x] 2.4. Crear Vista de Auditoría (Acordeón de Controles).

## � Fase 3: Lógica y Cálculo
- [x] 3.1. CRUD de Actividades (Editar estado, notas).
- [x] 3.2. Motor de Cálculo (Porcentajes y Promedios).
- [x] 3.3. Gestión de Controles y Salvaguardas (CRUD).
- [x] 3.4. Lógica de "No Aplica" (N/A).
- [x] 3.5. Actualización de Esquema (Clientes, Roles).
- [x] 3.6. Autenticación (JWT, Login, Middleware).
- [x] 3.7. Creación de Proyectos Vinculados.
- [x] 3.8. Gestión de Clientes (UI, Logos, Usuarios).
- [x] 3.9. RBAC y Seguridad (Protección de Rutas).

## 📎 Fase 4: Gestión de Archivos
- [ ] 4.1. Configurar Multer (Backend) para subida de archivos.
- [ ] 4.2. Implementar Storage Adapter (Local/S3).
- [ ] 4.3. Crear componente de Upload en Frontend.

## �🤖 Fase 5: Agente IA (Gemini)
- [ ] 5.1. Configurar cliente Gemini en Node.js.
- [ ] 5.2. Crear "Tools" para la IA (crear proyecto, buscar control).
- [ ] 5.3. Implementar Chat Widget en Frontend.

## 🚀 Fase 6: Producción
- [ ] 6.1. Configurar Nginx para producción.
- [ ] 6.2. Implementar generación de reportes PDF.
- [ ] 6.3. Testing final y despliegue.

---

## 📅 Bitácora de Cambios (01/12/2025)

### ✅ Frontend (UI/UX)
- Implementación de **Navegación** entre Dashboard y Vista de Auditoría.
- Creación de **AuditView** con jerarquía de 3 niveles (Control > Salvaguarda > Actividad).
- Implementación de **Toggle N/A** para marcar salvaguardas como no aplicables.
- Interfaz para **CRUD Manual**: Botones para crear/eliminar controles y salvaguardas.
- **Mejora Visual de Actividades**:
  - Botones de estado con texto y color (Completado, En Progreso, No Iniciado).
  - Botón de eliminar actividad (visible al hover).

### ✅ Backend (Lógica)
- **Refactorización de Modelos**: Cambio a estructura anidada `Project -> Controls -> Safeguards -> Activities`.
- **Motor de Cálculo**:
  - Cálculo automático de porcentajes de salvaguardas.
  - Promedio de controles excluyendo salvaguardas N/A.
- **API Endpoints**:
  - `POST /controls`, `DELETE /controls/:id`
  - `POST /safeguards`, `DELETE /safeguards/:id`
  - `PATCH /applicability` (Lógica N/A)
  - `POST /activities`, `PATCH /activities/:id` (Status)
- **Datos**: Actualización de `seed.js` con Control 1 de CIS v8.1 en español.

### 📅 Bitácora de Cambios (02/12/2025)

### ✅ Seguridad y RBAC
- **Autenticación Completa**: Login funcional con JWT.
- **Roles de Usuario**: `admin` (Super Administrador) y `client_viewer` (Auditor Cliente).
- **Gestión de Clientes**: Módulo para crear empresas, subir logos y crear usuarios asociados.
- **Protección de Rutas**: Middleware `auth` que protege endpoints críticos.
- **Filtrado de Datos**: Los usuarios clientes solo ven sus propios proyectos.
- **Frontend Seguro**: Inyección de `x-auth-token` en todas las peticiones fetch.

### ✅ Debug y Verificación (02/12/2025)
- [x] **Debug**: Resolver error "no funciona" reportado al levantar el entorno (Fix: Mismatch de JWT Secret).
- [x] **Verificación**: Probar login con usuario cliente y validar permisos.

## 🔗 Fase 3.5: Vinculación y Gestión Avanzada (NUEVO)
- [x] 3.5.1. **Vincular Proyectos a Clientes**:
  - Backend: `createProject` recibe `clientId`.
  - Frontend: Dropdown de empresas en "Nuevo Proyecto".
- [x] 3.7.2. **Mejora Visual Toggle**:
  - [x] Frontend: Toggle Naranja (Activo) / Gris (Inactivo).
- [x] 3.7.3. **Gestión de Clientes (CRUD Completo)**:
  - [x] Backend: Endpoints PUT y DELETE para Clientes (con Cascada).
  - [x] Frontend: Botones Editar y Eliminar en ClientsView.
- [x] 3.7.4. **Gestión de Proyectos (CRUD Completo)**:
  - [x] Backend: Endpoints PUT y DELETE para Proyectos.
  - [x] Frontend: Botones Editar y Eliminar en ProjectCard.

## 📅 Fase 3.8: Seguimiento Recurrente (Bitácora)
- [ ] 3.8.1. **Bitácora de Ejecuciones**:
  - Backend: Schema `Execution` (Periodo, Estado, Evidencia).
  - Frontend: Tabla de ejecuciones en `ActivityDetailModal`.
  - Features: Reemplazo de Excel para controles periódicos.

## 🛡️ Fase 4: Refinamiento de Evidencias y Políticas
- [ ] 4.1. **Lógica de Política Madre**:
  - Backend: Validar peso de "Política General" en porcentaje global.
- [ ] 4.2. **Descarga de Evidencias**:
  - Frontend: Asegurar descarga para usuario cliente.
- [ ] 4.3. **Gestión de Archivos (Continuación)**:
  - Configurar Multer/Storage (ya iniciado).
