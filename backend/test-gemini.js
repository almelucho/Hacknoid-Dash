require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const fs = require('fs');

async function testGemini() {
    console.log("Probando conexión con Gemini...");

    if (!process.env.GEMINI_API_KEY) {
        console.error("❌ Error: GEMINI_API_KEY no está definida en .env");
        return;
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    try {
        console.log("Intentando con modelo: gemini-flash-latest");
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent("Hola, ¿estás funcionando?");
        console.log("✅ Éxito con gemini-flash-latest!");
        console.log("Respuesta:", result.response.text());
        return;
    } catch (error) {
        console.error("❌ Falló gemini-flash-latest");
        fs.writeFileSync('gemini_error.txt', `Error gemini-flash-latest: ${JSON.stringify(error, null, 2)}\nMessage: ${error.message}\nStack: ${error.stack}\n\n`);
    }
}

testGemini();
