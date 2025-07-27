import mongoose from "mongoose";
import "./Quiz";

const questionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  questionText: String,
  options: [String],
  correctAnswer: String,
});

export default mongoose.model("Question", questionSchema);
