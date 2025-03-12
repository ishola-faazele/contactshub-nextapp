"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import Link from "next/link";
import { signOut } from "next-auth/react";
import ContactCard from "@/components/ui/ContactCard"; // Make sure to adjust the import path

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { apiRequest, loading, error } = useApi();
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
    const data = await apiRequest("/api/contacts");
    if (data) {
      setContacts(data);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteContact = async (id) => {
    try {
      const result = await apiRequest(`/api/contacts/${id}`, { method: "DELETE" });
      // Update the contacts list locally without making another API call
      if (result !== null) {
        setContacts(contacts.filter(contact => contact.id !== id));
      }
    } catch (err) {
      console.error("Error deleting contact:", err);
    }
  };
  const handleEditContact = async (id) => {

  }

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchTerm.toLocaleLowerCase())
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
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Contactshub</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              Welcome, {session.user?.name || "User"}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </header>

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
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categories
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredContacts.map((contact) => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      onDelete={handleDeleteContact}
                      // onEdit = {handleEditContact}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // This should not be reached due to the redirect in useEffect,
  // but included for completeness
  return null;
}
