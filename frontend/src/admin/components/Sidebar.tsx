import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from "@/assets/illustrations/logo.svg";
// Removed unused import: type { UserRole } from "@/types/products"

interface SidebarProps {
  userRole: "admin" | "crew";
}

export const Sidebar: React.FC<SidebarProps> = ({ userRole }) => { // Added export
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const links = [
    { name: "Dashboard", path: "/admin"  },
    ...(userRole === "admin"
      ? [
    { name: "Products", path: "/admin/products"  },
   
{
  name: "Like Analytics", 
  path: "/admin/analytics/likes"
},
    { name: "Blogs", path: "/admin/blogs" },
    { name: "Testimonials", path: "/admin/testimonials" },
    {name: "Crew Management", path: "/admin/crew" },
  ]
  : []),
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <aside className="w-64 bg-[#8C3A22]  border-r border-gray-200 h-full flex flex-col transition-all duration-300">
      <div className="p-6">
      <Link to="/admin  ">
          <img
            src={logo}
            className="h-auto w-32 object-contain"
            alt="logo"
            loading="eager"
          />
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              pathname === link.path
                ? "bg-[#F3DCC9] text-[#8C3A22] shadow-md shadow-purple-200"
                : " hover:bg-[#F3DCC9] hover:text-[#8C3A22]"
            }`}
          >
            <span className="font-medium">{link.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-semibold py-3 rounded-xl hover:bg-red-100 transition-colors"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};