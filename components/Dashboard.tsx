import { Plus, UserPlus } from "lucide-react";

interface CategoryDistribution {
  category: string;
  count: number;
}

interface RecentActivity {
  action: string;
  contact: string;
  date: string;
}

interface DashboardProps {
  analytics: {
    totalContacts: number;
    categoriesDistribution: CategoryDistribution[];
    recentActivity: RecentActivity[];
  };
}

const Dashboard: React.FC<DashboardProps> = ({ analytics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Contacts Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Total Contacts
        </h3>
        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
          {analytics.totalContacts}
        </p>
      </div>

      {/* Categories Distribution Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Categories
        </h3>
        <div className="mt-4 space-y-2">
          {analytics.categoriesDistribution.map((category) => (
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
          {analytics.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center">
                {activity.action === "Added" && <Plus size={16} />}
                {activity.action === "Updated" && <UserPlus size={16} />}
                {activity.action === "Deleted" && <UserPlus size={16} />}
              </div>
              <div>
                <p className="text-sm text-gray-900 dark:text-white">
                  {activity.action} {activity.contact}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
