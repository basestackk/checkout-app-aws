"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {Spinner} from "@components/ui/spinner";

export default function Home() {
  const router = useRouter();

  useEffect(() => {

      router.push("/login"); // Redirect only after rendering has occurred

  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
    <Spinner size="sm" className="bg-black dark:bg-white" />
    <h1 className="text-xl font-semibold text-gray-700">
      Loading, please wait...
    </h1>
  </div>
  );
}
