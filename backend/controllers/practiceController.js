const User = require("../models/User");
const Question = require("../models/Question");
const TestSeries = require("../models/TestSeries");

// @desc    Get a single problem by its slug and provide next/prev navigation
const getProblemBySlug = async (req, res) => {
  try {
    const problem = await Question.findOne({ slug: req.params.slug });
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    const categoryProblems = await Question.find({ category: problem.category })
      .sort({ title: "asc" })
      .select("slug");
    const currentIndex = categoryProblems.findIndex(
      (p) => p.slug === problem.slug
    );
    const prevProblemSlug =
      currentIndex > 0 ? categoryProblems[currentIndex - 1].slug : null;
    const nextProblemSlug =
      currentIndex < categoryProblems.length - 1
        ? categoryProblems[currentIndex + 1].slug
        : null;
    res.json({
      problem,
      navigation: { prev: prevProblemSlug, next: nextProblemSlug },
    });
  } catch (error) {
    console.error("Error in getProblemBySlug:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all questions for the problemset list, with optional category filtering
const getProblems = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category) {
      // This is the fix: Use a case-insensitive regex to find the category
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    console.log(
      `--- Backend is searching for problems with query:`,
      query,
      "---"
    );
    const questions = await Question.find(query).select(
      "title slug difficulty acceptance category"
    );

    console.log(`--- Backend found ${questions.length} problems. ---`);
    res.json(questions);
  } catch (error) {
    console.error("ERROR in getProblems:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Submit an answer, provide feedback, and award coins
const submitAnswer = async (req, res) => {
  const { questionId, answerId } = req.body;
  const userId = req.user._id;
  try {
    const question = await Question.findById(questionId);
    const user = await User.findById(userId);
    if (!question || !user) {
      return res.status(404).json({ message: "Resource not found" });
    }
    const selectedOption = question.options.id(answerId);
    const correctOption = question.options.find(
      (opt) => opt.isCorrect === true
    );

    if (!correctOption) {
      return res
        .status(400)
        .json({ message: "Invalid option data in database" });
    }
    if (!selectedOption) {
      return res.status(400).json({ message: "Invalid option selected" });
    }

    if (selectedOption.isCorrect) {
      let coinsEarned = 0;
      if (question.difficulty === "Easy") coinsEarned = 10;
      else if (question.difficulty === "Medium") coinsEarned = 15;
      else if (question.difficulty === "Hard") coinsEarned = 25;
      if (user.solvedQuestions.includes(questionId)) {
        return res.json({
          message: "Correct, but coin already awarded.",
          correctAnswerId: correctOption._id,
        });
      } else {
        user.coins += coinsEarned;
        user.solvedQuestions.push(questionId);
        await user.save();
        return res.json({
          message: `Correct! You earned ${coinsEarned} coins.`,
          newCoinTotal: user.coins,
          correctAnswerId: correctOption._id,
        });
      }
    } else {
      return res.json({
        message: "Wrong Answer!",
        correctAnswerId: correctOption._id,
      });
    }
  } catch (error) {
    console.error("CRITICAL ERROR in submitAnswer:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all available test series
const getTestSeries = async (req, res) => {
  try {
    const testSeries = await TestSeries.find({});
    res.json(testSeries);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Unlock a test series using coins
const unlockTestSeries = async (req, res) => {
  const { testSeriesId } = req.body;
  const userId = req.user._id;
  try {
    const test = await TestSeries.findById(testSeriesId);
    const user = await User.findById(userId);
    if (!test) {
      return res.status(404).json({ message: "Test Series not found" });
    }
    if (user.unlockedTestSeries.includes(testSeriesId)) {
      return res
        .status(400)
        .json({ message: "You have already unlocked this test." });
    }
    if (user.coins < test.costInCoins) {
      return res.status(400).json({ message: "Not enough coins." });
    }
    user.coins -= test.costInCoins;
    user.unlockedTestSeries.push(testSeriesId);
    await user.save();
    res.json({ message: "Test series unlocked!", newCoinTotal: user.coins });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getProblemBySlug,
  getProblems,
  submitAnswer,
  getTestSeries,
  unlockTestSeries,
};
