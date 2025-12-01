# 📋 Roadmap: Hacknoid CIS Platform

## 🏗️ Fase 0: Andamiaje e Infraestructura (EN PROGRESO)
- [x] 0.1. Inicializar repositorio Git (`git init`).
- [x] 0.2. Crear estructura de carpetas (`client`, `server`).
- [x] 0.3. Crear `docker-compose.dev.yml`.
- [x] 0.4. Configurar `Dockerfile` Backend.
- [x] 0.5. Configurar `Dockerfile` Frontend.
- [x] 0.6. Validar que los contenedores levantan (`docker-compose up`).

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
