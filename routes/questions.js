import express from "express";
import Question from "../models/Question.js";

const router = express.Router();

// ✅ GET all questions
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find().populate("quizId");
    res.json(questions);
  } catch (err) {
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

    const question = new Question({
      quizId,
      questionText,
      options,
      correctAnswer,
    });

    await question.save();
    res.status(201).json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create question" });
  }
});

export default router;
