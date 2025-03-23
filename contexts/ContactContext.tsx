"use client";
import { LinkedList } from "knust-compeng-dsa-linkedlist";
import { createContext, useContext, useEffect, useState } from "react";
import { ContactType, UserActivity } from "@/types/types";
import { useApi } from "@/hooks/useApi";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// Define context type
interface ContactContextType {
  contacts: LinkedList<ContactType>;
  userActivities: LinkedList<UserActivity>;
}

// Create context
const ContactContext = createContext<ContactContextType | undefined>(undefined);

// Provider component
export const ContactProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { apiRequest, error } = useApi();
  const [fetchedContacts, setFetechedContacts] = useState<ContactType[]>([]);
  const [contacts, setContacts] = useState(new LinkedList<ContactType>());
  const [fetchedUserActivities, setFetchedUserActivities] = useState<
    UserActivity[]
  >([]);
  const [userActivities, setUserActivities] = useState(
    new LinkedList<UserActivity>()
  );
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    if (status === "authenticated") {
      // Fetch contacts from the API
      const fetchContacts = async () => {
        const data: ContactType[] | null = await apiRequest("/api/contacts");
        if (data) {
          setFetechedContacts(data);
        } else if (error) {
          console.error("Error fetching contacts:", error);
        }
      };
      const fetchUserActivities = async () => {
        const data: UserActivity[] | null = await apiRequest(
          "/api/user-activities"
        );
        if (data) {
          setFetchedUserActivities(data);
        } else if (error) {
          console.error("Error fetching user activites:", error);
        }
      };

      fetchContacts();
      fetchUserActivities();
    }
  }, [status]);

  // Convert contacts array to LinkedList when contacts change
  useEffect(() => {
    const list = new LinkedList<ContactType>();
    fetchedContacts.forEach((contact) => list.push(contact));
    setContacts(list);
  }, [fetchedContacts]);

  useEffect(() => {
    const list = new LinkedList<UserActivity>();
    fetchedUserActivities.forEach((userActivity) => list.push(userActivity));
    setUserActivities(list);
  }, [fetchedUserActivities]);

  return (
    <ContactContext.Provider value={{ contacts, userActivities }}>
      {children}
    </ContactContext.Provider>
  );
};

// Custom hook to use the context
export const useContact = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error("useContact must be used within a ContactProvider");
  }
  return context;
};
