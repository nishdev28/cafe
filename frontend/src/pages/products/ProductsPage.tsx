import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import Pagination from "@/components/products/Pagination";
import { getProductsByType } from "@/api/products";
import type { product } from "@/types/products";
import dirham from "@/assets/UAE_Dirham_Symbol.svg";

const ProductsPage: React.FC = () => {
  const typeArr = ["large", "small", "box", "casserole", "minis"];
  const titleArr = [
    "Original Jars(250ml)",
    "Petite Jars(150ml)",
    "Combo Boxes",
    "Casseroles",
    "Minis"
  ];

  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [products, setProducts] = useState<product[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});

  // Get API base URL from environment variable
  const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https//';

  // Get search query from URL
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  // Helper function to get complete image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder.jpg";
    if (imagePath.startsWith('http')) return imagePath;
    // Make sure to properly combine the base URL with the image path
    return `${API_BASE_URL}${imagePath}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const type = typeArr[Number(id) - 1];
      const fetchedProducts = await getProductsByType(type);

      // Apply search filter if query exists
      const filteredProducts = searchQuery
        ? fetchedProducts.filter(
            (p) =>
              p.name.toLowerCase().includes(searchQuery) ||
              p.type.toLowerCase().includes(searchQuery) ||
              p.weight.toLowerCase().includes(searchQuery)
          )
        : fetchedProducts;

      setProducts(filteredProducts);
      setLoading(false);
    };

    fetchProducts();
  }, [id, searchQuery]);

  const handleImageError = (productId: string) => {
    console.error("Image failed to load for product:", productId);
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div>
      <div className="my-10 mx-5">
        <h2 className="mx-10 text-gray mb-6 text-3xl md:text-4xl lg:text-5xl">
          {titleArr[Number(id) - 1]}
        </h2>
        <div className="mx-10 mt-6 grid grid-cols-1 justify-center gap-6 sm:grid-cols-2 md:grid-cols-3">
          {products.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="group relative w-full max-w-xs overflow-hidden hover:shadow-lg"
            >
              <div className="relative">
                <img
                  src={!imageErrors[p.id] && p.images && p.images[0] ? getImageUrl(p.images[0]) : "/placeholder.jpg"}
                  alt={p.name}
                  className="h-48 w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                  onError={() => handleImageError(p.id)}
                />
                <button className="hidden group-hover:block px-3 py-1  w-full bg-yellow-800/80 absolute top-0">
                  Checkout
                </button>
              </div>
              <div className="relative z-10 bg-[#F1E7D8] p-4">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <div>
                  <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-yellow px-3 py-1 ">
                    <img
                      src={dirham}
                      alt="Dirham"
                      className="w-4 h-4 brightness-0 invert"
                    />
                    {p.price}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Pagination id={Number(id)} />
      </div>
    </div>
  );
};

export default ProductsPage;