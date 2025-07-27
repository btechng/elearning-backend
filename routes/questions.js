import express from "express";
import mongoose from "mongoose";
import Question from "../models/Question.js";

const router = express.Router();

// ✅ GET all questions
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find();
    if (questions.length === 0) {
      return res.status(404).json({ message: "No questions found" });
    }
    res.json(questions);
  } catch (err) {
    console.error("❌ Error fetching questions:", err);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// ✅ POST a new question
router.post("/", async (req, res) => {
  try {
    const { quizId, questionText, options, correctAnswer } = req.body;

    if (!quizId || !questionText || !options || !correctAnswer) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({ error: "Invalid quizId" });
    }

    const question = new Question({
      quizId,
      questionText,
      options,
      correctAnswer,
    });
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    console.error("❌ Error creating question:", err);
    res.status(500).json({ error: "Failed to create question" });
  }
});

export default router;
