// types/like.ts
export interface LikeResponse {
    success: boolean;
    message?: string;
    likeCount: number;
    liked: boolean;
  }
  
  export interface LikeCheckResponse {
    success: boolean;
    liked: boolean;
    likeCount: number;
  }
  
  export interface LikedProduct {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    description: string;
    likeCount: number;
    liked: boolean;
  }
  
  export interface PaginatedLikedProducts {
    success: boolean;
    products: LikedProduct[];
    pagination: {
      total: number;
      page: number;
      pages: number;
      limit: number;
    };
  }
  
  // Admin types
  export interface AdminProductLikesResponse {
    success: boolean;
    product: {
      id: string;
      name: string;
      slug: string;
      price: number;
      totalLikes: number;
    };
    likedBy: Array<{
      id: string;
      username: string;
      email: string;
      role: string;
      joinedAt: string;
    }>;
  }
  
  export interface LikeStatsResponse {
    success: boolean;
    summary: {
      totalProducts: number;
      totalLikes: number;
      productsWithLikes: number;
      averageLikesPerProduct: string;
      mostLikedProduct: {
        id: string;
        name: string;
        likeCount: number;
      } | null;
    };
    topLikedProducts: Array<{
      id: string;
      name: string;
      slug: string;
      price: number;
      likeCount: number;
      uniqueUsers: number;
    }>;
    allProducts: Array<{
      id: string;
      name: string;
      slug: string;
      price: number;
      likeCount: number;
      uniqueUsers: number;
    }>;
  }
  
  export interface PowerUser {
    user: {
      id: string;
      username: string;
      email: string;
      role: string;
    };
    totalLikes: number;
    likedProducts: Array<{
      id: string;
      name: string;
      price: number;
    }>;
  }
  
  export interface PowerUsersResponse {
    success: boolean;
    powerUsers: PowerUser[];
  }