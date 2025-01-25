"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/components/context/UserContext";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && user && user.onboarding === false) {
      router.push("/getting-started");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user logged in.</div>;
  }

  return <>{children}</>;
}
