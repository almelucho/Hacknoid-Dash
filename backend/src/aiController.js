const { GoogleGenerativeAI } = require("@google/generative-ai");
const tools = require('./tools');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const toolsSchema = [
    {
        function_declarations: [
            {
                name: "createClient",
                description: "Crea un nuevo cliente en la base de datos con su nombre, email y logo.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        name: { type: "STRING", description: "Nombre de la empresa o cliente" },
                        contactEmail: { type: "STRING", description: "Email de contacto (opcional)" },
                        logoUrl: { type: "STRING", description: "URL del logo (opcional)" }
                    },
                    required: ["name"]
                }
            },
            {
                name: "createProject",
                description: "Crea un nuevo proyecto de auditoría para un cliente existente.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        clientId: { type: "STRING", description: "ID o Nombre del cliente" },
                        projectName: { type: "STRING", description: "Nombre del proyecto (ej: Auditoría 2025)" },
                        useTemplate: { type: "BOOLEAN", description: "Si es true, usa la plantilla CIS v8" }
                    },
                    required: ["clientId", "projectName"]
                }
            },
            {
                name: "addActivity",
                description: "Agrega una actividad o tarea específica a un control de un proyecto.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        clientName: { type: "STRING", description: "Nombre del cliente" },
                        projectName: { type: "STRING", description: "Nombre del proyecto" },
                        controlNumber: { type: "STRING", description: "Número del control (1-18)" },
                        activityName: { type: "STRING", description: "Título de la actividad" },
                        description: { type: "STRING", description: "Detalles de la actividad" }
                    },
                    required: ["clientName", "projectName", "controlNumber", "activityName"]
                }
            }
        ]
    }
];

const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    tools: toolsSchema
});

const chatSession = model.startChat({
    history: [
        {
            role: "user",
            parts: [{ text: "Eres un Gestor de Proyectos de Auditoría experto en CIS v8. Tu trabajo es ayudarme a gestionar clientes, auditorías y redactar informes. Cuando te pida hacer una acción, usa las herramientas disponibles. Responde siempre en español profesional." }],
        },
        {
            role: "model",
            parts: [{ text: "Entendido. Estoy listo para gestionar tus auditorías CIS v8, crear clientes y redactar informes. ¿Qué necesitas hacer hoy?" }],
        },
    ],
});

async function processUserMessage(userMessage) {
    try {
        const result = await chatSession.sendMessage(userMessage);
        const response = result.response;
        const functionCalls = response.functionCalls();

        if (functionCalls && functionCalls.length > 0) {
            const call = functionCalls[0];
            const functionName = call.name;
            const args = call.args;

            console.log(`🤖 IA decidió ejecutar: ${functionName}`, args);

            let toolResult;
            if (functionName === "createClient") toolResult = tools.createClient(args);
            if (functionName === "createProject") toolResult = tools.createProject(args);
            if (functionName === "addActivity") toolResult = tools.addActivity(args);

            const resultParts = [
                {
                    functionResponse: {
                        name: functionName,
                        response: { result: toolResult }
                    }
                }
            ];

            const finalResponse = await chatSession.sendMessage(resultParts);
            console.log("Final Response candidates:", JSON.stringify(finalResponse.response.candidates, null, 2));
            return finalResponse.response.text();
        }

        return response.text();

    } catch (error) {
        console.error("Error IA:", JSON.stringify(error, null, 2));
        return `Error detallado: ${error.message}`;
    }
}

module.exports = { processUserMessage };
