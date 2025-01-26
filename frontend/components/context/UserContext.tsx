"use client";

import type React from "react";
import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { getLoggedInUser } from "@/actions/auth";

type UserType = {
  ph_no: string | null;
  post: string | null;
  department: string | null;
  Des_position: string | null;
  email: string;
  username: string;
  userId: string;
  onboarding: boolean;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $databaseId: string;
  $collectionId: string;
};

type UserContextType = {
  user: UserType | null;
  loading: boolean;
  error: string | null;
  refetchUser: () => void;
  setUserNull: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// Export the provider component
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    console.log("Starting to fetch user data...");
    try {
      setLoading(true);
      const userData = await getLoggedInUser();
      console.log("Received user data:", userData);
      
      if (userData) {
        setUser(userData);
        console.log("User data set successfully");
      } else {
        setUser(null);
        console.log("No user data received");
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      setError("Failed to fetch user data");
      setUser(null);
    } finally {
      setLoading(false);
      console.log("Finished loading user data");
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Add a debug log for render
  console.log("UserContext State:", { user, loading, error });

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        refetchUser: fetchUser,
        setUserNull: () => {
          setLoading(true);
          setUser(null);
          setLoading(false);
        },
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Export the hook
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
