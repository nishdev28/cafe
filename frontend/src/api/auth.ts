// auth.ts - UPDATED
import axiosInstance from "@/lib/axiosInstance";

// Login API - use relative path since baseURL is already set
export const loginUser = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/login", { email, password });
  return response.data; 
};

// auth.ts - Update registerUser
export const registerUser = async (username: string, email: string, password: string) => {
  const response = await axiosInstance.post("/auth/register", {
    username,
    email,
    password,
  });
  return response.data;
};

// Get all users (admin only)
export const getAllUsers = async (token: string) => {
  const response = await axiosInstance.get("/auth/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};