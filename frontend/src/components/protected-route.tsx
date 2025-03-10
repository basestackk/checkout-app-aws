"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth(); // Access user from AuthContext
  const router = useRouter();

  useEffect(() => {
    // If no user is logged in, redirect to the login page
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Show children only if user is authenticated
  return user ? <>{children}</> : null;
}
