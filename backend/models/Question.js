// File: backend/models/Question.js (Final Version)
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  category: {
    type: String,
    required: true,
    enum: [
      "Quantitative",
      "Logical",
      "Verbal",
      "Data Interpretation",
      "Algorithms",
      "Database",
    ],
  },
  difficulty: {
    type: String,
    required: true,
    enum: ["Easy", "Medium", "Hard"],
  },
  acceptance: { type: String, default: "N/A" },
  questionText: { type: String, required: true },
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, required: true, default: false },
    },
  ],
});

// Use the robust export pattern to prevent OverwriteModelError
module.exports =
  mongoose.models.Question || mongoose.model("Question", questionSchema);
