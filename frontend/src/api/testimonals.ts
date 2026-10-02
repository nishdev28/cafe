import axiosInstance from "@/lib/axiosInstance";
import type { Testimonial } from "@/types/api";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const res = await axiosInstance.get(`${API_URL}/testimonials`);
    // Handle both array response and object with testimonials property
    if (Array.isArray(res.data)) {
      return res.data;
    } else if (res.data && Array.isArray(res.data.testimonials)) {
      return res.data.testimonials;
    }
    return [];
  } catch (err) {
    console.error("Failed to fetch testimonials", err);
    return [];
  }
};

export const createTestimonial = async (
  data: Omit<Testimonial, "_id" | "__v" | "createdAt" | "updatedAt">
): Promise<Testimonial | null> => {
  try {
    const res = await axiosInstance.post(`${API_URL}/testimonials`, data);
    return res.data;
  } catch (err) {
    console.error("Failed to create testimonial", err);
    return null;
  }
};