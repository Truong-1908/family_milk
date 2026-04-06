const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("No API key");
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await res.json();
    if (data.models) {
      console.log("AVAILABLE MODELS:");
      data.models.forEach(m => console.log(m.name, m.supportedGenerationMethods.join(",")));
    } else {
      console.log(data);
    }
  } catch (err) {
    console.error(err);
  }
}
listModels();
