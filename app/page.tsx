"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import Link from "next/link";
import { ContactType } from "@/types/types";
import Header from "./components/Header";
import ContactList from "./components/ContactList";
import {
  Plus,
  UserPlus,
  Filter,
  LayoutGrid,
  List,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function HomePage() {
  // Session and routing
  const { data: session, status } = useSession();
  const router = useRouter();

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
  const [isDashboardVisible, setIsDashboardVisible] = useState(true);
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
      fetchAnalytics();
    }
  }, [status, router]);

  // Update favoriteContacts when contacts change
  useEffect(() => {
    const favoirites = contacts.filter((contact) => contact.favorite);
    setFavoriteContacts(favoirites);
  }, [contacts]);

  // Update recentContacts when contacts change
  useEffect(() => {
    setRecentContacts(contacts.slice(0, 5));
  }, [contacts]);

  // Fetch analytics when contacts change
  useEffect(() => {
    fetchAnalytics();
  }, [contacts]);

  // Fetch contacts from the API
  const fetchContacts = async () => {
    const data: ContactType[] | null = await apiRequest("/api/contacts");
    if (data) {
      setContacts(data);
      const recent = [...data].sort(() => 0.5 - Math.random()).slice(0, 5);
      setRecentContacts(recent);
    }
  };

  // Fetch mock analytics data
  const fetchAnalytics = async () => {
    setTimeout(() => {
      setAnalytics({
        totalContacts: contacts.length,
        categoriesDistribution: [
          { category: "Work", count: Math.floor(contacts.length * 0.4) },
          { category: "Family", count: Math.floor(contacts.length * 0.3) },
          { category: "Friend", count: Math.floor(contacts.length * 0.2) },
          { category: "Other", count: Math.floor(contacts.length * 0.1) },
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
        fetchAnalytics(); // Refresh analytics after deletion
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
              contact.favorite = !contact.favorite;
            }
            return contact;
          })
        );
        fetchAnalytics(); // Refresh analytics after deletion
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
              contact.status = newStatus;
            }
            return contact;
          })
        );
        console.log(contacts);
      }
    } catch (err) {
      console.error("Error deleting contact:", err);
    }
  };

  // Filter and sort contacts based on search term, filter category, and sort option
  const filteredAndSortedContacts = useMemo(() => {
    let filtered = contacts.filter(
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
        // Random sorting for demonstration
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
  }, [contacts, searchTerm, filterCategory, sortOption]);

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
        {/* Sidebar */}
        {/* <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 shadow-lg">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <Link href="/" className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                CH
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                ContactHub
              </h1>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/"
              className="flex items-center space-x-3 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
            >
              <Users size={20} />
              <span className="font-medium">Contacts</span>
            </Link>

            <Link
              href="/favorites"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <Star size={20} />
              <span>Favorites</span>
            </Link>

            <Link
              href="/analytics"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <BarChart2 size={20} />
              <span>Analytics</span>
            </Link>

            <Link
              href="/events"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <Calendar size={20} />
              <span>Events</span>
            </Link>

            <hr className="border-gray-200 dark:border-gray-700" />

            <Link
              href="/settings"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center font-medium">
                {session?.user?.name?.slice(0, 2)?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                  {session?.user?.email || "user@example.com"}
                </p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <Header
            userName={session?.user?.name}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <main className="flex-1 p-6">
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

            {/* Dashboard Section */}
            {isDashboardVisible && (
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

            {/* Favorites Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Favorites
              </h2>
              <ContactList
                contacts={favoriteContacts}
                // viewMode={viewMode}
                onDelete={handleDeleteContact}
                onToggleFavorite={handleToggleFavorite}
                // onSelect={handleContactSelect}
                onChangeStatus={handleChangeStatus}
              />
            </div>

            {/* Recent Contacts Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Recent Contacts
              </h2>
              <ContactList
                contacts={recentContacts}
                // viewMode={viewMode}
                onDelete={handleDeleteContact}
                onToggleFavorite={handleToggleFavorite}
                // onSelect={handleContactSelect}
                onChangeStatus={handleChangeStatus}
              />
            </div>

            {/* All Contacts Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                All Contacts
              </h2>
              <ContactList
                contacts={filteredAndSortedContacts}
                // viewMode={viewMode}
                onDelete={handleDeleteContact}
                onToggleFavorite={handleToggleFavorite}
                // onSelect={handleContactSelect}
                onChangeStatus={handleChangeStatus}
              />
            </div>
          </main>
        </div>
      </div>
    );
  }
}
