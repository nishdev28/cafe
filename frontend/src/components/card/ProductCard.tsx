import { Link } from "react-router";
import dirham from "@/assets/UAE_Dirham_Symbol.svg";
import { useState } from "react";

interface ProductCardProps {
  product: {
    name: string;
    price: number;
    images: string[];
    slug: string;
    description?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Get API base URL from environment variable
  const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  // Helper function to get complete image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath || imageError) return "/placeholder.jpg";
    if (imagePath.startsWith('http')) return imagePath;
    // Make sure to properly combine the base URL with the image path
    return `${API_BASE_URL}${imagePath}`;
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-xl"
    >
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={getImageUrl(product.images[0])}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            console.error("Image failed to load:", product.images[0]);
            setImageError(true);
            (e.target as HTMLImageElement).src = "/placeholder.jpg";
          }}
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-[var(--color-purple)]">
          {product.name}
        </h3>
        {product.description && (
          <p className="mb-3 line-clamp-2 text-sm text-gray-600">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1 rounded-full bg-yellow px-3 py-1 ">
            <img
              src={dirham}
              alt="Dirham"
              className="h-4 w-4 brightness-0 invert"
            />
            <span className="font-medium">{product.price}</span>
          </div>
          <span className="text-sm text-[var(--color-purple)] font-medium group-hover:underline">
            View Product →
          </span>
        </div>
      </div>
    </Link>
  );
}