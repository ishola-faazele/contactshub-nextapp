"use client";

import { AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Trash2, Pencil } from "lucide-react";
import { ContactType } from "@/types/types";
import ContactCard from "./ContactCard";
interface ContactListInterface {
  contacts: ContactType[];
  onDelete: (id: string) => void;
  viewMode: string;
}
const ContactList: React.FC<ContactListInterface> = ({
  contacts,
  onDelete,
  viewMode = "list",
}) => {
  if (!contacts.length) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-gray-500 dark:text-gray-400">
        <p className="text-lg">No contacts found</p>
        <p className="text-sm">
          Try adding a new contact or adjusting filters.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid ${
        viewMode === "grid"
          ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          : "flex flex-col gap-4"
      }`}
    >
      {/* <AnimatePresence>
        {contacts.map((contact) => (
          <motion.div
            key={contact.id}
            className="relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4 flex flex-col gap-2 shadow-md hover:shadow-lg transition-shadow rounded-xl dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white text-lg font-semibold rounded-full">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {contact.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {contact.email}
                  </p>
                  {contact.phone && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {contact.phone}
                    </p>
                  )}
                </div>
              </div>

              {contact.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {contact.categories.map((category, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteContact(contact.id)}
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence> */}
      <AnimatePresence>
        {contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onDelete={onDelete}
            viewMode={viewMode}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ContactList;
