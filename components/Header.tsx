"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
  Search,
  LogOut,
  HelpCircle,
  Moon,
  Sun,
  X,
  ChevronDown,
  Filter,
} from "lucide-react";
import { SidebarTrigger } from "./ui/sidebar";
import Help from "@components/Help";
interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  userName: string | null | undefined;
}

const Header: React.FC<HeaderProps> = ({
  userName = "User",
  searchTerm,
  setSearchTerm,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [theme, setTheme] = useState(() =>
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
      ? "dark"
      : "light"
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [themekey, setThemekey] = useState(0);
  const profileRef = useRef<HTMLDivElement>(null);

  const searchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node) &&
        window.innerWidth < 768 // Only for mobile
      ) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle dark mode toggle
  useEffect(() => {
    if (session) {
      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem("theme", theme);
    }
  }, [theme, session]);

  // Get initials from username
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const toggleDarkMode = () => {
    setTheme((prev) => {
      const newTheme = prev === "dark" ? "light" : "dark";
      setThemekey((k) => k + 1);
      return newTheme;
    });
  };

  return (
    <header
      key={themekey}
      className="sticky top-0 z-30 bg-white dark:bg-gray-900 shadow-md transition-all duration-300"
    >
      <div className="container mx-auto px-4">
        <Help onClose={closeModal} isOpen={isModalOpen} />
        <div className="flex justify-between items-center h-16">
          {/* Logo and mobile menu */}
          <div className="flex items-center gap-2">
            <SidebarTrigger className="cursor-pointer h-5 w-5 text-2xl text-gray-600 dark:text-gray-300" />

            <motion.div
              className="flex items-center gap-3"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120 }}
            >
              <Link href="/" className="flex flex-col items-center">
                <h1 className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
                  ContactsHub
                </h1>
                <p className="text-xs">group20/DSA/COE3</p>
              </Link>
            </motion.div>
          </div>

          {/* Search bar - desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search contacts..."
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
              )}
            </div>
            <button className="ml-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              <Filter className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile search button */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => {
                setIsSearchExpanded(!isSearchExpanded);
                // Focus the search input after animation completes
                setTimeout(() => {
                  const input = document.getElementById("mobile-search-input");
                  if (input) (input as HTMLInputElement).focus();
                }, 300);
              }}
            >
              <Search className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>

            {/* Dark mode toggle */}
            <button
              className="cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={toggleDarkMode}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            {/* User profile */}
            <div className="relative" ref={profileRef}>
              <button
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                }}
              >
                <div className="h-8 w-8 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center font-medium">
                  {getInitials(userName || "User")}
                </div>
                <span className="hidden md:block text-sm text-gray-700 dark:text-gray-300">
                  {userName || "User"}
                </span>
                <ChevronDown className="hidden md:block h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-30"
                  >
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {userName || "User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {session?.user?.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <div
                        onClick={openModal}
                        className="cursor-pointer flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <HelpCircle
                          onClick={openModal}
                          className=" h-4 w-4 mr-3 text-gray-500 dark:text-gray-400"
                        />
                        Help & Support
                      </div>
                    </div>
                    <div className="py-1 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="cursor-pointer flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <LogOut className="h-4 w-4 mr-3 text-red-500 dark:text-red-400" />
                        Sign Out
                      </button>
                    </div>
                    <div></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile search bar - expandable */}
        <AnimatePresence>
          {isSearchExpanded && (
            <motion.div
              ref={mobileSearchRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden pb-3"
            >
              <div className="relative w-full flex items-center">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  id="mobile-search-input"
                  type="text"
                  placeholder="Search contacts..."
                  className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute right-0 flex space-x-1 pr-2">
                  {searchTerm && (
                    <button className="p-1" onClick={() => setSearchTerm("")}>
                      <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  )}
                  <button
                    className="p-1"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  >
                    <Filter className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
export default Header;
