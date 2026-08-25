import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Sparkles,
  Compass,
  BookmarkCheck,
  PlusCircle,
  LogOut,
  User as UserIcon,
  LayoutDashboard,
  Layers,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    success('Logged out successfully');
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 text-gray-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              id="navbar-brand-link"
              className="flex items-center gap-2.5 text-gray-900 font-semibold text-lg tracking-tight group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition-colors">
                <Sparkles className="w-4 h-4 fill-white" />
              </div>
              <span className="font-serif font-bold text-xl tracking-tight text-gray-900">
                Prompt Library
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                id="nav-explore"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/') && location.pathname === '/'
                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Compass className="w-4 h-4" />
                Explore
              </Link>

              {user && (
                <>
                  <Link
                    to="/dashboard"
                    id="nav-dashboard"
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isActive('/dashboard')
                        ? 'bg-indigo-50 text-indigo-600 font-semibold'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>

                  <Link
                    to="/my-prompts"
                    id="nav-my-prompts"
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isActive('/my-prompts')
                        ? 'bg-indigo-50 text-indigo-600 font-semibold'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <BookmarkCheck className="w-4 h-4" />
                    My Prompts
                  </Link>

                  <Link
                    to="/collections"
                    id="nav-collections"
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isActive('/collections')
                        ? 'bg-indigo-50 text-indigo-600 font-semibold'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    Collections
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Right Action & User Controls */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/create"
                  id="btn-create-prompt-nav"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all shadow-xs active:scale-[0.98]"
                >
                  <PlusCircle className="w-4 h-4" />
                  Create Prompt
                </Link>

                {/* User Dropdown */}
                <div className="relative ml-2" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    id="user-menu-button"
                    className="flex items-center gap-2 p-1.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200"
                    aria-expanded={dropdownOpen}
                  >
                    <img
                      src={user.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover bg-gray-100 ring-1 ring-indigo-500/30"
                    />
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-medium text-gray-800 max-w-[100px] truncate leading-tight">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-indigo-600 font-medium leading-tight">
                        {user.role}
                      </p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-gray-200 shadow-xl py-1 z-50 text-gray-700 divide-y divide-gray-100">
                      <div className="px-4 py-3">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {user.role}
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-gray-400" />
                          Dashboard
                        </Link>
                        <Link
                          to="/my-prompts"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                        >
                          <BookmarkCheck className="w-4 h-4 text-gray-400" />
                          My Prompts
                        </Link>
                        <Link
                          to="/collections"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                        >
                          <Layers className="w-4 h-4 text-gray-400" />
                          My Collections
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-gray-400" />
                          Profile & Bio
                        </Link>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  id="nav-login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  id="nav-signup"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all shadow-xs active:scale-[0.98]"
                >
                  Join Community
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <Link
                to="/create"
                className="p-2 rounded-lg bg-indigo-600 text-white font-medium text-xs"
                title="Create Prompt"
              >
                <PlusCircle className="w-4 h-4" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-2 pb-6 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium text-gray-800 hover:bg-gray-100"
          >
            <Compass className="w-5 h-5 text-gray-500" />
            Explore Prompts
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium text-gray-800 hover:bg-gray-100"
              >
                <LayoutDashboard className="w-5 h-5 text-gray-500" />
                Dashboard
              </Link>
              <Link
                to="/my-prompts"
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium text-gray-800 hover:bg-gray-100"
              >
                <BookmarkCheck className="w-5 h-5 text-gray-500" />
                My Prompts
              </Link>
              <Link
                to="/collections"
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium text-gray-800 hover:bg-gray-100"
              >
                <Layers className="w-5 h-5 text-gray-500" />
                My Collections
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium text-gray-800 hover:bg-gray-100"
              >
                <UserIcon className="w-5 h-5 text-gray-500" />
                Profile ({user.name} - {user.role})
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium text-rose-600 hover:bg-rose-50 text-left"
              >
                <LogOut className="w-5 h-5" />
                Log Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                className="w-full py-2.5 text-center rounded-lg border border-gray-300 text-gray-700 font-medium"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="w-full py-2.5 text-center rounded-lg bg-indigo-600 text-white font-medium"
              >
                Sign Up / Join
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
