const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    coins: { type: Number, default: 0 },
    solvedQuestions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
    ],
    unlockedTestSeries: [
      { type: mongoose.Schema.Types.ObjectId, ref: "TestSeries" },
    ],
  },
  { timestamps: true }
);

// Use the robust export pattern to prevent OverwriteModelError
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
