// Header.tsx - Fixed version

import { Link, NavLink, useNavigate } from "react-router";
import { Search, User, ShoppingBag, X, Menu, Heart } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/contexts/cartContext";
import logo from "@/assets/illustrations/logo.svg";

// Add this to check if user is logged in
const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    if (token && userStr) {
      setIsLoggedIn(true);
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  return { isLoggedIn, user };
};

const menus = [
  { title: "home", href: "/" },
  { title: "products", href: "/products/1" },
  { title: "about us", href: "/about-us" },
  { title: "blogs", href: "/blogs" },
];

export default function Header() {
  const [show, setShow] = useState(false);
  const [searchActive, setSearchActive] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const { isLoggedIn, user } = useAuth();

  const { state } = useCart();
  const { items } = state;
  const navigate = useNavigate();

  // get total count (item * quantity)
  let c: number = 0
  items.forEach(i => { c = c + i.quantity })

  // Toggle search input
  const toggleSearch = () => setSearchActive(prev => !prev);

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchText.trim()) return;

    navigate(`/search?q=${encodeURIComponent(searchText)}`);
    setSearchText("");
    setSearchActive(false);
    setShow(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <header className="bg-[url('/nav-bg.webp')]">
      <div className="flex items-center justify-between gap-5 px-5 py-5">
        <Link to="/">
          <img
            src={logo}
            className="h-auto w-42 object-contain"
            alt="logo"
            loading="eager"
          />
        </Link>
        <div className="flex items-center gap-10">
          <nav className="hidden items-center gap-10 sm:flex">
            {menus.map((m) => (
              <NavLink to={m.href} className="text-lg " key={m.title}>
                {m.title}
              </NavLink>
            ))}
          </nav>

          <ButtonGroup
            count={c}
            toggleSearch={toggleSearch}
            searchActive={searchActive}
            searchText={searchText}
            setSearchText={setSearchText}
            handleSearchSubmit={handleSearchSubmit}
            isLoggedIn={isLoggedIn}
            user={user}
            onLogout={handleLogout}
          />

          <button
            className="cursor-pointer  sm:hidden"
            onClick={() => setShow(!show)}
          >
            {show ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* mobile menus */}
      {show && (
        <div className="flex flex-col items-center justify-center gap-5 pb-5">
          {menus.map((m) => (
            <NavLink 
              to={m.href} 
              className="text-lg " 
              key={m.title}
              onClick={() => setShow(false)}
            >
              {m.title}
            </NavLink>
          ))}
          {/* Mobile user menu */}
          {isLoggedIn ? (
            <>
              <NavLink 
                to="/liked-products" 
                className="text-lg "
                onClick={() => setShow(false)}
              >
                ❤️ Liked Products
              </NavLink>
              {user?.role === 'admin' && (
                <NavLink 
                  to="/admin" 
                  className="text-lg "
                  onClick={() => setShow(false)}
                >
                  🛠️ Admin
                </NavLink>
              )}
              <button 
                onClick={() => {
                  handleLogout();
                  setShow(false);
                }} 
                className="text-lg  cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink 
              to="/login" 
              className="text-lg "
              onClick={() => setShow(false)}
            >
              Login
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
}

// Updated ButtonGroup with fixed cart link
function ButtonGroup({
  count,
  toggleSearch,
  searchActive,
  searchText,
  setSearchText,
  handleSearchSubmit,
  isLoggedIn,
  user,
  onLogout
}: {
  count: number;
  toggleSearch: () => void;
  searchActive: boolean;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  handleSearchSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoggedIn: boolean;
  user: any;
  onLogout: () => void;
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-5  sm:gap-8">
      {/* Search */}
      <div className="relative">
        <button onClick={toggleSearch} className="mt-2">
          <Search strokeWidth={1.5} className="" />
        </button>
        {searchActive && (
          <form
            onSubmit={handleSearchSubmit}
            className="absolute top-full
              left-1/2 -translate-x-1/2
              w-[90vw] max-w-xs sm:left-auto sm:right-0 sm:translate-x-0 sm:w-64 flex gap-2 rounded bg-white p-1 shadow-lg z-50"
          >
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              autoFocus
              className="w-full rounded px-2 text-black outline-none"
              placeholder="Search products..."
            />
            <button
              type="submit"
              className="rounded bg-[url('/nav-bg.webp')] px-3  whitespace-nowrap"
            >
              Go
            </button>
          </form>
        )}
      </div>

      {/* User Menu with Dropdown */}
      <div className="relative" ref={userMenuRef}>
        <button 
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-1 cursor-pointer"
        >
          <User strokeWidth={1.5} className="" />
          {isLoggedIn && user && (
            <span className="text-xs bg-yellow-500  rounded-full w-5 h-5 flex items-center justify-center">
              {user.username?.charAt(0).toUpperCase()}
            </span>
          )}
        </button>

        {showUserMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
            {isLoggedIn ? (
              <>
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <Link
                  to="/liked-products"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Heart size={16} className="text-red-500" />
                  Liked Products
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <span>🛠️</span>
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    onLogout();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                onClick={() => setShowUserMenu(false)}
              >
                Login / Register
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Cart - Separate Link */}
      <Link to="/cart" className="relative">
        <ShoppingBag strokeWidth={1.5} className="" />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 size-5 bg-white rounded-full flex justify-center items-center text-[var(--color-purple)] text-xs font-bold">
            {count}
          </span>
        )}
      </Link>
    </div>
  );
}