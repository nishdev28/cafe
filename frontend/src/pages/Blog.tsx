import BlogCard from "@/components/card/BlogCard";
import { fetchPublishedBlogs } from "@/api/blog";
import Head from "@/layout/Head";
import MaxContainer from "@/layout/MaxContainer";
import { useState, useEffect } from "react";
import type { Blog } from "@/types/api"; // Use type-only import

export default function Blog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 // Blog.tsx - Update the useEffect hook
useEffect(() => {
  const loadBlogs = async () => {
    try {
      setLoading(true);
      // This now calls the real API
      const data = await fetchPublishedBlogs();
      setBlogs(data.blogs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load blogs");
      console.error("Error loading blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  loadBlogs();
}, []);

  if (error) {
    return (
      <MaxContainer className="px-5 py-12">
        <div className="text-center text-red-600">
          <p>Error loading blogs: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600  rounded-lg"
          >
            Retry
          </button>
        </div>
      </MaxContainer>
    );
  }

  return (
    <>
      <Head title="Blog | Hearth & Grind - Desserts Stories & Tips" />
      
      <div className="bg-[#EFD9BE] py-12">
        <MaxContainer className="px-5">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Hearth & Grind Blog
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl">
            Discover stories behind our flavors, dessert-making tips, and insights into Dubai's dessert scene.
          </p>
        </MaxContainer>
      </div>
      
      <MaxContainer className="px-5 py-12">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blog posts available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </MaxContainer>
    </>
  );
}