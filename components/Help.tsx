"use client";
import { useRef } from "react";

export default function Help({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const helpText = [
    "This is an advanced contact management application built using Next.js and Flask.",
    "You can add, edit, delete, favorite, bin, and block contacts effortlessly.",
    "The application utilizes a linked list for efficient data management at the frontend and PostgreSQL as the database.",
    "This project was developed as a requirement for the Data Structures & Algorithms (DSA) course.",
  ];

  const teamMembers = [
    "Edward Wiafe",
    "Gify Naa Teki",
    "Benjamin Appiah Boadu",
    "Louis Baffoe",
    "Ishola Faazele",
    "Edward Sackey",
    "Poku Brempong Osei",
    "Jason Serebour",
  ];

  return (
    isOpen && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm dark:bg-black/60"
        onClick={handleOverlayClick}
      >
        <div
          ref={modalRef}
          className="max-w-2xl w-full mx-4 md:mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-semibold">Help & Settings</h1>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl focus:outline-none"
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-3 border-b border-gray-200 dark:border-gray-700">
            {helpText.map((text, index) => (
              <p key={index} className="text-gray-700 dark:text-gray-300">
                {text}
              </p>
            ))}
          </div>

          {/* Team Members */}
          <div className="px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Team Members:
            </h2>
            <ul className="mt-2 space-y-1 text-gray-700 dark:text-gray-300">
              {teamMembers.map((member, index) => (
                <li key={index} className="pl-4 list-disc">
                  {member}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  );
}
