// Use either type OR interface, but be consistent
// Option 1: Use only one type definition
export type Product = {
  data: Product;
  _id: string;
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  thumbnailImage?: string;
  weight: string;
  description: string;
  reviews: number;
  type: string;
  category?: string;
  stock: number;
  isFeatured: boolean;
  tags: string[];
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt?: string;
};

// Alias for backward compatibility
export type product = Product;

// Other interfaces remain the same
export interface Blog {
  id: string;
  image: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  createdAt: string;
}

export interface Testimonial {
  _id: string;
  name: string;
  content: string;
  rating: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  status?: "active" | "on-leave" | "inactive";
}

export type UserRole = 'admin' | 'crew';

export interface User {
  id: string;
  username: string;
  role: UserRole;
}