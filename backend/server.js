// --- Step 1: Import all necessary packages ---
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// --- Import your route files (each one only once) ---
const authRoutes = require("./routes/authRoutes");
const practiceRoutes = require("./routes/practiceRoutes");
const userRoutes = require("./routes/userRoutes");

// --- Step 2: Initial Setup ---
dotenv.config();
connectDB();
const app = express();

// --- Step 3: Use Middleware ---
app.use(cors());
app.use(express.json());

// --- Step 4: Connect All Your Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/practice", practiceRoutes);
app.use("/api/users", userRoutes);

// --- Step 5: A simple test route for the homepage ---
app.get("/", (req, res) => {
  res.send("AceTheApti API is running successfully...");
});

// --- Step 6: Define the Port and Start the Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
