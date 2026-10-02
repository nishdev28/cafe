import { type Blog } from "@/types/api";
import axiosInstance from "@/lib/axiosInstance";

export async function fetchAllBlogs(): Promise<{ blogs: Blog[]; total: number }> {
  try {
    const response = await axiosInstance.get(`/blog`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw new Error("Failed to fetch blogs");
  }
}
export async function fetchPublishedBlogs(): Promise<{ blogs: Blog[]; total: number }> {
  try {
    const response = await axiosInstance.get(`/blog/published`);
    return response.data;
  } catch (error) {
    console.error("Error fetching published blogs:", error);
    throw new Error("Failed to fetch published blogs");
  }
}

export async function fetchBlogById(id: string): Promise<Blog> {
  try {
    const response = await axiosInstance.get(`/blog/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blog with id ${id}:`, error);
    throw new Error("Failed to fetch blog");
  }
}
// In blog.ts (API file)
export async function createBlog(blogData: Omit<Blog, 'id'>) {
  try {
    const response = await axiosInstance.post(`/blog/`, blogData);
    return response.data;
  } catch(error) {
    console.error("Error creating blog:", error);
    throw new Error("Failed to create blog");
  }
}

export async function updateBlog(id: string, blogData: Partial<Blog>) {
  try {
    const response = await axiosInstance.put(`/blog/${id}`, blogData);
    return response.data;
  } catch(error) {
    console.error(`Error updating blog with id ${id}:`, error);
    throw new Error("Failed to update blog");
  }
}

export async function deleteBlog(id: string){
  try{
    const response = await axiosInstance.delete(`/blog/${id}`)
    return response.data;
  }catch(error){
    console.error(`Error deleting blog with id ${id}:`, error);
    throw new Error("Failed to delete blog");
  }
}