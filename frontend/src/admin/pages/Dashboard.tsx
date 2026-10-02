import { getAllCrew } from "@/api/crewApi";
import { getAllProducts } from "@/api/products";
import { fetchPublishedBlogs, fetchAllBlogs } from "@/api/blog";
import { getAllTestimonials } from "@/api/testimonals";
import { useEffect, useState } from "react";
import { Quote, RefreshCcw , MessageSquare, Users, AlertTriangle, Check} from "lucide-react";

// Define types for our data
interface CrewMember {
  _id: string;
  name: string;
  position: string;
  description: string;
  image: string;
  email: string;
  contact: string;
  status: "active" | "on-leave" | "inactive";
  updatedAt?: string;
  createdAt?: string;
}

interface Blog {
  id?: string;
  _id?: string;
  title: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

interface Product {
  _id: string;
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: 'draft' | 'published' | 'archived' | 'active';
  updatedAt?: string;
  createdAt?: string;
}

interface Testimonial {
  _id: string;
  name: string;
  content: string;
  rating: number;
  createdAt?: string;
  updatedAt?: string;
}

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    activeProducts: 0,
    outOfStockProducts: 0,
    totalCrews: 0,
    publishedBlogs: 0,
    totalTestimonials: 0,
    lastPublishedBlog: null as string | null,
    lastUpdatedTimestamp: null as string | null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data concurrently
        const [
          crewResponse,
          productsResponse,
          publishedBlogsResponse,
          allBlogsResponse,
          testimonialsResponse
        ] = await Promise.allSettled([
          getAllCrew(),
          getAllProducts(),
          fetchPublishedBlogs(),
          fetchAllBlogs(),
          getAllTestimonials()
        ]);

        const metrics = {
          activeProducts: 0,
          outOfStockProducts: 0,
          totalCrews: 0,
          publishedBlogs: 0,
          totalTestimonials: 0,
          lastPublishedBlog: null as string | null,
          lastUpdatedTimestamp: null as string | null
        };

        // Process crew data
        if (crewResponse.status === 'fulfilled') {
          const responseData = crewResponse.value;
          let crewList: CrewMember[] = [];
          
          if (responseData && typeof responseData === 'object') {
            if (Array.isArray((responseData as any).crew)) {
              crewList = (responseData as any).crew;
            } else if (Array.isArray(responseData)) {
              crewList = responseData;
            }
          }
          
          console.log("Crew data:", crewList);
          metrics.totalCrews = crewList.length;
        }

        // Process product data
        if (productsResponse.status === 'fulfilled') {
          const products = Array.isArray(productsResponse.value) 
            ? productsResponse.value as Product[]
            : [];
          
          products.forEach((product: Product) => {
            // Fix the type comparison - check for 'published' status instead of 'active'
            if (product.status === 'published') {
              metrics.activeProducts++;
            }
            if (product.stock === 0) {
              metrics.outOfStockProducts++;
            }
          });
        }

        // Process blog data
        if (publishedBlogsResponse.status === 'fulfilled') {
          const blogs = (publishedBlogsResponse.value as any)?.blogs || [];
          metrics.publishedBlogs = blogs.length;
          
          // Find the most recently published blog
          if (blogs.length > 0) {
            const sortedBlogs = [...blogs].sort(
              (a: Blog, b: Blog) => {
                const dateA = a.publishedAt || a.createdAt || a.updatedAt || '0';
                const dateB = b.publishedAt || b.createdAt || b.updatedAt || '0';
                return new Date(dateB).getTime() - new Date(dateA).getTime();
              }
            );
            const latestBlog = sortedBlogs[0];
            const latestDate = latestBlog.publishedAt || latestBlog.createdAt || latestBlog.updatedAt;
            if (latestDate) {
              metrics.lastPublishedBlog = new Date(latestDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
            }
          }
        }

        // Process testimonials
        if (testimonialsResponse.status === 'fulfilled') {
          const testimonials = Array.isArray(testimonialsResponse.value)
            ? testimonialsResponse.value as Testimonial[]
            : [];
          metrics.totalTestimonials = testimonials.length;
        }

        // Determine last updated timestamp
        const timestamps: number[] = [];
        
        if (allBlogsResponse.status === 'fulfilled') {
          const allBlogs = (allBlogsResponse.value as any)?.blogs || [];
          allBlogs.forEach((blog: Blog) => {
            if (blog.updatedAt) timestamps.push(new Date(blog.updatedAt).getTime());
          });
        }

        if (productsResponse.status === 'fulfilled') {
          const products = Array.isArray(productsResponse.value) 
            ? productsResponse.value as Product[]
            : [];
          products.forEach((product: Product) => {
            if (product.updatedAt) timestamps.push(new Date(product.updatedAt).getTime());
          });
        }

        // Also add crew timestamps
        if (crewResponse.status === 'fulfilled') {
          const responseData = crewResponse.value;
          let crewList: CrewMember[] = [];
          
          if (responseData && typeof responseData === 'object') {
            if (Array.isArray((responseData as any).crew)) {
              crewList = (responseData as any).crew;
            } else if (Array.isArray(responseData)) {
              crewList = responseData;
            }
          }
          
          crewList.forEach((crew: CrewMember) => {
            if (crew.updatedAt) timestamps.push(new Date(crew.updatedAt).getTime());
          });
        }

        // Add testimonial timestamps
        if (testimonialsResponse.status === 'fulfilled') {
          const testimonials = Array.isArray(testimonialsResponse.value)
            ? testimonialsResponse.value as Testimonial[]
            : [];
          testimonials.forEach((testimonial: Testimonial) => {
            if (testimonial.updatedAt) timestamps.push(new Date(testimonial.updatedAt).getTime());
          });
        }

        if (timestamps.length > 0) {
          const latestTimestamp = Math.max(...timestamps);
          metrics.lastUpdatedTimestamp = new Date(latestTimestamp).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        }

        setDashboardData(metrics);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const refreshData = () => {
    setError(null);
    // Trigger a re-render by setting loading to true and letting useEffect run again
    setLoading(true);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={refreshData}
            className="mt-2 px-4 py-2 bg-red-600  rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        <button
          onClick={refreshData}
          className="px-4 py-2 bg-blue-600  rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <RefreshCcw/>
          Refresh Data
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Active Inventory Items */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Products</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{dashboardData.activeProducts}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Currently available for sale</p>
        </div>

        {/* Out of Stock Items */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Out of Stock</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{dashboardData.outOfStockProducts}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
             <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Requires restocking</p>
        </div>

        {/* Crew Members Onboarded */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Crew Members</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{dashboardData.totalCrews}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
             <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Total crew members onboarded</p>
        </div>

        {/* Blogs Published */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Published Blogs</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{dashboardData.publishedBlogs}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Quote className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          {dashboardData.lastPublishedBlog && (
            <p className="text-xs text-gray-500 mt-3">
              Last published: <span className="font-medium">{dashboardData.lastPublishedBlog}</span>
            </p>
          )}
        </div>

        {/* Testimonials */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Testimonials</p>
              <p className="text-3xl font-bold text-amber-600 mt-2">{dashboardData.totalTestimonials}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-lg">
              <MessageSquare className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Customer testimonials collected</p>
        </div>

      </div>

      {/* Summary Stats */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Inventory Health</p>
            <p className="text-xl font-bold mt-2">
              {dashboardData.activeProducts}/{dashboardData.activeProducts + dashboardData.outOfStockProducts}
            </p>
            <p className="text-xs text-gray-500">Active vs Total Products</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Content Ratio</p>
            <p className="text-xl font-bold mt-2">
              {dashboardData.publishedBlogs}:{dashboardData.totalTestimonials}
            </p>
            <p className="text-xs text-gray-500">Blogs : Testimonials</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Team Coverage</p>
            <p className="text-xl font-bold mt-2">
              {dashboardData.totalCrews} members
            </p>
            <p className="text-xs text-gray-500">Available for assignments</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;