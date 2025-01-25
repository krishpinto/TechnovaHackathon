"use client";

import React, {
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

const setUserNull = (
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setLoading(true);
    setUser(null);
    setLoading(false);
  } catch (error) {
    console.error("Error setting user to null:", error);
  }
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const userData = await getLoggedInUser();
      if (userData) {
        setUser(userData);
        console.log("Global state set to:", userData);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      setError("Failed to fetch user data");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const refetchUser = useCallback(() => {
    fetchUser();
  }, [fetchUser]);

  const contextSetUserNull = useCallback(() => {
    setUserNull(setUser, setLoading);
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        refetchUser,
        setUserNull: contextSetUserNull,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
