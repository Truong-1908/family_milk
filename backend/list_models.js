require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function list() {
    console.log("Checking available models...");
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Accessing the model listing via a lower level specific call if needed, 
        // but the SDK structure is usually cleaner.
        // There isn't a direct "listModels" on the main class in some versions, 
        // let's try to infer or just try 'gemini-1.0-pro'.

        // Actually, the error message said "Call ListModels to see the list".
        // In the Node SDK, this is often hidden or via a specific manager.
        // Let's try to use the raw fetch if the SDK doesn't make it obvious,
        // OR just try 'gemini-1.0-pro' which is the older stable one.

        const modelName = "gemini-1.0-pro";
        console.log(`Trying fallback model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Test");
        console.log(`✅ Success with ${modelName}`);
    } catch (error) {
        console.error("❌ Failed with fallback too:", error.message);
    }
}

list();
