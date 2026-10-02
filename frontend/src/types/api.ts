export interface Crew {
  _id: string;
  name: string;
  position: string;
  contact: string;
  email: string;
  description: string;
  image?: string;
  status: "active" | "on-leave" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface CrewFormData {
  name: string;
  position: string;
  contact: string;
  email: string;
  description: string;
  image?: File;
  status?: "active" | "on-leave" | "inactive";
}

// Make sure your Blog interface matches both the backend and frontend needs
export interface Blog {
  id: string;
  title: string;
  description: string; // This corresponds to "excerpt" in BlogCard
  excerpt?: string; // Optional for compatibility
  slug?: string; // Optional for compatibility
  image: string;
  thumbnailImage?: string;
  tags: string[];
  date: string;
  createdAt: string;
  author?: string | {
    username: string;
    email?: string;
  };
  content?: string;
  status?: "draft" | "published" | "archived";
}

// If you have an Employee interface, make sure it's separate
export interface Employee {
  // ... employee properties
  status?: "active" | "on-leave" | "inactive";
}

// Create a separate type for BlogCard if needed
export interface BlogCardData {
  id: number | string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  tags: string[];
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
}
export type UserRole = 'admin' | 'crew';

export interface User {
  id: string;
  username: string;
  role: UserRole;
}
