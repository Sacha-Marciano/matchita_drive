"use client";

// ─── Framework & Core Imports ───────────────────────────────
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Auth / Session ─────────────────────────────────────────
import { useSession } from "next-auth/react";

// ─── Components ─────────────────────────────────────────────
import NotificationBell from "../NotificationBell";

// ─── UI & Layout ────────────────────────────────────────────

// ─── Types ──────────────────────────────────────────────────
import { IUser } from "@/app/types";

// ─── Utils / Services / Constants ───────────────────────────

// ─── Prop Types ─────────────────────────────────────────────

// ─── Component ──────────────────────────────────────────────
export default function Header() {
  // ─── Hooks ───────────────────────────────────────────────
  const { data: session, status } = useSession();
  const router = useRouter();

  // ─── State ───────────────────────────────────────────────
  const [user, setUser] = useState<IUser | null>(null);

  // ─── Derived Values ──────────────────────────────────────
  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // ─── Effects ─────────────────────────────────────────────
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      const userRes = await fetch("/api/users");
      const userData = await userRes.json();
      setUser(userData.data);
    };

    fetchUser();
  }, [session, status]);

  // ─── Handlers ────────────────────────────────────────────

  // ─── Render ──────────────────────────────────────────────
  return (
    <div className="relative w-full flex items-center justify-center h-[10vh] bg-transparent">
      {/* Logo redirect to home */}
      <Link href={"/"}>
        <Image
          src={"/brand/logo-transparent.png"}
          alt="paul Logo"
          height={125}
          width={150}
        />
      </Link>

      {/* Top right controls: notifications and profile */}
      <div className="flex items-center gap-4 absolute right-4 md:right-8 lg:right-10 top-6">
        {/* Notification bell if user is fetched */}
        {user && <NotificationBell notifications={user.notifications} />}

        {/* User initials badge linking to profile */}
        {initials && (
          <Link href={"/profile"}>
            <div className="bg-paul-300 p-2 flex items-center justify-center text-paul-900 rounded-xl cursor-pointer font-semibold text-xs md:text-base lg:text-lg">
              {initials}
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
