const mongoose = require("mongoose");

const testSeriesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  costInCoins: { type: Number, required: true, default: 50 },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
});

// Use the robust export pattern
module.exports =
  mongoose.models.TestSeries || mongoose.model("TestSeries", testSeriesSchema);
