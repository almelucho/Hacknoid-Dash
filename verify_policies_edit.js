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
            console.error("❌ No hay proyectos para probar. Crea uno primero.");
            return;
        }
        console.log(`🔵 Usando Proyecto ID: ${projectId}`);

        // --- PRUEBA POLÍTICAS GENERALES ---
        console.log("🔵 2. Creando Política General...");
        const newGenPolRes = await fetch(`${API_URL}/projects/${projectId}/policies`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': adminToken },
            body: JSON.stringify({ title: "Política General Original" })
        });
        const projectData = await newGenPolRes.json();
        const genPolId = projectData.generalPolicies[projectData.generalPolicies.length - 1]._id;
        console.log(`✅ Política General creada: ${genPolId}`);

        console.log("🔵 3. Editando Política General...");
        const editGenPolRes = await fetch(`${API_URL}/projects/${projectId}/policies/${genPolId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': adminToken },
            body: JSON.stringify({ title: "Política General EDITADA" })
        });
        if (editGenPolRes.ok) console.log("✅ Política General editada correctamente.");
        else console.error("❌ Error editando política general:", editGenPolRes.status);

        // --- PRUEBA POLÍTICAS DE CONTROL ---
        // Necesitamos un control
        const controlId = projectData.controls[0]._id;
        console.log(`🔵 Usando Control ID: ${controlId}`);

        console.log("🔵 4. Creando Política de Control...");
        const newCtrlPolRes = await fetch(`${API_URL}/projects/${projectId}/controls/${controlId}/policies`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': adminToken },
            body: JSON.stringify({ title: "Política Control Original" })
        });
        const projectData2 = await newCtrlPolRes.json();
        const control = projectData2.controls.find(c => c._id === controlId);
        const ctrlPolId = control.controlPolicies[control.controlPolicies.length - 1]._id;
        console.log(`✅ Política de Control creada: ${ctrlPolId}`);

        console.log("🔵 5. Editando Política de Control...");
        const editCtrlPolRes = await fetch(`${API_URL}/projects/${projectId}/controls/${controlId}/policies/${ctrlPolId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': adminToken },
            body: JSON.stringify({ title: "Política Control EDITADA" })
        });
        if (editCtrlPolRes.ok) console.log("✅ Política de Control editada correctamente.");
        else console.error("❌ Error editando política de control:", editCtrlPolRes.status);

        // Limpieza (Opcional - Borrar las políticas creadas)
        console.log("🔵 6. Limpiando...");
        await fetch(`${API_URL}/projects/${projectId}/policies/${genPolId}`, { method: 'DELETE', headers: { 'x-auth-token': adminToken } });
        await fetch(`${API_URL}/projects/${projectId}/controls/${controlId}/policies/${ctrlPolId}`, { method: 'DELETE', headers: { 'x-auth-token': adminToken } });
        console.log("✅ Limpieza completada.");

    } catch (error) {
        console.error("❌ Error fatal en el test:", error);
    }
}

runTest();
