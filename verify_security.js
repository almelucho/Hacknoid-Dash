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

        console.log("🔵 2. Probando acceso a GET /api/clients como ADMIN...");
        const adminAccessRes = await fetch(`${API_URL}/clients`, {
            headers: { 'x-auth-token': adminToken }
        });
        if (adminAccessRes.ok) {
            console.log("✅ Acceso Admin PERMITIDO (Correcto).");
        } else {
            console.error("❌ Acceso Admin DENEGADO (Incorrecto):", adminAccessRes.status);
        }

        // Crear un usuario cliente temporal para probar
        console.log("🔵 3. Creando usuario cliente de prueba...");
        // Primero necesitamos un cliente
        let clientId;
        const clientsRes = await fetch(`${API_URL}/clients`, { headers: { 'x-auth-token': adminToken } });
        const clientsData = await clientsRes.json();

        if (clientsData.length > 0) {
            clientId = clientsData[0]._id;
        } else {
            const newClientRes = await fetch(`${API_URL}/clients`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': adminToken },
                body: JSON.stringify({ name: 'Test Corp' })
            });
            const newClientData = await newClientRes.json();
            clientId = newClientData._id;
        }

        const testUserEmail = `testuser${Date.now()}@test.com`;
        const testUserPass = '123456';
        await fetch(`${API_URL}/clients/${clientId}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': adminToken },
            body: JSON.stringify({
                name: 'Test User',
                email: testUserEmail,
                password: testUserPass
            })
        });
        console.log("✅ Usuario cliente creado:", testUserEmail);

        console.log("🔵 4. Iniciando sesión como CLIENT USER...");
        const userRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testUserEmail, password: testUserPass })
        });
        const userData = await userRes.json();
        const userToken = userData.token;
        console.log("✅ Login Usuario exitoso.");

        console.log("🔵 5. Probando acceso a GET /api/clients como CLIENT USER...");
        const userAccessRes = await fetch(`${API_URL}/clients`, {
            headers: { 'x-auth-token': userToken }
        });

        if (userAccessRes.status === 403) {
            console.log("✅ Acceso Usuario DENEGADO (Correcto - 403 Forbidden).");
        } else if (userAccessRes.ok) {
            console.error("❌ Acceso Usuario PERMITIDO (Incorrecto - Debería ser 403).");
        } else {
            console.error(`❌ Error inesperado: ${userAccessRes.status}`);
        }

    } catch (error) {
        console.error("❌ Error fatal en el test:", error);
    }
}

runTest();
