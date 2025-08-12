import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PracticePage from "./pages/PracticePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import CoursesPage from "./pages/CoursesPage";
import ProfilePage from "./pages/ProfilePage";
import ProblemPage from "./pages/ProblemPage"; // Make sure this is imported

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* This route correctly handles individual problems */}
          <Route path="/problems/:slug" element={<ProblemPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
export default App;
