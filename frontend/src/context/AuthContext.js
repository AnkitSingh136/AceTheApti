import React, { createContext, useState, useEffect } from "react";
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("userInfo", JSON.stringify(userData));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
  };
  const updateUserCoins = (newCoinTotal) => {
    if (user) {
      const updatedUser = { ...user, coins: newCoinTotal };
      setUser(updatedUser);
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
    }
  };
  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, updateUserCoins }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
