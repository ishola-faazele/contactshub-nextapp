import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ContactType, PageConfig, UserActivity } from "../types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate category distribution from contacts
 * Returns top 3 categories + "Other" category
 */
export const calculateCategoryDistribution = (contacts: ContactType[]) => {
  // Create a map to count occurrences of each category
  const categoryMap = new Map<string, number>();
  
  // Count each category occurrence
  contacts.forEach(contact => {
    if (Array.isArray(contact.categories)) {
      contact.categories.forEach(category => {
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
  const otherCount = sortedCategories.slice(3)
    .reduce((sum, item) => sum + item.count, 0);
  
  // Only add "Other" category if there are any
  const result = [...topCategories];
  if (otherCount > 0) {
    result.push({ category: "Other", count: otherCount });
  }
  
  return result;
};

/**
 * Get most recent activities
 */
export const getRecentActivities = (activities: UserActivity[], limit: number = 5) => {
  return [...activities]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
};

export const getDashboardData = (
  statusFilter: string,
  activeContacts: ContactType[],
  userActivities: UserActivity[]
) => {
  if (statusFilter !== "active") {
    return {
      totalContacts: 0,
      categoriesDistribution: [],
      recentActivity: [],
    };
  }

  return {
    totalContacts: activeContacts.length,
    categoriesDistribution: calculateCategoryDistribution(activeContacts),
    recentActivity: getRecentActivities(userActivities),
  };
};

export const getFilteredAndSortedContacts = (
  contacts: ContactType[],
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

  const sorted = [...filtered];
  switch (sortOption) {
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "category":
      sorted.sort((a, b) => {
        const catA = a.categories[0] || "";
        const catB = b.categories[0] || "";
        return catA.localeCompare(catB);
      });
      break;
  }

  return sorted;
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