import axiosInstance from "@/lib/axiosInstance";
import { type Product } from "@/types/products";

// Helper function to map API response to Product type
const mapProductFromAPI = (productData: any): Product => {
  return {
    ...productData,
    _id: productData.id, // Map id to _id for compatibility
    id: productData.id,
    images: productData.images || [],
    tags: productData.tags || [],
    status: productData.status || 'draft',
    stock: productData.stock || 0,
    reviews: productData.reviews || 0,
    isFeatured: productData.isFeatured || false
  };
};

export async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await axiosInstance.get(`/products/`);
    const products = response.data.products || [];
    return products.map(mapProductFromAPI);
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function getProductsByType(type: string): Promise<Product[]> {
  try {
    const response = await axiosInstance.get(`/products/published?type=${type}`);
    const products = response.data.products || [];
    return products.map(mapProductFromAPI);
  } catch (error) {
    console.error(`Error fetching products of type ${type}:`, error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await axiosInstance.get(`/products/${id}`);
    const productData = response.data.product || response.data;
    
    if (productData) {
      return mapProductFromAPI(productData);
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    return null;
  }
}

export async function addProduct(productData: FormData): Promise<Product | null> {
  try {
    const response = await axiosInstance.post(`/products/`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.product) {
      return mapProductFromAPI(response.data.product);
    }
    
    return null;
  } catch (error) {
    console.error("Error adding product:", error);
    return null;
  }
}

export async function updateProduct(id: string, productData: FormData): Promise<Product | null> {
  try {
    const response = await axiosInstance.put(`/products/${id}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.product) {
      return mapProductFromAPI(response.data.product);
    }
    
    return null;
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error);
    return null;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const response = await axiosInstance.delete(`/products/${id}`);
    
    if (response.status === 200 || response.status === 204) {
      return true;
    }
    
    if (response.data?.success === true) {
      return true;
    }
    
    return false;
  } catch (error: any) {
    console.error(`Error deleting product with id ${id}:`, error);
    
    // Check if it's a 404 error (product already deleted)
    if (error.response?.status === 404) {
      return true; // Product already deleted
    }
    
    throw new Error("Failed to delete product");
  }
}