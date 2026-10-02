import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserLikedProducts } from "@/api/like";
import { Heart } from "lucide-react";
import dirham from "@/assets/UAE_Dirham_Symbol.svg";

interface LikedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  description: string;
  likeCount: number;
}

const LikedProductsPage: React.FC = () => {
  const [products, setProducts] = useState<LikedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1,
    limit: 20
  });

  // Get API base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder.jpg";
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  const fetchLikedProducts = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserLikedProducts(page, 20);
      
      if (data.success) {
        setProducts(data.products || []);
        setPagination(data.pagination || { page: 1, total: 0, pages: 1, limit: 20 });
      } else {
        setError("Failed to load liked products");
      }
    } catch (err: any) {
      console.error("Error fetching liked products:", err);
      if (err.message === "No token found, please login") {
        setError("Please login to view your liked products");
      } else {
        setError(err.response?.data?.message || "Failed to load liked products");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedProducts();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchLikedProducts(newPage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1E7D8] flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your liked products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F1E7D8] flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <Heart className="mx-auto text-red-300 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          {error.includes("login") ? (
            <Link
              to="/login"
              className="inline-block bg-purple-600  px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
            >
              Go to Login
            </Link>
          ) : (
            <button
              onClick={() => fetchLikedProducts()}
              className="bg-purple-600  px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1E7D8] py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Heart className="text-red-500" size={32} />
          <h1 className="text-3xl font-bold text-gray-800">My Liked Products</h1>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Heart className="mx-auto text-gray-300 mb-4" size={64} />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No liked products yet</h2>
            <p className="text-gray-500 mb-6">Start exploring our products and like the ones you love!</p>
            <Link
              to="/products/1"
              className="inline-block bg-purple-600  px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={getImageUrl(product.images?.[0])}
                      alt={product.name}
                      className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.jpg";
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-red-500  px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <Heart size={12} fill="white" />
                      <span>{product.likeCount}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 bg-yellow  px-3 py-1 rounded-full">
                        <img src={dirham} alt="Dirham" className="w-4 h-4 brightness-0 invert" />
                        {product.price}
                      </span>
                      <span className="text-xs text-gray-400">Click to view</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-purple-600  rounded-lg">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LikedProductsPage;