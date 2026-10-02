import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductDetail from "./ProductDetail";
import { getProductById } from "@/api/products";
import type { Product } from "@/types/products";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        console.log("Fetched product data:", data); // Debug log
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!product) return <div className="p-6">Product not found.</div>;

  // Ensure product has both _id and id for compatibility
  const productWithIds = {
    ...product,
    _id: product._id || product.id,
    id: product.id || product._id,
  };

  return <ProductDetail {...productWithIds} />;
};

export default ProductDetailPage;