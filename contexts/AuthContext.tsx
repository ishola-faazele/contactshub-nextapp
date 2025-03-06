// contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

type AuthContextType = {
  isAuthenticated: boolean;
  user: any;
  accessToken: string | null;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  accessToken: null,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const logout = async () => {
    // Call your backend to invalidate token if needed
    if (session?.accessToken) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/logout`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
      } catch (error) {
        console.error("Error logging out from backend:", error);
      }
    }
    
    await signOut({ redirect: false });
    router.push("/auth/signin");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: status === "authenticated",
        user: session?.user || null,
        accessToken: session?.accessToken as string || null,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);