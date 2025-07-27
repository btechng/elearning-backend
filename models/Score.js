import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  score: Number,
});

export default mongoose.model("Score", scoreSchema);
