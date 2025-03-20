"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { ContactType } from "@/types/types";
import {
  getPageConfig,
  getAnalytics,
  getFilteredAndSortedContacts,
} from "@/lib/utils";
import Header from "../components/Header";
import ContactList from "../components/ContactList";
import ActionBar from "@/components/ActionBar";
import Dashboard from "@/components/Dashboard";

export default function ContactsPage() {
  // Session and routing
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // API and state management
  const { apiRequest, error } = useApi();
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<"name" | "recent" | "category">(
    "name"
  );

  // Fetch contacts and analytics when authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    if (status === "authenticated") {
      // Fetch contacts from the API
      const fetchContacts = async () => {
        const data: ContactType[] | null = await apiRequest("/api/contacts");
        if (data) {
          setContacts(data);
        } else if (error) {
          console.error("Error fetching contacts:", error);
        }
      };
      fetchContacts();
    }
  }, [status, router, pathname, apiRequest, error]); // update the dependency array

  // Determine page type based on pathname
  const pageConfig = useMemo(() => {
    return getPageConfig(pathname);
  }, [pathname]);

  // Extract unique categories from contacts
  const categories = useMemo(() => {
    const allCategories = contacts.flatMap((contact) => contact.categories);
    return [...new Set(allCategories)];
  }, [contacts]);

  // Filter and sort contacts based on search term, filter category, sort option, and status
  const filteredAndSortedContacts = useMemo(() => {
    return getFilteredAndSortedContacts(
      contacts,
      pageConfig.statusFilter,
      searchTerm,
      filterCategory,
      sortOption
    );
  }, [
    contacts,
    pageConfig.statusFilter,
    searchTerm,
    filterCategory,
    sortOption,
  ]);

  // Filter active contacts using useMemo
  const activeContacts = useMemo(
    () => contacts.filter((c) => !c.status || c.status === "active"),
    [contacts]
  );

  // Update favoriteContacts when contacts change
  const favoriteContacts = useMemo(
    () => activeContacts.filter((contact) => contact.favorite),
    [activeContacts]
  );

  // Get recent contacts using useMemo
  const recentContacts = useMemo(
    () => activeContacts.slice(0, 5),
    [activeContacts]
  );

  // Generate analytics data using useMemo
  const analytics = useMemo(() => {
    return getAnalytics(pageConfig.statusFilter, activeContacts);
  }, [pageConfig.statusFilter, activeContacts]);

  // Delete a contact
  const handleDeleteContact = async (id: string) => {
    try {
      const result = await apiRequest(`/api/contacts/${id}`, {
        method: "DELETE",
      });
      if (result !== null) {
        setContacts(contacts.filter((contact) => contact.id !== id));
      }
    } catch (err) {
      console.error("Error deleting contact:", err);
    }
  };
  // Toggle favorite
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
  // Change status
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

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading ContactsHub...
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

            {/* Dashboard Section - Only show on active contacts page */}
            {pageConfig.statusFilter === "active" && (
              <Dashboard analytics={analytics} />
            )}

            {/* Favorites Section - Only show on active contacts page */}
            {pageConfig.statusFilter === "active" &&
              favoriteContacts.length > 0 && (
                <div className="mb-8">
                  <ContactList
                    sectionName="Favorite Contacts"
                    contacts={favoriteContacts}
                    onDelete={handleDeleteContact}
                    onToggleFavorite={handleToggleFavorite}
                    onChangeStatus={handleChangeStatus}
                  />
                </div>
              )}

            {/* Recent Contacts Section - Only show on active contacts page */}
            {pageConfig.statusFilter === "active" &&
              recentContacts.length > 0 && (
                <div className="mb-8">
                  <ContactList
                    sectionName="Recently Added Contacts"
                    contacts={recentContacts}
                    onDelete={handleDeleteContact}
                    onToggleFavorite={handleToggleFavorite}
                    onChangeStatus={handleChangeStatus}
                  />
                </div>
              )}

            {/* Main Contacts Section */}
            <div>
              {/* Actions Bar */}
              <ActionBar
                viewMode={viewMode}
                setViewMode={setViewMode}
                categories={categories}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                sortOption={sortOption}
                setSortOption={setSortOption}
              />
              {filteredAndSortedContacts.length > 0 ? (
                <ContactList
                  sectionName={
                    pageConfig.statusFilter === "blocked"
                      ? "Blocked Contacts"
                      : pageConfig.statusFilter === "bin"
                      ? "Contacts in Bin"
                      : "All Contacts"
                  }
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
