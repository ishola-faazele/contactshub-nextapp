import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, List, Filter } from "lucide-react";

interface ActionBarProps {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  categories: string[];
  filterCategory: string | null;
  setFilterCategory: (category: string | null) => void;
  sortOption: "name" | "recent" | "category";
  setSortOption: (option: "name" | "recent" | "category") => void;
}

const ActionBar: React.FC<ActionBarProps> = ({
  viewMode,
  setViewMode,
  categories,
  filterCategory,
  setFilterCategory,
  sortOption,
  setSortOption,
}) => {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-end mb-6 gap-4">
      {/* <div className="flex items-center gap-2">
        <Link
          href="/contacts/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <UserPlus size={18} />
          <span>Add Contact</span>
        </Link>
      </div> */}

      <div className="flex items-center gap-2">
        <button
          onClick={() => setViewMode("grid")}
          className={`p-2 rounded-md ${
            viewMode === "grid"
              ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700"
          }`}
        >
          <LayoutGrid size={18} />
        </button>

        <button
          onClick={() => setViewMode("list")}
          className={`p-2 rounded-md ${
            viewMode === "list"
              ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700"
          }`}
        >
          <List size={18} />
        </button>

        <div className="relative">
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className="p-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <Filter size={18} />
            <span>Filter</span>
          </button>

          <AnimatePresence>
            {isFilterPanelOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50"
              >
                <div className="p-4 space-y-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Filter by Category
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <input
                          type="checkbox"
                          checked={filterCategory === category}
                          onChange={() =>
                            setFilterCategory(
                              filterCategory === category ? null : category
                            )
                          }
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <span>{category}</span>
                      </label>
                    ))}
                  </div>
                  <hr className="border-gray-200 dark:border-gray-700" />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Sort By
                  </h3>
                  <div className="space-y-2">
                    {["name", "recent", "category"].map((option) => (
                      <button
                        key={option}
                        onClick={() =>
                          setSortOption(
                            option as "name" | "recent" | "category"
                          )
                        }
                        className={`w-full text-left p-2 rounded-md ${
                          sortOption === option
                            ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ActionBar;
