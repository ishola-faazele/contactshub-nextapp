"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import Link from "next/link";
import { ContactType } from "@/types/types";
import Header from "./components/Header";
import ContactList from "./components/ContactList";
import { Plus, UserPlus, Filter, LayoutGrid, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

// Page type interface to determine which content to display
interface PageConfig {
  title: string;
  description: string;
  showFavorites: boolean;
  showRecent: boolean;
  showDashboard: boolean;
  statusFilter: string | null;
}

export default function ContactsPage() {
  // Session and routing
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Determine page type based on pathname
  const getPageConfig = (): PageConfig => {
    switch (pathname) {
      case "/blocked":
        return {
          title: "Blocked Contacts",
          description: "Manage your blocked contacts",
          showFavorites: false,
          showRecent: false,
          showDashboard: false,
          statusFilter: "blocked",
        };
      case "/bin":
        return {
          title: "Contacts in Bin",
          description: "Recover or permanently delete contacts",
          showFavorites: false,
          showRecent: false,
          showDashboard: false,
          statusFilter: "bin",
        };
      default:
        return {
          title: "All Contacts",
          description: "Manage your contacts",
          showFavorites: true,
          showRecent: true,
          showDashboard: true,
          statusFilter: "active",
        };
    }
  };

  const pageConfig = getPageConfig();

  // API and state management
  const { apiRequest, loading, error } = useApi();
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [favoriteContacts, setFavoriteContacts] = useState<ContactType[]>([]);
  const [recentContacts, setRecentContacts] = useState<ContactType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [sortOption, setSortOption] = useState<"name" | "recent" | "category">(
    "name"
  );
  const [analytics, setAnalytics] = useState({
    totalContacts: 0,
    categoriesDistribution: [] as { category: string; count: number }[],
    recentActivity: [] as { action: string; contact: string; date: string }[],
  });
  const [selectedContact, setSelectedContact] = useState<ContactType | null>(
    null
  );

  // Extract unique categories from contacts
  const categories = useMemo(() => {
    const allCategories = contacts.flatMap((contact) => contact.categories);
    return [...new Set(allCategories)];
  }, [contacts]);

  // Fetch contacts and analytics when authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }

    if (status === "authenticated") {
      fetchContacts();
    }
  }, [status, router, pathname]);

  // Update favoriteContacts when contacts change
  useEffect(() => {
    const favorites = contacts.filter(
      (contact) =>
        contact.favorite && (!contact.status || contact.status === "active")
    );
    setFavoriteContacts(favorites);
  }, [contacts]);

  // Update recentContacts when contacts change
  useEffect(() => {
    // Only get recent contacts from active contacts
    const activeContacts = contacts.filter(
      (c) => !c.status || c.status === "active"
    );
    setRecentContacts(activeContacts.slice(0, 5));
  }, [contacts]);

  // Fetch analytics when contacts change
  useEffect(() => {
    if (pageConfig.showDashboard) {
      fetchAnalytics();
    }
  }, [contacts, pageConfig.showDashboard]);

  // Fetch contacts from the API
  const fetchContacts = async () => {
    const data: ContactType[] | null = await apiRequest("/api/contacts");
    if (data) {
      setContacts(data);
    }
  };

  // Fetch mock analytics data
  const fetchAnalytics = async () => {
    // Only count active contacts for analytics
    const activeContacts = contacts.filter(
      (c) => !c.status || c.status === "active"
    );

    setTimeout(() => {
      setAnalytics({
        totalContacts: activeContacts.length,
        categoriesDistribution: [
          { category: "Work", count: Math.floor(activeContacts.length * 0.4) },
          {
            category: "Family",
            count: Math.floor(activeContacts.length * 0.3),
          },
          {
            category: "Friend",
            count: Math.floor(activeContacts.length * 0.2),
          },
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
      });
    }, 1000);
  };

  // Delete a contact
  const handleDeleteContact = async (id: string) => {
    try {
      const result = await apiRequest(`/api/contacts/${id}`, {
        method: "DELETE",
      });
      if (result !== null) {
        setContacts(contacts.filter((contact) => contact.id !== id));
        if (pageConfig.showDashboard) {
          fetchAnalytics(); // Refresh analytics after deletion
        }
      }
    } catch (err) {
      console.error("Error deleting contact:", err);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      const result = await apiRequest(`/api/contacts/${id}/toggle-favorite`, {
        method: "PATCH",
      });
      if (result !== null) {
        setContacts(
          contacts.map((contact) => {
            if (contact.id === id) {
              return { ...contact, favorite: !contact.favorite };
            }
            return contact;
          })
        );
      }
    } catch (err) {
      console.error("Error Toggling Favorites:", err);
    }
  };

  const handleContactSelect = (contact: ContactType) => {
    setSelectedContact(contact);
  };

  const handleChangeStatus = async (id: string, newStatus: string) => {
    const route: string = `/api/contacts/${id}/set-status`;

    try {
      const result = await apiRequest(route, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      if (result) {
        setContacts(
          contacts.map((contact) => {
            if (contact.id === id) {
              return { ...contact, status: newStatus };
            }
            return contact;
          })
        );
      }
    } catch (err) {
      console.error("Error changing contact status:", err);
    }
  };

  // Filter and sort contacts based on search term, filter category, sort option, and status
  const filteredAndSortedContacts = useMemo(() => {
    // First filter by status according to page type
    let filtered = contacts.filter((contact) => {
      if (pageConfig.statusFilter === "active") {
        return !contact.status || contact.status === "active";
      }
      return contact.status === pageConfig.statusFilter;
    });

    // Then apply search filters
    filtered = filtered.filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact?.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterCategory) {
      filtered = filtered.filter((contact) =>
        contact.categories.includes(filterCategory)
      );
    }

    switch (sortOption) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "recent":
        // In a real app, you'd sort by creation/update date
        filtered.sort(() => 0.5 - Math.random());
        break;
      case "category":
        filtered.sort((a, b) => {
          if (a.categories[0] && b.categories[0]) {
            return a.categories[0].localeCompare(b.categories[0]);
          }
          return 0;
        });
        break;
    }

    return filtered;
  }, [
    contacts,
    searchTerm,
    filterCategory,
    sortOption,
    pageConfig.statusFilter,
  ]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading ContactHub...
          </p>
        </div>
      </div>
    );
  }

  // Authenticated state
  if (status === "authenticated") {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <Header
            userName={session?.user?.name}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <main className="flex-1 p-6">
            {/* Page Title */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {pageConfig.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {pageConfig.description}
              </p>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div className="flex items-center gap-2">
                <Link
                  href="/contacts/new"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                >
                  <UserPlus size={18} />
                  <span>Add Contact</span>
                </Link>
              </div>

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
                                      filterCategory === category
                                        ? null
                                        : category
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
                            <button
                              onClick={() => setSortOption("name")}
                              className={`w-full text-left p-2 rounded-md ${
                                sortOption === "name"
                                  ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                              }`}
                            >
                              Name
                            </button>
                            <button
                              onClick={() => setSortOption("recent")}
                              className={`w-full text-left p-2 rounded-md ${
                                sortOption === "recent"
                                  ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                              }`}
                            >
                              Recently Added
                            </button>
                            <button
                              onClick={() => setSortOption("category")}
                              className={`w-full text-left p-2 rounded-md ${
                                sortOption === "category"
                                  ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                              }`}
                            >
                              Category
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Dashboard Section - Only show on active contacts page */}
            {pageConfig.showDashboard && (
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
                          {activity.action === "Updated" && (
                            <UserPlus size={16} />
                          )}
                          {activity.action === "Deleted" && (
                            <UserPlus size={16} />
                          )}
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
            )}

            {/* Favorites Section - Only show on active contacts page */}
            {pageConfig.showFavorites && favoriteContacts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Favorites
                </h2>
                <ContactList
                  contacts={favoriteContacts}
                  onDelete={handleDeleteContact}
                  onToggleFavorite={handleToggleFavorite}
                  onChangeStatus={handleChangeStatus}
                />
              </div>
            )}

            {/* Recent Contacts Section - Only show on active contacts page */}
            {pageConfig.showRecent && recentContacts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Contacts
                </h2>
                <ContactList
                  contacts={recentContacts}
                  onDelete={handleDeleteContact}
                  onToggleFavorite={handleToggleFavorite}
                  onChangeStatus={handleChangeStatus}
                />
              </div>
            )}

            {/* Main Contacts Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {pageConfig.statusFilter === "blocked"
                  ? "Blocked Contacts"
                  : pageConfig.statusFilter === "bin"
                  ? "Contacts in Bin"
                  : "All Contacts"}
              </h2>

              {filteredAndSortedContacts.length > 0 ? (
                <ContactList
                  contacts={filteredAndSortedContacts}
                  onDelete={handleDeleteContact}
                  onToggleFavorite={handleToggleFavorite}
                  onChangeStatus={handleChangeStatus}
                />
              ) : (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    {pageConfig.statusFilter === "blocked"
                      ? "No blocked contacts found."
                      : pageConfig.statusFilter === "bin"
                      ? "No contacts in bin."
                      : "No contacts found."}
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Default return (should not reach here)
  return null;
}
