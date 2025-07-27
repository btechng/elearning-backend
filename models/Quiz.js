import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  title: String,
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
});

export default mongoose.model("Quiz", quizSchema);
