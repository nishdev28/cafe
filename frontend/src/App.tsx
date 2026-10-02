import { Suspense, lazy, useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { CartProvider } from "./contexts/cartContext";
import { SearchProvider } from "./contexts/searchContext";
import 'react-toastify/dist/ReactToastify.css';

// Lazy load components
const Layout = lazy(() => import("./layout/Layout"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/auth/login"));
const SignUp = lazy(() => import("./pages/auth/signup"));
const ProductsPage = lazy(() => import("./pages/products/ProductsPage"));
const ProductDetailPage = lazy(() => import("./pages/products/ProductDetailPage"));
const About = lazy(() => import("./pages/About"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const Blog = lazy(() => import("./pages/Blog"));
const LikedProductsPage= lazy(() => import("./pages/products/LikedProductsPage"));

const BlogDetail = lazy(() => import("./pages/BlogDetailPage"));
const AdminLayout = lazy(() => import("./admin/layout/AdminLayout"));
const AdminDashboard = lazy(() => import("./admin/pages/Dashboard"));
const CrewList = lazy(() => import("./admin/pages/CrewList"));
const AddCrew = lazy(() => import("./admin/pages/AddCrew"));
const EditCrew= lazy(() => import("./admin/pages/EditCrew"));
const Cart = lazy(() => import("./pages/Cart"));
const ProductsPageAdmin = lazy(() => import("./admin/pages/ProductPage"));
const BlogPageAdmin = lazy(() => import("./admin/pages/BLogAdmin"));
const TestimonialPage = lazy(() => import("./admin/pages/TestimonialPage"));
const LikeAnalytics = lazy(() => import("./admin/pages/LikeAnalytics"));

export interface User {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  isAdmin?: boolean;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="min-h-screen" />;
  }

  // Admin routes (only for admin users)
  const adminRoutes = user && user.role === "admin"
    ? {
        path: "/admin",
        element: <AdminLayout userRole="admin" />, // Fixed: pass "admin" directly
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "crew", element: <CrewList /> },
          { path: "crew/add", element: <AddCrew /> },
          {path: "crew/edit/:id", element: <EditCrew /> },
          { path: "products", element: <ProductsPageAdmin /> },
          { path: "blogs", element: <BlogPageAdmin /> },
          { path: "testimonials", element: <TestimonialPage /> },
{path : "analytics/likes", element: <LikeAnalytics />}
        ],
      }
    : null;

  // Create router
  const router = createBrowserRouter([
    // Public routes
    {
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/products/:id", element: <ProductsPage /> },
        { path: "/product/:id", element: <ProductDetailPage /> },
        { path: "/about-us", element: <About /> },
      {path: "/liked-products", element: <LikedProductsPage />},
        { path: "/blogs", element: <Blog /> },
        { path: "/blog/:slug", element: <BlogDetail /> },
        { path: "/login", element: <Login setUser={setUser} /> },
        { path: "/signup", element: <SignUp /> },
        { path: "/cart", element: <Cart /> },
        { path: "/search", element: <SearchPage /> },
      ],
    },

    // Admin routes (only for admin users)
    ...(adminRoutes ? [adminRoutes] : []),

    // Redirect normal users trying to access /admin
    ...(user && user.role === "user"
      ? [{ path: "/admin/*", element: <Navigate to="/" /> }]
      : []),

    // Catch-all
    { path: "*", element: <Navigate to={user?.role === "admin" ? "/admin" : "/"} /> },
  ]);

  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <CartProvider>
        <SearchProvider>
          <RouterProvider router={router} />
        </SearchProvider>
      </CartProvider>
    </Suspense>
  );
}