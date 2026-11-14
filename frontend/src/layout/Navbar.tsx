import { useEffect, useState } from "react";
import { BiLink, BiSun, BiMoon } from "react-icons/bi";
import { MdMenu, MdClose } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { navLinks } from "../data/navData";
import api from "../api/api";
import { toast } from "react-toastify";

function Navbar() {
  const { accessToken,user } = useAuth();
  const name = user?.name.slice(0,1)
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };
  const handleLogout = async () => {
    try {
      const response = await api.post("/api/auth/logout");
      console.log(response)
      toast.success("Logout successfull...")
      window.location.reload();

      
    } catch (error) {
      console.error("logout error :", error);
      toast.error("somthing wrong...")
    }
  }
  const linkStyle = ({ isActive }: { isActive: boolean }) =>
    `relative transition-all duration-300 hover:text-green-600 dark:hover:text-green-400
    ${
      isActive
        ? "text-green-600 dark:text-green-400 font-semibold"
        : "text-slate-600 dark:text-slate-300"
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-green-100 dark:border-green-900/50 bg-green-100/80 dark:bg-[#0b0f0c]/95 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-18.75 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 group">
          <BiLink className="text-green-600 dark:text-green-400 size-10 group-hover:rotate-12 transition-transform" />

          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Short
            <span className="text-green-600 dark:text-green-400">Link</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-8 font-medium text-[15px]">
          {navLinks.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.link}
                end={item.link === "/"}
                className={linkStyle}
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2.5 rounded-xl text-slate-600 hover:bg-green-50 hover:text-green-600 dark:text-green-300 dark:hover:bg-green-900/30 transition-all"
          >
            {isDark ? (
              <BiSun className="size-5" />
            ) : (
              <BiMoon className="size-5" />
            )}
          </button>

          <Link
            to={accessToken ? "/shorturl" : "/login"}
            className="px-5 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20 transition-all"
          >
            Get Started
          </Link>
          {accessToken ? (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-x-3 px-3 py-2.5 rounded-xl border border-green-600 text-green-700 dark:text-green-400 dark:border-green-500 font-semibold hover:bg-green-50 dark:hover:bg-green-900/30 transition-all"
            >
             <span className="px-2 py-0.5 border rounded-full">{name}</span> Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl border border-green-600 text-green-700 dark:text-green-400 dark:border-green-500 font-semibold hover:bg-green-50 dark:hover:bg-green-900/30 transition-all"
            >
              Login
            </Link>
          )}
        </div>

        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30"
          >
            {isDark ? (
              <BiSun className="size-6" />
            ) : (
              <BiMoon className="size-6" />
            )}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            className="p-2 rounded-xl text-slate-800 dark:text-white hover:bg-green-50 dark:hover:bg-green-900/30"
          >
            {isOpen ? (
              <MdClose className="size-7" />
            ) : (
              <MdMenu className="size-7" />
            )}
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pt-3 pb-7 border-t border-green-100 dark:border-green-900/50 bg-white dark:bg-[#0b0f0c]">
          <p className="text-xs uppercase tracking-widest font-bold text-green-600 dark:text-green-400 mb-4">
            Navigation
          </p>

          <ul className="flex flex-col gap-1">
            {navLinks.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.link}
                  end={item.link === "/"}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl font-medium transition-all ${
                      isActive
                        ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "text-slate-700 hover:bg-green-50 dark:text-slate-300 dark:hover:bg-green-900/20"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-2 gap-3 mt-6">
            
            <Link
              to={accessToken ? "/shorturl" : "/login"}
              onClick={() => setIsOpen(false)}
              className="text-center py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-all"
            >
              Get Started
            </Link>
            {accessToken ? 
            <button
              onClick={() => {setIsOpen(false),handleLogout}}
              className="text-center py-3 rounded-xl border border-green-600 text-green-700 dark:text-green-400 dark:border-green-500 font-semibold"
            >
              <span className="px-2 py-0.5 border rounded-full">{name}</span> Logout
            </button> :
            <Link
              to={"/login"}
              onClick={() => setIsOpen(false)}
              className="text-center py-3 rounded-xl border border-green-600 text-green-700 dark:text-green-400 dark:border-green-500 font-semibold"
            >
              Login
            </Link>
            }
            

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
