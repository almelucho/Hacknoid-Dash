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

## 🧮 Fase 3: Lógica y Cálculo
- [ ] 3.1. CRUD de Actividades (Editar estado, notas).
- [ ] 3.2. Implementar lógica de cálculo de porcentajes.
- [ ] 3.3. Configurar Socket.io para actualizaciones en tiempo real.

## 📎 Fase 4: Gestión de Archivos
- [ ] 4.1. Configurar Multer (Backend) para subida de archivos.
- [ ] 4.2. Implementar Storage Adapter (Local/S3).
- [ ] 4.3. Crear componente de Upload en Frontend.

## 🤖 Fase 5: Agente IA (Gemini)
- [ ] 5.1. Configurar cliente Gemini en Node.js.
- [ ] 5.2. Crear "Tools" para la IA (crear proyecto, buscar control).
- [ ] 5.3. Implementar Chat Widget en Frontend.

## 🚀 Fase 6: Producción
- [ ] 6.1. Configurar Nginx para producción.
- [ ] 6.2. Implementar generación de reportes PDF.
- [ ] 6.3. Testing final y despliegue.
