import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  role: { type: String, enum: ["student", "admin"], default: "student" },
});

export default mongoose.model("User", userSchema);
