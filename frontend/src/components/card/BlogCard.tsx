import { Link } from "react-router";
import { Calendar, User } from "lucide-react";
import { type Blog } from "@/types/api";

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Helper function to extract author name
  const getAuthorName = () => {
    if (typeof blog.author === 'string') {
      return blog.author;
    }
    return blog.author?.username || 'Admin';
  };

  // Use description as excerpt if excerpt is not provided
  const excerpt = blog.excerpt || blog.description || '';

  // Generate slug from title if not provided
  // const slug = blog.slug || blog.title
  //   .toLowerCase()
  //   .replace(/[^a-z0-9\s-]/g, "")
  //   .replace(/\s+/g, "-")
  //   .replace(/-+/g, "-");

  return (
    <Link 
      to={`/blog/${blog.id}`} 
      className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Blog Image */}
      <div className="relative h-48 overflow-hidden">
       {/* In the modal preview */}
        <div className="absolute top-3 left-3">
        <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-[400px] object-cover rounded-lg shadow-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=400&fit=crop';
            }}
          />
        </div>
      </div>
      
      {/* Blog Content */}
      <div className="p-5">
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {blog.tags?.slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[var(--color-purple)] transition-colors">
          {blog.title}
        </h3>
        
        {/* Excerpt/Description */}
        <p className="text-gray-600 mb-4 line-clamp-2">
          {excerpt}
        </p>
        
        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{getAuthorName()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatDate(blog.date)}</span>
            </div>
          </div>
          <span className="text-[var(--color-purple)] font-medium group-hover:underline">
            Read more →
          </span>
        </div>
      </div>
    </Link>
  );
}