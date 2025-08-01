import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import questionRoutes from "./routes/questions.js";
import adminRoutes from "./routes/admin.js"; // ✅ Admin endpoints

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/admin", adminRoutes); // ✅ Mount admin routes

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("✅ MongoDB connected");
  app.listen(8080, () => console.log("✅ Server running on port 8080"));
});
