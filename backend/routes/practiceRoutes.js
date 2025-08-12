const express = require("express");
const router = express.Router();

const {
  getProblemBySlug,
  getProblems,
  submitAnswer,
  getTestSeries,
  unlockTestSeries,
} = require("../controllers/practiceController");

const { protect } = require("../middleware/authMiddleware");

// Route to get the list of all problems. Must come first.
router.get("/problems", getProblems);

// Route to get a single problem by its unique slug. Must come second.
router.get("/problems/:slug", getProblemBySlug);

// Protected routes for submitting answers and handling test series
router.post("/submit", protect, submitAnswer);
router.get("/test-series", protect, getTestSeries);
router.post("/unlock-test", protect, unlockTestSeries);

module.exports = router;
