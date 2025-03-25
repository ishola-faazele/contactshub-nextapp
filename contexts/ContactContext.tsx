"use client";
import { LinkedList } from "knust-compeng-dsa-linkedlist";
import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { ContactType, UserActivity, CategoryDistribution } from "@/types/types";
import { useApi } from "@/hooks/useApi";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { getDashboardData } from "@/lib/utils";
// Define context type
interface ContactContextType {
  contacts: LinkedList<ContactType>;
  userActivities: LinkedList<UserActivity>;
  setContacts: (contacts: LinkedList<ContactType>) => void;
  setUserActivities: (userActivities: LinkedList<UserActivity>) => void;
  activeContacts: LinkedList<ContactType>;
  categories: string[];
  favoriteContacts: LinkedList<ContactType>;
  recentContacts: LinkedList<ContactType>;
  dashboardData: {
    totalContacts: number;
    categoriesDistribution: CategoryDistribution[];
    recentActivity: LinkedList<UserActivity>;
  };
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
  const pathName = usePathname();
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

  // Filter active contacts using useMemo
  const activeContacts = useMemo(
    () => contacts.filter((c) => !c.status || c.status === "active"),
    [contacts]
  );
  // Extract unique categories from contacts
  const categories = useMemo(() => {
    const allCategories = contacts.flatMap((contact) => contact.categories);
    return [...new Set(allCategories)];
  }, [contacts]);

  // Update favoriteContacts when contacts change
  const favoriteContacts = useMemo(
    () => activeContacts.filter((contact) => contact.favorite),
    [activeContacts]
  );

  // Get recent contacts using useMemo
  const recentContacts = useMemo(
    () => activeContacts.toReversed().slice(0, 5),
    [activeContacts]
  );
  // Generate analytics data using useMemo
  const dashboardData = useMemo(() => {
    return getDashboardData(pathName, activeContacts, userActivities);
  }, [pathName,activeContacts, userActivities]);

  return (
    <ContactContext.Provider
      value={{
        contacts,
        userActivities,
        setContacts,
        setUserActivities,
        activeContacts,
        categories,
        favoriteContacts,
        recentContacts,
        dashboardData,
      }}
    >
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
