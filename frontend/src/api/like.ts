import axiosInstance from "@/lib/axiosInstance";

const API_URL = import.meta.env.VITE_API_URL + "/likes";

// Like a product
export const likeProduct = async (productId: string) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found, please login");

  const response = await axiosInstance.post(
    `${API_URL}/${productId}/like`,
    {}, // Empty body
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Unlike a product
export const unlikeProduct = async (productId: string) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found, please login");

  const response = await axiosInstance.delete(
    `${API_URL}/${productId}/like`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Check if user liked a product
export const checkUserLike = async (productId: string) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found, please login");

  const response = await axiosInstance.get(
    `${API_URL}/${productId}/check`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Get user's liked products (for regular users)
export const getUserLikedProducts = async (page: number = 1, limit: number = 20) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found, please login");

  const response = await axiosInstance.get(
    `${API_URL}/user/liked?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// ========== ADMIN LIKE API FUNCTIONS ==========

// Get all likes for a specific product with user details (admin only)
export const adminGetProductLikes = async (productId: string) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found, please login");

  const response = await axiosInstance.get(
    `${import.meta.env.VITE_API_URL}/admin/product/${productId}/likes`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Get like statistics for all products (admin only)
export const adminGetLikeStats = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found, please login");

  const response = await axiosInstance.get(
    `${import.meta.env.VITE_API_URL}/admin/stats/likes`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Get products liked by a specific user (admin only)
export const adminGetUserLikedProducts = async (userId: string) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found, please login");

  const response = await axiosInstance.get(
    `${import.meta.env.VITE_API_URL}/admin/user/${userId}/liked-products`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Get power users (users who liked the most products) - admin only
export const adminGetPowerUsers = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found, please login");

  const response = await axiosInstance.get(
    `${import.meta.env.VITE_API_URL}/admin/analytics/power-users`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};