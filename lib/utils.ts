import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { ContactType, PageConfig } from "../types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAnalytics = (
  statusFilter: string,
  activeContacts: ContactType[]
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
    categoriesDistribution: [
      { category: "Work", count: Math.floor(activeContacts.length * 0.4) },
      { category: "Family", count: Math.floor(activeContacts.length * 0.3) },
      { category: "Friend", count: Math.floor(activeContacts.length * 0.2) },
      { category: "Other", count: Math.floor(activeContacts.length * 0.1) },
    ],
    recentActivity: [
      {
        action: "Added",
        contact: "John Doe",
        date: format(new Date(), "MMM dd, yyyy"),
      },
      {
        action: "Updated",
        contact: "Jane Smith",
        date: format(new Date(Date.now() - 86400000), "MMM dd, yyyy"),
      },
      {
        action: "Deleted",
        contact: "Robert Johnson",
        date: format(new Date(Date.now() - 172800000), "MMM dd, yyyy"),
      },
    ],
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
