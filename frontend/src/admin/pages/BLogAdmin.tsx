// BLogAdmin.tsx - Fixed with error handling
import React, { useState, useEffect } from "react";
import type { Blog } from "@/types/api";
import { fetchAllBlogs, createBlog, updateBlog, deleteBlog } from "@/api/blog";

interface BlogsPageProps {
  token?: string;
}

const BlogsPage: React.FC<BlogsPageProps> = () => {
  // State
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [] as string[],
    date: new Date().toISOString().split("T")[0],
    image: "",
    status: "draft" as Blog["status"],
    content: "",
  });

  // Load blogs on component mount
  useEffect(() => {
    loadBlogs();
  }, []);

  // Debug: Log when blogs change
  useEffect(() => {
    console.log("Blogs state updated:", blogs.length, "blogs");
  }, [blogs]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Starting to load blogs...");
      
      // Add timeout for debugging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Request timeout")), 10000)
      );
      
      const fetchPromise = fetchAllBlogs();
      
      // Race between fetch and timeout
      const data = await Promise.race([fetchPromise, timeoutPromise]) as any;
      
      console.log("API Response received:", data);
      
      // Debug: Check the exact structure
      console.log("Response keys:", Object.keys(data));
      console.log("Has blogs property?", 'blogs' in data);
      console.log("Blogs data type:", typeof data.blogs);
      console.log("Blogs value:", data.blogs);
      
      // Make sure we have the blogs array
      if (data && data.blogs && Array.isArray(data.blogs)) {
        console.log(`Setting ${data.blogs.length} blogs`);
        setBlogs(data.blogs);
      } else if (Array.isArray(data)) {
        // If API returns array directly
        console.log(`API returned array directly with ${data.length} blogs`);
        setBlogs(data);
      } else {
        console.error("Invalid response structure:", data);
        setError(`Invalid response from server. Expected blogs array, got: ${JSON.stringify(data).substring(0, 200)}...`);
      }
    } catch (error: any) {
      console.error("Failed to load blogs:", error);
      
      // More detailed error message
      const errorMessage = error?.message || "Unknown error";
      const statusCode = error?.response?.status;
      
      if (statusCode === 401) {
        setError("Authentication required. Please login again.");
      } else if (statusCode === 403) {
        setError("You don't have permission to view blogs.");
      } else if (statusCode === 404) {
        setError("Blogs endpoint not found. Check API URL.");
      } else if (errorMessage.includes("timeout")) {
        setError("Request timed out. Server might be down.");
      } else if (errorMessage.includes("Network Error")) {
        setError("Network error. Check your connection and CORS settings.");
      } else {
        setError(`Failed to load blogs: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (blog?: Blog) => {
    console.log("Opening modal with blog:", blog);
    
    if (blog) {
      // Validate blog has ID
      if (!blog.id) {
        alert("Cannot edit: Blog ID is missing");
        return;
      }
      
      setEditingBlog(blog);
      setFormData({
        title: blog.title || "",
        description: blog.description || "",
        tags: blog.tags || [],
        date: blog.date || new Date().toISOString().split("T")[0],
        image: blog.image || "",
        status: blog.status || "draft",
        content: blog.content || "",
      });
      setImagePreview(blog.image || "");
    } else {
      // Create new blog
      setEditingBlog(null);
      setFormData({
        title: "",
        description: "",
        tags: [],
        date: new Date().toISOString().split("T")[0],
        image: "",
        status: "draft",
        content: "",
      });
      setImagePreview("");
    }
    
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Note: We're not using imageFile state, just the preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData(prev => ({ ...prev, image: previewUrl }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!formData.title.trim() || !formData.description.trim()) {
        alert("Title and description are required");
        return;
      }

      console.log("Saving blog...", { editingBlog: editingBlog?.id, formData });

      if (editingBlog) {
        // Validate we have an ID for update
        if (!editingBlog.id) {
          throw new Error("Cannot update: Blog ID is missing");
        }

        console.log(`Updating blog with ID: ${editingBlog.id}`);
        
        // Prepare update data - only what's needed
        const updateData = {
          title: formData.title,
          description: formData.description,
          date: formData.date,
          image: formData.image,
          tags: formData.tags,
          status: formData.status,
          content: formData.content,
        };

        console.log("Update data:", updateData);
        
        // Call update API
        const updatedBlog = await updateBlog(editingBlog.id, updateData);
        console.log("Update successful:", updatedBlog);
        
        // Update state
        setBlogs(prev => prev.map(blog => 
          blog.id === editingBlog.id ? updatedBlog : blog
        ));
        
        alert("Blog updated successfully!");
      } else {
        // Create new blog
        console.log("Creating new blog...");
        
        const newBlogData = {
          title: formData.title,
          description: formData.description,
          date: formData.date,
          image: formData.image,
          tags: formData.tags,
          status: formData.status,
          content: formData.content,
          createdAt: new Date().toISOString(), // Add createdAt property
        };

        console.log("Create data:", newBlogData);
        
        const newBlog = await createBlog(newBlogData);
        console.log("Create successful:", newBlog);
        
        setBlogs(prev => [...prev, newBlog]);
        alert("Blog created successfully!");
      }

      // Close modal and reset
      setIsModalOpen(false);
      resetForm();
      
    } catch (error: any) {
      console.error("Failed to save blog:", error);
      alert(error?.message || "Failed to save blog");
    }
  };

  const handleDelete = async (id: string) => {
    console.log("Delete requested for ID:", id);
    
    if (!id) {
      console.error("No ID provided for deletion");
      alert("Cannot delete: Blog ID is missing");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    try {
      console.log(`Deleting blog with ID: ${id}`);
      await deleteBlog(id);
      
      // Update state
      setBlogs(prev => prev.filter(blog => blog.id !== id));
      alert("Blog deleted successfully!");
    } catch (error: any) {
      console.error("Failed to delete blog:", error);
      alert(error?.message || "Failed to delete blog");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      tags: [],
      date: new Date().toISOString().split("T")[0],
      image: "",
      status: "draft",
      content: "",
    });
    setImagePreview("");
    setEditingBlog(null);
  };

  const getAuthorName = (blog: Blog): string => {
    if (typeof blog.author === "string") {
      return blog.author;
    }
    return blog.author?.username || "Admin";
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading blogs...</p>
        <p className="mt-2 text-sm text-gray-400">Checking API connection...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-8">
        <div className="mb-4 flex items-center">
          <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="ml-3 text-lg font-semibold text-red-800">Error Loading Blogs</h3>
        </div>
        <p className="mb-4 rounded bg-white p-3 font-mono text-sm text-red-600">
          {error}
        </p>
        <div className="flex gap-3">
          <button
            onClick={loadBlogs}
            className="rounded-lg bg-red-600 px-4 py-2  hover:bg-red-700"
          >
            Try Again
          </button>
          <button
            onClick={() => {
              console.log("Current blogs state:", blogs);
              console.log("Opening network tab for debugging...");
              // Open browser network tab instructions
              alert("Open browser DevTools (F12) → Network tab → Check /api/blog request");
            }}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Debug
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Blog Posts ({blogs.length})
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage your blog posts here
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="rounded-lg bg-blue-600 px-4 py-2.5 font-semibold  shadow hover:bg-blue-700"
        >
          + Create New Post
        </button>
      </div>


      {/* Blogs Grid */}
      {blogs.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-4 text-gray-500">No blog posts found.</p>
          <p className="mt-1 text-sm text-gray-400">
            {loading ? "Loading..." : "Ready to create your first blog post"}
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="mt-6 rounded-lg bg-blue-600 px-4 py-2  hover:bg-blue-700"
          >
            Create your first blog post
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <img
                  src={blog.image || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=400&fit=crop"}
                  alt={blog.title}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=400&fit=crop";
                  }}
                />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  {blog.tags?.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeClass(blog.status || "draft")}`}>
                    {blog.status || "draft"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {blog.title}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        console.log("Edit clicked for blog:", blog.id);
                        handleOpenModal(blog);
                      }}
                      className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                      title="Edit"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        console.log("Delete clicked for blog:", blog.id);
                        handleDelete(blog.id);
                      }}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                  {blog.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{getAuthorName(blog)}</span>
                  <span>{blog.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="max-h-[70vh] overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter blog title"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="min-h-[100px] w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter blog description"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  {imagePreview && (
                    <div className="mt-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-32 rounded-lg object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tags: e.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean),
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="dessert, recipe, tips"
                  />
                </div>

                {/* Status & Date */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value as Blog["status"] })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">
                    Content (optional)
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="min-h-[200px] w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Write full blog content here..."
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 py-3.5 font-semibold  hover:bg-blue-700"
                  >
                    {editingBlog ? "Update Blog Post" : "Publish Blog Post"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogsPage;