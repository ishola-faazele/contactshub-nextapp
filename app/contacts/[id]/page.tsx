"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useApi } from "@/hooks/useApi";
import Link from "next/link";
import { ContactType } from "@/types/types";

export default function ContactForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const { apiRequest, loading, error } = useApi();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    categories: [],
  });
  const [customCategory, setCustomCategory] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [formError, setFormError] = useState("");

  // Predefined categories
  const predefinedCategories = ["Work", "Family", "Friend", "Important"];

  useEffect(() => {
    if(status === "unauthenticated") router.push("/api/auth/signin");
    const contactId = params?.id;
    if (contactId && contactId !== "new") {
      setIsEdit(true);
      fetchContact(contactId);
    }
  }, [params]);

  const fetchContact = async (id) => {
    console.log("Auth status: ", status)
    const data: ContactType = await apiRequest(`/api/contacts/${id}`);
    if (data) {
      setFormData({
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        categories: data.categories || [],
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const toggleCategory = (category) => {
    setFormData({
      ...formData,
      categories: formData.categories.includes(category)
        ? formData.categories.filter((c) => c !== category)
        : [...formData.categories, category],
    });
  };

  const addCustomCategory = () => {
    if (customCategory.trim() && !formData.categories.includes(customCategory.trim())) {
      setFormData({
        ...formData,
        categories: [...formData.categories, customCategory.trim()],
      });
      setCustomCategory("");
    }
  };

  const removeCategory = (category) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter((c) => c !== category),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name || !formData.email) {
      setFormError("Name and email are required");
      return;
    }

    try {
      if (isEdit) {
        const contactId = params.id;
        await apiRequest(`/api/contacts/${contactId}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
      } else {
        await apiRequest("/api/contacts", {
          method: "POST",
          body: JSON.stringify(formData),
        });
      }
      router.push("/");
    } catch (err) {
      setFormError("Failed to save contact");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">
            {isEdit ? "Edit Contact" : "Add New Contact"}
          </h1>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Back to Contacts
          </Link>
        </div>

        {(error || formError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            {error || formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {predefinedCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      formData.categories.includes(category)
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-800"
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
                  className="flex-grow border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={addCustomCategory}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>

              {formData.categories.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Selected Categories:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.categories.map((category, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                      >
                        {category}
                        <button
                          type="button"
                          onClick={() => removeCategory(category)}
                          className="ml-2 text-indigo-600 hover:text-indigo-800"
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

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? "Saving..." : isEdit ? "Update Contact" : "Add Contact"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}