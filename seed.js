import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Course from "./models/Course.js";
import Quiz from "./models/Quiz.js";
import Question from "./models/Question.js";
import bcrypt from "bcryptjs";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

await User.deleteMany();
await Course.deleteMany();
await Quiz.deleteMany();
await Question.deleteMany();

const password = await bcrypt.hash("password123", 10);
const user = await User.create({ name: "Test User", email: "test@example.com", password });

const course = await Course.create({ title: "Math 101", description: "Basic math course" });

const quiz = await Quiz.create({ title: "Math Quiz 1", courseId: course._id });

await Question.insertMany([
  {
    quizId: quiz._id,
    questionText: "2 + 2 = ?",
    options: ["3", "4", "5", "6"],
    correctAnswer: "4",
  },
  {
    quizId: quiz._id,
    questionText: "5 * 2 = ?",
    options: ["10", "15", "20", "5"],
    correctAnswer: "10",
  },
]);

console.log("✅ Seed complete");
process.exit();
