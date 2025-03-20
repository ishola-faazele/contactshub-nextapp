import { Plus, UserPlus, Trash, Star, AlertCircle } from "lucide-react";
import { UserActivity } from "@/types/types";
import { CategoryDistribution } from "@/types/types";

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
  maxActivities = 5,
}) => {
  // Get only the most recent activities limited by maxActivities
  const displayedActivities = recentActivity.slice(0, maxActivities);

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
        activity.action_type ? "favorite" : "not favorite"
      }`;
    }
    if (activity.action === "set_status") {
      return `Set ${activity.contact_name} status to ${activity.action_type}`;
    }
    return `${activity.action} ${activity.contact_name}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Contacts Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Total Contacts
        </h3>
        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
          {totalContacts}
        </p>
      </div>

      {/* Categories Distribution Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
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
      </div>

      {/* Recent Activity Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
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
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
