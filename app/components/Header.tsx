"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";
import { LayoutGrid, List } from "lucide-react";
import { signOut } from "next-auth/react";
interface HeaderProps {
  // showForm: boolean;
  // setShowForm: (value: boolean) => void;
  viewMode: string;
  setViewMode: (value: string) => void;
  userName: string | null | undefined;
}
const Header: React.FC<HeaderProps> = ({ userName = "User", viewMode, setViewMode }) => {
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
        <Button
          variant="outline"
          size="icon"
          onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
        >
          {viewMode === "grid" ? (
            <List className="w-5 h-5" />
          ) : (
            <LayoutGrid className="w-5 h-5" />
          )}
        </Button>

        {/* <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Contact"}
        </Button> */}

        <div className="flex items-center space-x-4">
          <span className="text-gray-600">
            Welcome, {userName || "User"}
          </span>
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
