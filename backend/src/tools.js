const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_FILE = path.join(__dirname, 'data.json');

// Helper to read DB
const readDB = () => {
    try {
        if (!fs.existsSync(DB_FILE)) {
            return { controls: [], clients: [], projects: [] };
        }
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading DB in tools:", error);
        return { controls: [], clients: [], projects: [] };
    }
};

// Helper to write DB
const writeDB = (data) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error("Error writing DB in tools:", error);
        return false;
    }
};

const createClient = ({ name, contactEmail, logoUrl }) => {
    const db = readDB();
    const newClient = {
        id: uuidv4(),
        name,
        contactEmail: contactEmail || "",
        logoUrl: logoUrl || "",
        createdAt: new Date().toISOString()
    };

    if (!db.clients) db.clients = [];
    db.clients.push(newClient);
    writeDB(db);
    return `Cliente creado: ${newClient.name} (ID: ${newClient.id})`;
};

const createProject = ({ clientId, projectName, useTemplate }) => {
    const db = readDB();

    // Find client (by ID or name for flexibility)
    const client = db.clients.find(c => c.id === clientId || c.name === clientId);
    if (!client) return "Error: Cliente no encontrado.";

    const newProject = {
        id: uuidv4(),
        clientId: client.id,
        name: projectName,
        createdAt: new Date().toISOString(),
        controls: []
    };

    if (useTemplate) {
        // Copy controls from the template (db.controls)
        newProject.controls = db.controls.map(c => ({
            ...c,
            activities: [] // Start with empty activities for the project
        }));
    }

    if (!db.projects) db.projects = [];
    db.projects.push(newProject);
    writeDB(db);
    return `Proyecto creado: ${newProject.name} para ${client.name}`;
};

const addActivity = ({ clientName, projectName, controlNumber, activityName, description }) => {
    const db = readDB();

    // Find project by name and client name
    // This is a bit complex because we need to join client -> project
    const client = db.clients.find(c => c.name === clientName);
    if (!client) return `Error: Cliente ${clientName} no encontrado.`;

    const project = db.projects.find(p => p.clientId === client.id && p.name === projectName);
    if (!project) return `Error: Proyecto ${projectName} no encontrado para ${clientName}.`;

    // Find control
    const control = project.controls.find(c => c.id === parseInt(controlNumber));
    if (!control) return `Error: Control ${controlNumber} no encontrado en el proyecto.`;

    const newActivity = {
        id: uuidv4(),
        nombre: activityName,
        descripcion: description || "",
        estado: 0,
        fechaCreacion: new Date().toISOString()
    };

    control.activities.push(newActivity);
    writeDB(db);
    return `Actividad '${activityName}' agregada al Control ${controlNumber} del proyecto ${projectName}.`;
};

module.exports = { createClient, createProject, addActivity };
