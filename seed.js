import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Course from "./models/Course.js";
import Quiz from "./models/Quiz.js";
import Question from "./models/Question.js";

dotenv.config();

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Clear existing data
  await User.deleteMany();
  await Course.deleteMany();
  await Quiz.deleteMany();
  await Question.deleteMany();
  console.log("🧹 Cleared all collections");

  // 👉 Create admin user
  const adminHashedPassword = await bcrypt.hash("arianna", 10);
  const adminUser = await User.create({
    name: "Admin User",
    email: "arianna@gmail.com",
    password: adminHashedPassword,
    role: "admin", // 👈 sets admin privileges
  });
  console.log("🔐 Created admin user:", adminUser._id);

  // 👉 Create test user
  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = await User.create({
    name: "Test User",
    email: "test@example.com",
    password: hashedPassword,
  });
  console.log("👤 Created user:", user._id);

  // Seed data
  const courseData = [
    {
      title: "Math 101",
      description: "Basic mathematics",
      quizzes: [
        {
          title: "Addition Quiz",
          questions: [
            {
              questionText: "2 + 2 = ?",
              options: ["3", "4", "5", "6"],
              correctAnswer: "4",
            },
            {
              questionText: "10 + 5 = ?",
              options: ["10", "12", "15", "20"],
              correctAnswer: "15",
            },
          ],
        },
        {
          title: "Multiplication Quiz",
          questions: [
            {
              questionText: "3 * 3 = ?",
              options: ["6", "9", "12", "3"],
              correctAnswer: "9",
            },
            {
              questionText: "5 * 2 = ?",
              options: ["10", "15", "5", "20"],
              correctAnswer: "10",
            },
          ],
        },
      ],
    },
    {
      title: "Science 101",
      description: "Basic science concepts",
      quizzes: [
        {
          title: "Physics Quiz",
          questions: [
            {
              questionText: "What force pulls objects toward Earth?",
              options: ["Magnetism", "Gravity", "Friction", "Pressure"],
              correctAnswer: "Gravity",
            },
          ],
        },
      ],
    },
  ];

  // Seed courses, quizzes, and questions
  for (const courseItem of courseData) {
    const course = await Course.create({
      title: courseItem.title,
      description: courseItem.description,
    });
    console.log(`📘 Created course: ${course.title}`);

    for (const quizItem of courseItem.quizzes) {
      const quiz = await Quiz.create({
        title: quizItem.title,
        courseId: course._id,
      });
      console.log(`  📝 Created quiz: ${quiz.title}`);

      const questionDocs = quizItem.questions.map((q) => ({
        ...q,
        quizId: quiz._id,
      }));

      const inserted = await Question.insertMany(questionDocs);
      console.log(
        `    ❓ Inserted ${inserted.length} questions for quiz: ${quiz.title}`
      );
    }
  }

  console.log("🎉 Seeding complete");
  process.exit();
} catch (err) {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
}
