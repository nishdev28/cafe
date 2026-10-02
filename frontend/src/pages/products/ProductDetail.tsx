import { Minus, Plus, Heart } from "lucide-react";
import React, { useState, useEffect } from "react";
import { likeProduct, unlikeProduct, checkUserLike } from "@/api/like";
import { useCart } from "@/contexts/cartContext";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import dirham from '@/assets/UAE_Dirham_Symbol.svg';
import { useNavigate } from "react-router-dom";

interface ProductDetailProps {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  images: string[];
  weight: string;
  description?: string;
  reviews?: number;
  type?: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  _id,
  id,
  name,
  price,
  images,
  weight,
  description,
  reviews,
}) => {
  const [mainImage, setMainImage] = useState("");
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});
  const [quantity, setQuantity] = useState(0);
  
  // Like feature states
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  const { dispatch } = useCart();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  // Get API base URL from environment variable
  const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  // Helper function to get complete image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder.jpg";
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  // Use either _id or id, prioritizing _id
  const productId = _id || id;

  // Check if user liked this product on mount
  useEffect(() => {
    const checkLike = async () => {
      if (!isLoggedIn || !productId) return;
      
      try {
        const data = await checkUserLike(productId);
        setIsLiked(data.liked);
        setLikeCount(data.likeCount);
      } catch (error) {
        console.error("Failed to check like status:", error);
      }
    };
    
    checkLike();
  }, [productId, isLoggedIn]);

  // Set main image when images are loaded
  useEffect(() => {
    if (images?.length > 0 && images[0]) {
      setMainImage(getImageUrl(images[0]));
    }
  }, [images]);

  const handleImageError = (imagePath: string) => {
    console.error("Image failed to load:", imagePath);
    setImageErrors(prev => ({ ...prev, [imagePath]: true }));
    
    if (mainImage === getImageUrl(imagePath)) {
      const workingImage = images.find(img => !imageErrors[img] && img !== imagePath);
      if (workingImage) {
        setMainImage(getImageUrl(workingImage));
      } else {
        setMainImage("/placeholder.jpg");
      }
    }
  };

  const handleAddToCart = () => {
    if (!productId) {
      toast.error("Product ID missing, cannot add to cart!");
      return;
    }

    if (quantity === 0) {
      toast.error("Please select a quantity!");
      return;
    }

    toast.success("Product added to cart", {
      style: { backgroundColor: "#B5482A", color: "#fff" },
    });

    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: productId,
        name,
        price,
        quantity,
        images: images || [],
      },
    });
  };

  // Handle like/unlike
  const handleLikeToggle = async () => {
    if (!isLoggedIn) {
      toast.info("Please login to like products");
      navigate("/login");
      return;
    }
    
    if (!productId) {
      toast.error("Product ID missing");
      return;
    }
    
    setLikeLoading(true);
    try {
      if (isLiked) {
        const data = await unlikeProduct(productId);
        setIsLiked(false);
        setLikeCount(data.likeCount);
        toast.success("Product removed from likes");
      } else {
        const data = await likeProduct(productId);
        setIsLiked(true);
        setLikeCount(data.likeCount);
        toast.success("Product added to likes!");
      }
    } catch (error: any) {
      console.error("Like toggle error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to update like");
    } finally {
      setLikeLoading(false);
    }
  };

  // Handle WhatsApp order
  const orderOnWhatsApp = () => {
    if (quantity === 0) {
      toast.error("Please select a quantity!");
      return;
    }

    const subtotal = (price * quantity).toFixed(2);
    const phoneNumber = "+971585061377";
    
    let message = `Hello, I would like to order this product:%0A%0A`;
    message += `Product: ${name}%0A`;
    message += `Quantity: ${quantity}%0A`;
    message += `Unit Price: ${price.toFixed(2)} AED%0A`;
    message += `Subtotal: ${subtotal} AED%0A%0A`;
    message += `Product URL: ${window.location.href}`;

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#F1E7D8] px-6 py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-3 md:grid-cols-3">
        {/* LEFT - Thumbnails */}
        <div className="flex flex-row md:flex-col items-center justify-center gap-3 md:items-start md:justify-start">
          {(images || []).map((img, idx) => (
            <div
              key={idx}
              className="relative cursor-pointer"
              onClick={() => !imageErrors[img] && setMainImage(getImageUrl(img))}
            >
              <img
                src={getImageUrl(img)}
                alt={`${name} ${idx + 1}`}
                className={`h-25 w-25 rounded border object-cover transition hover:scale-105 ${
                  getImageUrl(img) === mainImage && !imageErrors[img] 
                    ? "border-yellow-500" 
                    : "border-gray-300"
                }`}
                onError={() => handleImageError(img)}
              />
              {imageErrors[img] && (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                  Failed to load
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CENTER - Main Image */}
        <div className="flex justify-center">
          <img
            src={mainImage || "/placeholder.jpg"}
            alt={name}
            className="h-[400px] w-[400px] rounded-lg border object-cover shadow-lg"
            onError={(e) => {
              console.error("Main image failed to load:", mainImage);
              (e.target as HTMLImageElement).src = "/placeholder.jpg";
            }}
          />
        </div>

        {/* RIGHT - Product Info */}
        <div className="flex flex-col gap-4">
          {/* Rating */}
          <div className="flex items-center gap-1 text-yellow-400">
            {"★★★★★"}
            <span className="ml-2 text-sm text-gray-700">{reviews || 0} / 5</span>
          </div>

          {/* Name */}
          <h1 className="text-2xl font-semibold text-gray-900">{name}</h1>

          {/* Weight */}
          <p className="font-medium text-gray-700">Quantity: {weight}</p>

          {/* Price */}
          <p className="mt-2 inline-flex rounded-full items-center gap-1 bg-yellow px-3 py-1 w-fit ">
            <img src={dirham} alt="Dirham" className="w-4 h-4 brightness-0 invert mb-0.5" />
            {price}
          </p>

          {/* Like Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLikeToggle}
              disabled={likeLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                isLiked 
                  ? "bg-red-500  hover:bg-red-600" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Heart size={20} fill={isLiked ? "white" : "none"} />
              <span>{likeCount}</span>
            </button>
            <span className="text-sm text-gray-500">
              {isLoggedIn ? (isLiked ? "You like this" : "Like this product") : "Login to like"}
            </span>
          </div>

          {/* Quantity + Cart */}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center border">
              <button
                className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300"
                onClick={() => setQuantity(q => Math.max(0, q - 1))}
              >
                <Minus size={16} />
              </button>
              <span className="text-lg font-medium w-8 text-center">{quantity}</span>
              <button
                className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300"
                onClick={() => setQuantity(q => q + 1)}
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              disabled={quantity === 0}
              onClick={handleAddToCart}
              className="bg-gray-700 px-5 py-2 font-semibold  transition hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
          </div>

          {/* WhatsApp Button */}
          <button
            onClick={orderOnWhatsApp}
            disabled={quantity === 0}
            className="inline-block w-fit disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-2 px-2 py-2 transition">
              <div className="h-10 w-10 rounded-3xl bg-[#25D366] flex items-center justify-center">
                <img src="/whatsapp-logo.png" alt="WhatsApp" className="h-8 w-8 object-contain" />
              </div>
              <span className="rounded-3xl bg-yellow px-5 py-2 font-semibold  transition hover:bg-yellow-800/80">
                Order on WhatsApp
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* DESCRIPTION SECTION */}
      <div className="mx-auto mt-10 max-w-5xl">
        <h2 className="mb-3 text-2xl font-semibold text-gray-800">Description</h2>
        <p className="leading-relaxed text-gray-700">
          {description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."}
        </p>
      </div>
    </div>
  );
};

export default ProductDetail;