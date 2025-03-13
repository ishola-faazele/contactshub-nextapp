"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import Link from "next/link";
// import { signOut } from "next-auth/react";// Make sure to adjust the import path
import { ContactType } from "@/types/types";
import Header from "./components/Header";
import ContactList from "./components/ContactList";
export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { apiRequest, loading, error } = useApi();
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");

  useEffect(() => {
    // If user is not authenticated and the auth check completed, redirect to signin
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }

    // If user is authenticated, fetch contacts
    if (status === "authenticated") {
      fetchContacts();
    }
  }, [status, router]);

  const fetchContacts = async () => {
    const data: ContactType[] | null = await apiRequest("/api/contacts");
    if (data) {
      setContacts(data);
    }
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteContact = async (id: string) => {
    try {
      const result = await apiRequest(`/api/contacts/${id}`, {
        method: "DELETE",
      });
      // Update the contacts list locally without making another API call
      if (result !== null) {
        setContacts(contacts.filter((contact) => contact.id !== id));
      }
    } catch (err) {
      console.error("Error deleting contact:", err);
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact?.phone?.toLowerCase().includes(searchTerm.toLocaleLowerCase())
  );

  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show authenticated content
  if (status === "authenticated") {
    return (
      <div className="container mx-auto px-4 py-8">
        {/*Header */}
        <Header
          userName={session?.user?.name}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search contacts..."
                className="w-full px-4 py-2 border rounded-md"
                value={searchTerm}
                onChange={handleSearch}
              />
              <svg
                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <Link
              href="/contacts/new"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Contact
            </Link>
          </div>

          {loading ? (
            <p className="text-center py-4">Loading contacts...</p>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No contacts found.</p>
              {contacts.length === 0 && (
                <p className="mt-2">
                  Get started by adding your first contact.
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <ContactList
                contacts={filteredContacts}
                onDelete={handleDeleteContact}
                viewMode={viewMode}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
