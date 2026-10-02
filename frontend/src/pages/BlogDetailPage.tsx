import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { fetchBlogById } from "@/api/blog";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import Head from "@/layout/Head";
import type { Blog } from "@/types/api";

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
// BlogDetailPage.tsx - Update the useEffect hook
useEffect(() => {
  const loadBlog = async () => {
    if (!slug) return;
    
    try {
      setLoading(true);
      // This now calls the real API
      const data = await fetchBlogById(slug);
      setBlog(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load blog");
      console.error("Error loading blog:", err);
    } finally {
      setLoading(false);
    }
  };

  loadBlog();
}, [slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Blog post not found</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <Link to="/blogs" className="text-[var(--color-purple)] hover:underline">
          ← Back to all blogs
        </Link>
      </div>
    );
  }

  // Helper function to get author name
  const getAuthorName = () => {
    if (typeof blog.author === 'string') {
      return blog.author;
    }
    return blog.author?.username || 'Hearth & Grind Team';
  };

  return (
    <>
      <Head title={`${blog.title} | Hearth & Grind Blog`} />
      
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <Link 
          to="/blogs" 
          className="inline-flex items-center text-[var(--color-purple)] hover:underline mb-8"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to all blogs
        </Link>

        {/* Hero Image */}
        <div className="mb-8">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-[400px] object-cover rounded-lg shadow-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=400&fit=crop';
            }}
          />
        </div>

        {/* Blog Header */}
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags?.map((tag, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {blog.title}
          </h1>
          
          <div className="flex items-center gap-6 text-gray-600 border-b pb-6">
            <div className="flex items-center gap-2">
              <User size={18} />
              <span className="font-medium">{getAuthorName()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{formatDate(blog.date)}</span>
            </div>
          </div>
        </header>

        {/* Blog Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-8 font-medium">
            {blog.description}
          </p>
          
          <div className="text-gray-700 leading-relaxed space-y-6">
            {blog.content ? (
              <p>{blog.content}</p>
            ) : (
              <>
                <p>
                  At Hearth & Grind, we believe that great desserts tell a story. Each of our tiramisu creations 
                  is carefully crafted with attention to detail, from selecting the finest ingredients to perfecting 
                  the balance of flavors.
                </p>
                
                <p>
                  Our commitment to quality extends beyond just taste. We're passionate about creating 
                  memorable experiences through our desserts, whether it's through innovative flavor 
                  combinations or sharing the stories behind our creations.
                </p>
                
                <blockquote className="border-l-4 border-[var(--color-purple)] pl-4 italic text-gray-700 my-8">
                  "Every jar of Hearth & Grind tiramisu is made with the same passion and precision that 
                  goes into a work of art. We don't just make desserts; we create moments of joy."
                </blockquote>
              </>
            )}
          </div>
        </div>

        {/* Related Blogs Section - You can implement this later */}
        <section className="mt-16 pt-8 border-t">
        
          <div className="text-center py-8 text-gray-500">
            <p>Related blogs feature coming soon!</p>
            <Link to="/blogs" className="text-[var(--color-purple)] hover:underline mt-2 inline-block">
              Browse all blogs →
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}