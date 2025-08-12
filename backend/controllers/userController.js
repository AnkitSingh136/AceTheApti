const User = require("../models/User");
const Question = require("../models/Question"); // Needed for getUserStats

// @desc    Get top users for leaderboard, sorted by coins
// @route   GET /api/users/leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({})
      .sort({ coins: -1 }) // -1 means sort in descending order
      .limit(10) // Get the top 10 users
      .select("name coins"); // Only send back the name and coins

    res.json(leaderboard);
  } catch (error) {
    console.error("Error in getLeaderboard:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get user's practice statistics (for homepage progress bars)
// @route   GET /api/users/stats
const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`--- Calculating stats for user: ${user.name} ---`);
    console.log(
      `User has solved ${user.solvedQuestions.length} questions in total.`
    );

    const categories = ["Quantitative", "Logical", "Verbal"];
    const stats = {};

    await Promise.all(
      categories.map(async (cat) => {
        const totalQuestions = await Question.countDocuments({ category: cat });
        const solvedInCategory = await Question.countDocuments({
          _id: { $in: user.solvedQuestions },
          category: cat,
        });

        const percentage =
          totalQuestions > 0 ? (solvedInCategory / totalQuestions) * 100 : 0;

        console.log(
          `Category: ${cat} -> Solved: ${solvedInCategory} / Total: ${totalQuestions} = ${Math.round(
            percentage
          )}%`
        );

        // Use a consistent key, e.g., 'quantitative' for 'Quantitative Aptitude'
        const key = cat.toLowerCase().split(" ")[0];
        stats[key] = {
          solved: solvedInCategory,
          total: totalQuestions,
          percentage: Math.round(percentage),
        };
      })
    );

    console.log("--- Sending final stats to frontend:", stats, "---");
    res.json({ coins: user.coins, stats: stats });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get user profile data (for the profile page)
// @route   GET /api/users/profile
const getUserProfile = async (req, res) => {
  try {
    // req.user is attached by our 'protect' middleware, so we know who is logged in
    const user = await User.findById(req.user._id).select("-password"); // -password removes the password hash

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Export all three functions to be used by userRoutes.js
module.exports = {
  getLeaderboard,
  getUserStats,
  getUserProfile,
};
