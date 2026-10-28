import { useState } from "react";
import { CiHeart } from "react-icons/ci";
import { AiOutlineSearch } from "react-icons/ai";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `inline-flex h-10 items-center border-b-2 text-sm font-medium
    transition-colors duration-200 ${
      isActive
        ? "border-primary text-white"
        : "border-transparent text-gray-400 hover:text-white"
    }`;

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logout();
      navigate("/login", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-dark-100 bg-dark">
      <nav className="mx-auto flex min-h-16 w-full max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-bold">
            H
          </span>
          <span className="text-xl font-bold tracking-tight">LearnHub</span>
        </NavLink>

        <div className="hidden items-center gap-5 md:flex lg:gap-6">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/courses" className={navLinkClass}>
            Courses
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>

              <NavLink to="/instructor" className={navLinkClass}>
                Instructor
              </NavLink>

              <NavLink to="/admin" className={navLinkClass}>
                Admin
              </NavLink>
            </>
          )}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <div className="hidden h-9 w-36 items-center gap-2 rounded-md border border-dark-100 bg-dark-200 px-3 text-secondary lg:flex xl:w-48">
            <AiOutlineSearch className="h-4 w-4 shrink-0" />

            <input
              type="search"
              placeholder="Search courses"
              aria-label="Search courses"
              className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-secondary"
            />
          </div>

          <button
            type="button"
            aria-label="Wishlist"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-dark-200 hover:text-white"
          >
            <CiHeart size={23} />
          </button>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `hidden h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors sm:inline-flex ${
                    isActive ? "text-white" : "text-gray-300 hover:text-white"
                  }`
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/signup"
                className="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
