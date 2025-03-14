"use client";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
interface HeaderProps {
  // showForm: boolean;
  // setShowForm: (value: boolean) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  userName: string | null | undefined;
}
const Header: React.FC<HeaderProps> = ({
  userName = "User",
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <header className="flex justify-between items-center bg-white dark:bg-gray-900 shadow-md p-4 rounded-xl">
      <motion.div
        className="flex items-center gap-3"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          ContactHub
        </h1>
      </motion.div>

      <div className="flex items-center gap-4 cursor-pointer">
        <input
          type="text"
          placeholder="Search contacts..."
          className="w-full px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Welcome, {userName || "User"}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
