import { useState, useEffect } from "react";

interface User {
  _id: string;
  id?: string;
  username: string;
  email: string;
  role: "user" | "admin" | "crew";
  isAdmin?: boolean;
}

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      
      if (token && userStr) {
        setIsLoggedIn(true);
        try {
          const parsedUser = JSON.parse(userStr);
          setUser(parsedUser);
        } catch (e) {
          console.error("Failed to parse user data", e);
          // Clear invalid data
          localStorage.removeItem("user");
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();

    // Listen for storage changes (logout in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" || e.key === "user") {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    window.dispatchEvent(new Event('storage')); // Notify other tabs
  };

  return { isLoggedIn, user, loading, logout };
};