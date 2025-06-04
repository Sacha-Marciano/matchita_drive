"use client";

// ─── Framework Imports ───────────────────────────────────────
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ─── Auth ────────────────────────────────────────────────────
import { useSession, signOut } from "next-auth/react";

// ─── Components ──────────────────────────────────────────────
import Loading from "@/app/components/layout/Loading";
import Button from "@/app/components/shared/ui/Button";

// ─── Types ───────────────────────────────────────────────────
import { IUser } from "@/app/database/models/users";
import InfoRow from "../components/shared/ui/InfoRow";

// ─────────────────────────────────────────────────────────────

export default function ProfilePage() {
  // ─── Hooks ────────────────────────────────────────────────
  const router = useRouter();
  const { data: session, status } = useSession();

  // ─── State ────────────────────────────────────────────────
  const [user, setUser] = useState<IUser | null>(null);
  const [docHandled, setDocHandled] = useState<string>("");

  // ─── Derived Values ───────────────────────────────────────
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // ─── Effects ──────────────────────────────────────────────
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUser(data.data);
    };

    const fetchDocHandled = async () => {
      const res = await fetch("/api/doch");
      const data = await res.json();
      setDocHandled(data.data.docHandled);
    };

    fetchUser();
    fetchDocHandled();
  }, [session, status]);

  // ─── Early Return ─────────────────────────────────────────
  if (status === "loading" || !user) {
    return (
      <div className="h-[90vh] w-[100vw] flex items-center justify-center">
        <Loading message="Loading Profile" />
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────
  return (
    <div className="h-[85vh] flex flex-col lg:items-center relative mb-14">
      <div className="px-6 py-2 lg:px-0 lg:w-[488px] lg:mt-14">
        {/* Header / Avatar */}
        <div className="flex gap-4 items-center mb-8 lg:flex-col">
          <div className="w-16 h-16 lg:h-20 lg:w-20 p-3 rounded-3xl bg-[#DAE2E980] text-surf-blue flex items-center justify-center font-bold text-[26px] lg:text-[32.5px]">
            {initials}
            {/* <img src={user.image || "/default-profile.png"} className="rounded-xl" /> */}
          </div>
          <p className="text-2xl lg:text-[28px] font-bold">{user.name}</p>
        </div>

        {/* User Info */}
        <div className="flex flex-col gap-6 border border-white bg-bg-alt text-matchita-900 rounded-xl p-2 lg:p-4">
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Rooms" value={user.roomIds.length} />
          <InfoRow label="Docs handled" value={docHandled} />
          <InfoRow label="Plan" value="Pro" />
        </div>

        {/* Actions */}
        <Button
          size="sm"
          variant="secondary"
          onClick={() => signOut()}
          className="mt-4"
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}
