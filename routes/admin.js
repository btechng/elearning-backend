import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";

const router = express.Router();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// 🟢 POST /api/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ error: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ token });
});

// Middleware to protect routes
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
}

// 🟢 GET /api/courses
router.get("/courses", auth, async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

// 🟢 POST /api/courses
router.post("/courses", auth, async (req, res) => {
  const { title, description } = req.body;
  const course = await Course.create({ title, description });
  res.json(course);
});

// 🟢 PUT /api/courses/:id
router.put("/courses/:id", auth, async (req, res) => {
  const { title, description } = req.body;
  const course = await Course.findByIdAndUpdate(
    req.params.id,
    { title, description },
    { new: true }
  );
  res.json(course);
});

// 🟢 DELETE /api/courses/:id
router.delete("/courses/:id", auth, async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: "Course deleted" });
});

// 🟢 GET /api/quizzes?courseId=...
router.get("/quizzes", auth, async (req, res) => {
  const { courseId } = req.query;
  const quizzes = await Quiz.find(courseId ? { courseId } : {});
  res.json(quizzes);
});

// 🟢 POST /api/quizzes
router.post("/quizzes", auth, async (req, res) => {
  const { title, courseId } = req.body;
  const quiz = await Quiz.create({ title, courseId });
  res.json(quiz);
});

// 🟢 GET /api/questions?quizId=...
router.get("/questions", auth, async (req, res) => {
  const { quizId } = req.query;
  const questions = await Question.find(quizId ? { quizId } : {});
  res.json(questions);
});

// 🟢 PUT /api/questions/:id
router.put("/questions/:id", auth, async (req, res) => {
  const { questionText, options, correctAnswer } = req.body;
  const question = await Question.findByIdAndUpdate(
    req.params.id,
    { questionText, options, correctAnswer },
    { new: true }
  );
  res.json(question);
});

// 🟢 DELETE /api/questions/:id
router.delete("/questions/:id", auth, async (req, res) => {
  await Question.findByIdAndDelete(req.params.id);
  res.json({ message: "Question deleted" });
});

export default router;
