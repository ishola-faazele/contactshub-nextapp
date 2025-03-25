import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ContactType, PageConfig, UserActivity } from "../types/types";
import { LinkedList } from "knust-compeng-dsa-linkedlist";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate category distribution from contacts
 * Returns top 3 categories + "Other" category
 */
export const calculateCategoryDistribution = (
  contacts: LinkedList<ContactType>
) => {
  // Create a map to count occurrences of each category
  const categoryMap = new Map<string, number>();

  // Count each category occurrence
  contacts.forEach((contact) => {
    if (Array.isArray(contact.categories)) {
      contact.categories.forEach((category) => {
        if (category) {
          const count = categoryMap.get(category) || 0;
          categoryMap.set(category, count + 1);
        }
      });
    }
  });

  // Convert map to array and sort by count (descending)
  const sortedCategories = Array.from(categoryMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  // Get top 3 categories
  const topCategories = sortedCategories.slice(0, 3);

  // Calculate "Other" category count (all categories beyond top 3)
  const otherCount = sortedCategories
    .slice(3)
    .reduce((sum, item) => sum + item.count, 0);

  // Only add "Other" category if there are any
  const result = topCategories.concat(
    otherCount > 0 ? [{ category: "Other", count: otherCount }] : []
  );

  return result;
};

/**
 * Get most recent activities
 */
export const getRecentActivities = (activities: LinkedList<UserActivity>) => {
  return activities.toSorted(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

export const getDashboardData = (
  statusFilter: string,
  activeContacts: LinkedList<ContactType>,
  userActivities: LinkedList<UserActivity>
) => {
  if (statusFilter !== "/") {
    return {
      totalContacts: 0,
      categoriesDistribution: [],
      recentActivity: new LinkedList<UserActivity>(),
    };
  }

  return {
    totalContacts: activeContacts.length,
    categoriesDistribution: calculateCategoryDistribution(activeContacts),
    recentActivity: getRecentActivities(userActivities),
  };
};

export const getFilteredAndSortedContacts = (
  contacts: LinkedList<ContactType>,
  statusFilter: string,
  searchTerm: string,
  filterCategory: string | null,
  sortOption: string
) => {
  let filtered = contacts.filter(
    (contact) => !statusFilter || contact.status === statusFilter
  );

  if (searchTerm) {
    filtered = filtered.filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact?.phone?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );
  }

  if (filterCategory) {
    filtered = filtered.filter((contact) =>
      (contact.categories as string[]).includes(filterCategory)
    );
  }

  // Create a new sorted LinkedList based on the sort option
  let result: LinkedList<ContactType>;

  switch (sortOption) {
    case "name":
      result = filtered.toSorted((a, b) => a.name.localeCompare(b.name));
      break;
    case "category":
      result = filtered.toSorted((a, b) => {
        const catA = a.categories[0] || "";
        const catB = b.categories[0] || "";
        return catA.localeCompare(catB);
      });
      break;
    default:
      result = filtered;
  }

  return result;
};

export const getPageConfig = (pathname: string): PageConfig => {
  switch (pathname) {
    case "/blocked":
      return {
        title: "Blocked Contacts",
        description: "Manage your blocked contacts",
        statusFilter: "blocked",
      };
    case "/bin":
      return {
        title: "Contacts in Bin",
        description: "Recover or permanently delete contacts",
        statusFilter: "bin",
      };
    default:
      return {
        title: "All Contacts",
        description: "Manage your contacts",
        statusFilter: "active",
      };
  }
};

export const createActivity = (
  action: string,
  contactName: string,
  actionType: string,
  timestamp: string
): UserActivity => {
  const newActivity: UserActivity = {
    action: action,
    contact_name: contactName,
    action_type: actionType,
    timestamp: timestamp,
  };

  return newActivity;
};
