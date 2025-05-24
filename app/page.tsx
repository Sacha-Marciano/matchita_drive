"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "./components/Loading";

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect to login page if no session
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
    }
  }, [session, status]);

  // Shows loading animation
  if (status === "loading")
    return (
      <div className="h-[90vh] w-[100vw] flex items-center justify-center font-bold text-4xl ">
        <Loading message="Loading Rooms" />
      </div>
    );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Welcome, {session?.user?.name}</h1>
      </div>
    </div>
  );
}
