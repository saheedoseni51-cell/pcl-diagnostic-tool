import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

export function useAdminAuth() {
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    // Try to load from localStorage
    if (typeof window !== "undefined") {
      return localStorage.getItem("adminToken");
    }
    return null;
  });

  const [adminUser, setAdminUser] = useState<{
    id: string;
    username: string;
    isFirstLogin: boolean;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const verifyQuery = trpc.adminAuth.getMe.useQuery(
    { token: adminToken || "" },
    {
      enabled: !!adminToken,
      retry: false,
    }
  );

  useEffect(() => {
    if (adminToken) {
      // Verify token is still valid
      if (verifyQuery.data) {
        setAdminUser(verifyQuery.data);
        setError(null);
      } else if (verifyQuery.error) {
        // Token is invalid
        setAdminToken(null);
        localStorage.removeItem("adminToken");
        setAdminUser(null);
        setError("Session expired. Please log in again.");
      }
    }
    setIsLoading(verifyQuery.isLoading);
  }, [verifyQuery.data, verifyQuery.error, verifyQuery.isLoading, adminToken]);

  const login = (token: string) => {
    setAdminToken(token);
    localStorage.setItem("adminToken", token);
  };

  const logout = () => {
    setAdminToken(null);
    localStorage.removeItem("adminToken");
    setAdminUser(null);
  };

  const updateToken = (newToken: string) => {
    setAdminToken(newToken);
    localStorage.setItem("adminToken", newToken);
  };

  return {
    adminToken,
    adminUser,
    isAuthenticated: !!adminToken && !!adminUser,
    isLoading,
    error,
    login,
    logout,
    updateToken,
  };
}
