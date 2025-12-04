const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function test() {
    try {
        console.log("Testing Gemini API...");
        console.log("Key:", process.env.GEMINI_API_KEY ? "Loaded" : "Missing");

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Hello, are you working?";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("SUCCESS! Response:", text);
    } catch (error) {
        console.error("ERROR:", error);
    }
}

test();
