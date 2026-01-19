"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      try {
        const response = await fetch("/api/session", { cache: "no-store" });
        if (!response.ok) {
          router.replace("/login");
          return;
        }
        const data = (await response.json()) as { authenticated?: boolean };
        router.replace(data.authenticated ? "/dashboard" : "/login");
      } catch {
        router.replace("/login");
      }
    };
    redirect();
  }, [router]);

  return null;
}
