"use client";
import { AnimatePresence } from "framer-motion";
import { ContactType } from "@/types/types";
import ContactCard from "@components/ContactCard";

interface ContactListInterface {
  contacts: ContactType[];
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onChangeStatus: (id: string, status: string) => void;
  sectionName?: string;
}

const ContactList: React.FC<ContactListInterface> = ({
  contacts,
  onDelete,
  onToggleFavorite,
  onChangeStatus,
  sectionName,
}) => {
  if (!contacts.length) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-gray-500 dark:text-gray-400">
        <p className="text-lg">No contacts found</p>
        <p className="text-sm">Try adding a new contact or adjusting filters.</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {sectionName && (
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {sectionName}
        </h2>
      )}
      <div className="flex gap-2 flex-wrap">
        <AnimatePresence>
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
              onChangeStatus={onChangeStatus}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContactList;
