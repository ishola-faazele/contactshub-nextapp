// hooks/useApi.ts
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export function useApi() {
  const { accessToken, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T | null> => {
    if (!accessToken) {
      setError("Not authenticated");
      return null;
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL!}${endpoint}`;

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle 401 Unauthorized
        if (response.status === 401) {
          logout();
          setError("Session expired. Please log in again.");
          return null;
        }

        throw new Error(data.error || "API request failed");
      }

      return data as T;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    apiRequest,
    loading,
    error,
  };
}
