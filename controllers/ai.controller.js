import dotenv from "dotenv";
import File from "../models/file.model.js"; // Import the File model

dotenv.config();

// Helper function for making the AI call
const callAiApi = async (prompt) => {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AI_KEY}`, // Make sure AI_KEY is in your .env
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini", // Using a fast and cheap model
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }, // Request JSON output
        max_tokens: 500,
        temperature: 0.3,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  const rawText = data?.choices?.[0]?.message?.content;

  try {
    return JSON.parse(rawText); // Return the parsed JSON object
  } catch (err) {
    console.error("Failed to parse AI JSON response:", rawText);
    throw new Error("AI did not return valid JSON.");
  }
};


// @desc    Generate AI Summary
// @route   GET /api/ai/summary/:fileId
export const generateSummary = async (req, res) => {
  const { fileId } = req.params;

  try {
    const file = await File.findById(fileId).lean();
    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    const prompt = `
      You are an academic assistant.
      Given the metadata for a study file:
      - Title: "${file.title}"
      - Subject: "${file.subject}"
      - Description: "${file.description || 'N/A'}"

      Return a JSON object with a single key "summary":
      {
        "summary": "A concise, one-paragraph summary based *only* on the information provided."
      }
    `;

    const summaryData = await callAiApi(prompt);
    res.status(200).json({ success: true, data: summaryData });

  } catch (err) {
    console.error("AI Summary Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to generate AI summary",
      error: err.message,
    });
  }
};


// @desc    Generate AI Quiz
// @route   GET /api/ai/quiz/:fileId
export const generateQuiz = async (req, res) => {
  const { fileId } = req.params;

  try {
    const file = await File.findById(fileId).lean();
    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    const prompt = `
      You are an academic assistant.
      Given the metadata for a study file:
      - Title: "${file.title}"
      - Subject: "${file.subject}"
      - Description: "${file.description || 'N/A'}"

      Return a JSON object with a single key "quiz":
      The "quiz" key should contain an array of 3 multiple-choice questions.
      
      Example format:
      {
        "quiz": [
          { "question": "What is the capital of France?", "options": ["Paris", "London", "Berlin"], "answer": "Paris" },
          { "question": "...", "options": [...], "answer": "..." },
          { "question": "...", "options": [...], "answer": "..." }
        ]
      }
    `;

    const quizData = await callAiApi(prompt);
    res.status(200).json({ success: true, data: quizData });

  } catch (err) {
    console.error("AI Quiz Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to generate AI quiz",
      error: err.message,
    });
  }
};