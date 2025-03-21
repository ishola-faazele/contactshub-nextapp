"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { ContactType, UserActivity } from "@/types/types";
import { createActivity } from "@/lib/utils";
export default function ContactForm({
  isOpen,
  onClose,
  contactId,
  contacts,
  setContacts,
  userActivities,
  setUserActivities,
}: {
  isOpen: boolean;
  onClose: () => void;
  contactId: string;
  contacts: ContactType[];
  setContacts: (contacts: ContactType[]) => void;
  userActivities: UserActivity[];
  setUserActivities: (userActivities: UserActivity[]) => void;
}) {
  const router = useRouter();
  const { apiRequest, loading, error } = useApi();
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<Partial<ContactType>>({
    name: "",
    email: "",
    phone: "",
    categories: [] as string[],
  });
  const [customCategory, setCustomCategory] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [formError, setFormError] = useState("");

  // Predefined categories
  const predefinedCategories = ["Work", "Family", "Friend", "Important"];

  useEffect(() => {
    const fetchContact = async (id: string) => {
      const data: ContactType | null = await apiRequest(`/api/contacts/${id}`);
      if (data) {
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          categories: Array.isArray(data.categories) ? data.categories : [], // Ensure it's an array
        });
      }
    };
    if (contactId && contactId !== "new") {
      setIsEdit(true);
      fetchContact(contactId as string);
    }

    // Add event listener for escape key
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscKey);

    return () => window.removeEventListener("keydown", handleEscKey);
  }, [contactId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const toggleCategory = (category: string) => {
    const currentCategories = Array.isArray(formData.categories)
      ? formData.categories
      : [];

    setFormData({
      ...formData,
      categories: currentCategories.includes(category)
        ? currentCategories.filter((c) => c !== category)
        : [...currentCategories, category],
    });
  };

  const addCustomCategory = () => {
    const currentCategories = Array.isArray(formData.categories)
      ? formData.categories
      : [];

    if (
      customCategory.trim() &&
      !currentCategories.includes(customCategory.trim())
    ) {
      setFormData({
        ...formData,
        categories: [...currentCategories, customCategory.trim()],
      });
      setCustomCategory("");
    }
  };

  const removeCategory = (category: string) => {
    // Fix for line 227 error - ensure categories is treated as string[]
    const currentCategories = Array.isArray(formData.categories)
      ? formData.categories
      : [];

    setFormData({
      ...formData,
      categories: currentCategories.filter((c) => c !== category),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name || !formData.email) {
      setFormError("Name and email are required");
      return;
    }

    try {
      if (isEdit) {
        const result = await apiRequest(`/api/contacts/${contactId}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
        if (result) {
          setContacts(
            contacts.map((contact) => {
              console.log(contact);
              if (contact.id === contactId) {
                return { ...contact, ...formData, id: contactId };
              }
              return contact;
            })
          );
          const newActivity: UserActivity = createActivity(
            "updated",
            formData.name || "",
            "",
            new Date().toISOString()
          );
          setUserActivities([...userActivities, newActivity]);
        }
      } else {
        const result = await apiRequest("/api/contacts", {
          method: "POST",
          body: JSON.stringify(formData),
        });
        if (result) {
          console.log(result);
          console.log(formData);
          setContacts([...contacts, result as ContactType]);
          const newActivity: UserActivity = createActivity(
            "added",
            formData.name || "",
            "",
            new Date().toISOString()
          );
          setUserActivities([...userActivities, newActivity]);
        }
      }
      setFormData({ name: "", email: "", phone: "", categories: [] });
      onClose(); // Close the modal after successful submission
      router.refresh(); // Refresh the page to show new/updated contact
    } catch (err) {
      setFormError(`Failed to save contact ${err}`);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const categories = Array.isArray(formData.categories)
    ? formData.categories
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm dark:bg-black/60"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="max-w-2xl w-full mx-4 md:mx-auto rounded-lg shadow-lg"
      >
        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold">
              {isEdit ? "Edit Contact" : "Add New Contact"}
            </h1>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl focus:outline-none"
            >
              &times;
            </button>
          </div>

          {(error || formError) && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 mx-6 mt-4 rounded relative">
              {error || formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {predefinedCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        categories.includes(category)
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="flex">
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Add custom category"
                    className="flex-grow bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={addCustomCategory}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>

                {categories.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Selected Categories:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-100 px-3 py-1 rounded-full text-sm"
                        >
                          {category}
                          <button
                            type="button"
                            onClick={() => removeCategory(category)}
                            className="ml-2 text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-white"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-700 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-1/2 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : isEdit
                  ? "Update Contact"
                  : "Add Contact"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
