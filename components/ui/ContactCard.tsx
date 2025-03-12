"use client";

import { useState } from "react";
import Link from "next/link";
// ContactCard component to display each contact and handle the modal
const ContactCard = ({ contact, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  return (
    <>
      {/* Contact Row that opens modal when clicked */}
      <tr key={contact.id} onClick={openModal} className="hover:bg-gray-50 cursor-pointer">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{contact.name}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-500">{contact.email}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-500">{contact.phone || "-"}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex flex-wrap gap-1">
            {contact.categories && contact.categories.length > 0 ? (
              contact.categories.map((category, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800"
                >
                  {category}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-400">-</span>
            )}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
          <Link
            href={`/contacts/${contact.id}`}
            className="text-indigo-600 hover:text-indigo-900 mr-4"
          >
            Edit
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(contact.id);
              // handleDeleteContact(contact.id, e);
            }}
            className="text-red-600 hover:text-red-900 cursor-pointer"
          >
            Delete
          </button>
        </td>
      </tr>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Contact Details</h2>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{contact.name}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(contact.name, "Name")}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm hover:bg-indigo-200"
                >
                  Copy
                </button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{contact.email}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(contact.email, "Email")}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm hover:bg-indigo-200"
                >
                  Copy
                </button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{contact.phone || "-"}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(contact.phone || "", "Phone")}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm hover:bg-indigo-200"
                >
                  Copy
                </button>
              </div>
              
              {contact.categories && contact.categories.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Categories</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {contact.categories.map((category, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div> */}
          </div>
        </div>
      )}
    </>
  );
};

export default ContactCard;