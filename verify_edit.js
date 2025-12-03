const API_URL = 'http://localhost:5000/api';
const ADMIN_CREDS = { email: 'admin@hacknoid.com', password: 'Caracas7121*_' };

async function runTest() {
    try {
        console.log("🔵 1. Iniciando sesión como ADMIN...");
        const adminRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ADMIN_CREDS)
        });
        const adminData = await adminRes.json();
        const adminToken = adminData.token;
        console.log("✅ Login Admin exitoso.");

        // Obtener o crear proyecto
        let projectId;
        const projectsRes = await fetch(`${API_URL}/projects`, { headers: { 'x-auth-token': adminToken } });
        const projectsData = await projectsRes.json();
        if (projectsData.length > 0) {
            projectId = projectsData[0]._id;
        } else {
            // Crear cliente y proyecto si no existen (simplificado)
            console.error("❌ No hay proyectos para probar. Crea uno primero.");
            return;
        }

        console.log(`🔵 Usando Proyecto ID: ${projectId}`);

        // 1. Crear Control
        console.log("🔵 2. Creando Control de Prueba...");
        const newControlRes = await fetch(`${API_URL}/projects/${projectId}/controls`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': adminToken },
            body: JSON.stringify({ title: "Control Original" })
        });
        const projectData = await newControlRes.json();
        const controlId = projectData.controls[projectData.controls.length - 1]._id;
        console.log(`✅ Control creado: ${controlId}`);

        // 2. Editar Control
        console.log("🔵 3. Editando Control...");
        const editControlRes = await fetch(`${API_URL}/projects/${projectId}/controls/${controlId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': adminToken },
            body: JSON.stringify({ title: "Control EDITADO" })
        });
        if (editControlRes.ok) console.log("✅ Control editado correctamente.");
        else console.error("❌ Error editando control:", editControlRes.status);

        // 3. Crear Salvaguarda
        console.log("🔵 4. Creando Salvaguarda...");
        const newSafeguardRes = await fetch(`${API_URL}/projects/${projectId}/controls/${controlId}/safeguards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': adminToken },
            body: JSON.stringify({ title: "Salvaguarda Original" })
        });
        const projectData2 = await newSafeguardRes.json();
        const control2 = projectData2.controls.find(c => c._id === controlId);
        const safeguardId = control2.safeguards[control2.safeguards.length - 1]._id;
        console.log(`✅ Salvaguarda creada: ${safeguardId}`);

        // 4. Editar Salvaguarda
        console.log("🔵 5. Editando Salvaguarda...");
        const editSafeguardRes = await fetch(`${API_URL}/projects/${projectId}/controls/${controlId}/safeguards/${safeguardId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': adminToken },
            body: JSON.stringify({ title: "Salvaguarda EDITADA" })
        });
        if (editSafeguardRes.ok) console.log("✅ Salvaguarda editada correctamente.");
        else console.error("❌ Error editando salvaguarda:", editSafeguardRes.status);

        // 5. Crear Actividad
        console.log("🔵 6. Creando Actividad...");
        const newActivityRes = await fetch(`${API_URL}/projects/${projectId}/controls/${controlId}/safeguards/${safeguardId}/activities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': adminToken },
            body: JSON.stringify({ title: "Actividad Original" })
        });
        const projectData3 = await newActivityRes.json();
        const control3 = projectData3.controls.find(c => c._id === controlId);
        const safeguard3 = control3.safeguards.find(s => s._id === safeguardId);
        const activityId = safeguard3.activities[safeguard3.activities.length - 1]._id;
        console.log(`✅ Actividad creada: ${activityId}`);

        // 6. Editar Actividad
        console.log("🔵 7. Editando Actividad...");
        const editActivityRes = await fetch(`${API_URL}/projects/${projectId}/controls/${controlId}/safeguards/${safeguardId}/activities/${activityId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': adminToken },
            body: JSON.stringify({ title: "Actividad EDITADA" })
        });
        if (editActivityRes.ok) console.log("✅ Actividad editada correctamente.");
        else console.error("❌ Error editando actividad:", editActivityRes.status);

        // Limpieza (Opcional)
        console.log("🔵 8. Limpiando (Borrando Control de prueba)...");
        await fetch(`${API_URL}/projects/${projectId}/controls/${controlId}`, {
            method: 'DELETE', headers: { 'x-auth-token': adminToken }
        });
        console.log("✅ Limpieza completada.");

    } catch (error) {
        console.error("❌ Error fatal en el test:", error);
    }
}

runTest();
