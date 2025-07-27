import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
});

export default mongoose.model("Course", courseSchema);
