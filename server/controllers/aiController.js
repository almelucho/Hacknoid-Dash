const { GoogleGenerativeAI } = require("@google/generative-ai");
const Project = require('../models/Project');
require('dotenv').config();

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chat = async (req, res) => {
    let project = null;
    try {
        const { projectId, message } = req.body;

        // 1. Buscar el contexto del proyecto
        project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ msg: "Proyecto no encontrado" });

        // 2. Preparar el "Prompt de Contexto" (Resumen para la IA)
        // Le damos a la IA una foto del estado actual para que no alucine.
        const contextData = {
            cliente: project.clientName,
            proyecto: project.projectName,
            perfil: project.targetProfile,
            avance_global: project.globalPercentage + "%",
            controles: project.controls.map(c => ({
                numero: c.controlNumber,
                titulo: c.title,
                avance: c.percentage + "%",
                salvaguardas_totales: c.safeguards.length,
                salvaguardas_aplicables: c.safeguards.filter(s => s.isApplicable).length
            }))
        };

        const systemPrompt = `
      Actúa como "Hacknoid AI", un experto auditor de ciberseguridad CIS v8.
      Estás analizando el proyecto: ${JSON.stringify(contextData)}.
      
      Tus instrucciones:
      1. Responde de forma concisa y profesional.
      2. Usa los datos del JSON adjunto para dar respuestas precisas sobre el avance.
      3. Si el usuario pregunta qué falta, identifica los controles con bajo porcentaje.
      4. Da recomendaciones prácticas basadas en el estándar CIS.
      
      Usuario pregunta: ${message}
    `;


        // 3. Consultar a Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error("Error AI:", error);

        // --- MOCK MODE (Respaldo para cuando falla la API) ---
        console.log("⚠️ Activando Modo Simulación debido a error en API.");

        const projectName = project ? project.projectName : "Proyecto Desconocido";
        const globalPercentage = project ? project.globalPercentage : "0";
        const targetProfile = project ? project.targetProfile : "N/A";
        const lowControl = project ? (project.controls.find(c => c.percentage < 100)?.title || "N/A") : "N/A";

        const mockReply = `🤖 **Modo Simulación (API no disponible)**\n\n` +
            `He analizado el proyecto **${projectName}**.\n\n` +
            `📊 **Estado Actual:**\n` +
            `- Avance Global: ${globalPercentage}%\n` +
            `- Perfil: ${targetProfile}\n\n` +
            `💡 **Recomendación:**\n` +
            `Basado en el estándar CIS v8, te sugiero enfocarte en los controles con menor avance. ` +
            `Parece que el control **${lowControl}** necesita atención inmediata.\n\n` +
            `*(Nota: Esta es una respuesta generada automáticamente porque no pude conectar con Google Gemini)*`;

        res.json({ reply: mockReply });
    }
};
