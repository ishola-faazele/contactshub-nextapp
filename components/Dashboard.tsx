import {
  Plus,
  UserPlus,
  Trash,
  Star,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { UserActivity } from "@/types/types";
import { CategoryDistribution } from "@/types/types";
import { useState, useEffect } from "react";

interface DashboardProps {
  totalContacts: number;
  categoriesDistribution: CategoryDistribution[];
  recentActivity: UserActivity[];
  maxActivities?: number;
}

const Dashboard: React.FC<DashboardProps> = ({
  totalContacts,
  categoriesDistribution,
  recentActivity,
  maxActivities = 3,
}) => {
  // State for carousel
  const [currentCard, setCurrentCard] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Get only the most recent activities limited by maxActivities
  const displayedActivities = recentActivity.slice(0, maxActivities);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Function to get the appropriate icon for each activity type
  const getActivityIcon = (action: string) => {
    switch (action) {
      case "added":
        return <Plus size={16} />;
      case "updated":
        return <UserPlus size={16} />;
      case "deleted":
        return <Trash size={16} />;
      case "toggle_favorite":
        return <Star size={16} />;
      case "set_status":
        return <AlertCircle size={16} />;
      default:
        return <UserPlus size={16} />;
    }
  };

  // Function to format the activity description
  const getActivityDescription = (activity: UserActivity) => {
    if (activity.action === "toggle_favorite") {
      return `Marked ${activity.contact_name} as ${
        activity.action_type === "favorite" ? "favorite" : "not favorite"
      }`;
    } else if (activity.action === "set_status") {
      if (activity.action_type === "active") {
        return `Reactivated ${activity.contact_name}`;
      } else if (activity.action_type === "blocked") {
        return `Blocked ${activity.contact_name}`;
      } else if (activity.action_type === "bin") {
        return `Moved ${activity.contact_name} to Bin`;
      }
    } else if (activity.action === "added") {
      return `Added New Contact: ${activity.contact_name}`;
    } else if (activity.action === "deleted") {
      return `Deleted Contact: ${activity.contact_name}`;
    } else if (activity.action === "updated") {
      return `Updated Contact: ${activity.contact_name}`;
    }
    return "";
  };

  // Function to navigate carousel
  const navigateCarousel = (direction: "next" | "prev") => {
    if (direction === "next") {
      setCurrentCard((prev) => (prev === 2 ? 0 : prev + 1));
    } else {
      setCurrentCard((prev) => (prev === 0 ? 2 : prev - 1));
    }
  };

  // Card components
  const cards = [
    // Total Contacts Card
    <div
      key="total-contacts"
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm h-full"
    >
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        Total Contacts
      </h3>
      <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
        {totalContacts}
      </p>
    </div>,

    // Categories Distribution Card
    <div
      key="categories"
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm h-full"
    >
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        Categories
      </h3>
      <div className="mt-4 space-y-2">
        {categoriesDistribution.map((category) => (
          <div
            key={category.category}
            className="flex items-center justify-between"
          >
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {category.category}
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {category.count}
            </span>
          </div>
        ))}
      </div>
    </div>,

    // Recent Activity Card
    <div
      key="recent-activity"
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm h-full"
    >
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        Recent Activity
      </h3>
      <div className="mt-4 space-y-3">
        {displayedActivities.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No recent activity
          </p>
        ) : (
          displayedActivities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center">
                {getActivityIcon(activity.action)}
              </div>
              <div>
                <p className="text-sm text-gray-900 dark:text-white">
                  {getActivityDescription(activity)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>,
  ];

  // Mobile Carousel View
  if (isMobile) {
    return (
      <div className="mb-8">
        <div className="relative">
          {/* Current Card */}
          <div className="transition-all duration-300 ease-in-out">
            {cards[currentCard]}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-4 space-x-2">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={() => setCurrentCard(index)}
                className={`h-2 w-2 rounded-full ${
                  currentCard === index
                    ? "bg-indigo-600 dark:bg-indigo-400"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => navigateCarousel("prev")}
            className="absolute top-1/2 left-0 -translate-y-1/2 -ml-4 bg-white dark:bg-gray-700 rounded-full p-1 shadow-md text-gray-600 dark:text-gray-300"
            aria-label="Previous card"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => navigateCarousel("next")}
            className="absolute top-1/2 right-0 -translate-y-1/2 -mr-4 bg-white dark:bg-gray-700 rounded-full p-1 shadow-md text-gray-600 dark:text-gray-300"
            aria-label="Next card"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Card Title Indicator */}
        <div className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mt-4">
          {currentCard === 0
            ? "Total Contacts"
            : currentCard === 1
            ? "Categories"
            : "Recent Activity"}
        </div>
      </div>
    );
  }

  // Desktop Grid View (unchanged)
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">{cards}</div>
  );
};

export default Dashboard;
