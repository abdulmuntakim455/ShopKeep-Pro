const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '../backend/.env' });

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // There is no easy listModels in the SDK for node, let's just try to check if the key works at all with a simplified request
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("test");
    console.log("SUCCESS:", result.response.text());
  } catch (err) {
    console.error("ERROR:", err);
  }
}

listModels();
