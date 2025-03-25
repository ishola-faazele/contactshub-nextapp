"use client";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  getPageConfig,
  getFilteredAndSortedContacts,
  createActivity,
} from "@/lib/utils";
import Header from "../components/Header";
import ContactList from "../components/ContactList";
import ActionBar from "@/components/ActionBar";
import Dashboard from "@/components/Dashboard";
import AddContact from "@/components/AddContact";
import { useContact } from "@/contexts/ContactContext";
import { useApi } from "@/hooks/useApi";
import { UserActivity } from "@/types/types";
import { LinkedList } from "knust-compeng-dsa-linkedlist";
import LoadingComponent from "@/components/LoadingComponent";

export default function ContactsPage() {
  // Session and routing
  const { data: session, status } = useSession();
  const { apiRequest } = useApi();
  const pathname = usePathname();

  // API and state management
  const {
    contacts,
    userActivities,
    setContacts,
    setUserActivities,
    categories,
    favoriteContacts,
    recentContacts,
  } = useContact();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<"name" | "recent" | "category">(
    "name"
  );

  // Determine page type based on pathname
  const pageConfig = useMemo(() => {
    return getPageConfig(pathname);
  }, [pathname]);

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

  // Delete a contact
  const handleDeleteContact = async (id: string) => {
    try {
      const contactToDelete = contacts.find((contact) => contact.id === id);
      const result = await apiRequest(`/api/contacts/${id}`, {
        method: "DELETE",
      });
      if (result !== null) {
        setContacts(contacts.filter((contact) => contact.id !== id));
        const newActivity: UserActivity = createActivity(
          "deleted",
          contactToDelete?.name || "",
          "",
          new Date().toISOString()
        );
        setUserActivities(userActivities.concat(new LinkedList(newActivity)));
      }
    } catch (err) {
      console.error("Error deleting contact:", err);
    }
  };
  // Toggle favorite
  const handleToggleFavorite = async (id: string) => {
    try {
      const contactToUpdate = contacts.find((contact) => contact.id === id);
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
        const newActivity: UserActivity = createActivity(
          "toggle_favorite",
          contactToUpdate?.name || "",
          contactToUpdate?.favorite ? "not favorite" : "favorite",
          new Date().toISOString()
        );
        setUserActivities(userActivities.concat(new LinkedList(newActivity)));
      }
    } catch (err) {
      console.error("Error Toggling Favorites:", err);
    }
  };
  // Change status
  const handleChangeStatus = async (id: string, newStatus: string) => {
    const route: string = `/api/contacts/${id}/set-status`;
    const contactToUpdate = contacts.find((contact) => contact.id === id);
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
        const newActivity: UserActivity = createActivity(
          "set_status",
          contactToUpdate?.name || "",
          newStatus,
          new Date().toISOString()
        );
        setUserActivities(userActivities.concat(new LinkedList(newActivity)));
      }
    } catch (err) {
      console.error("Error changing contact status:", err);
    }
  };

  // Loading state
  if (status === "loading") {
    return <LoadingComponent />;
  }

  // Authenticated state
  else if (status === "authenticated") {
    return (
      <>
        <div className="relative flex min-h-screen bg-gray-50 dark:bg-gray-900">
          <div
            data-tooltip-target="tooltip-add-contact"
            className="fixed bottom-8 right-8 z-50"
          >
            <AddContact />
          </div>
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
              {pageConfig.statusFilter === "active" && <Dashboard />}

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
      </>
    );
  }

  return null;
}
