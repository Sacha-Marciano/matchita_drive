"use client";

import { IUser } from "@/app/types";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import NotificationBell from "../NotificationBell";

const Header = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [user, setUser] = useState<IUser | null>(null);

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
    }

    const fetchUser = async () => {
      const userRes = await fetch("/api/users");
      const userData = await userRes.json();

      setUser(userData.data);
    };

    fetchUser();
  }, [session, status]);

  return (
    <div className="relative w-full flex items-center justify-center h-[10vh]">
      <Link href={"/"}>
        <Image
          src={"/brand/logo-transparent.png"}
          alt="Matchita Logo"
          height={125}
          width={150}
          className=""
        />
      </Link>
      <div className="flex items-center gap-4 absolute right-4 md:right-8 lg:right-10 top-6">
        {user && <NotificationBell notifications={user.notifications} />}

        {initials && (
          <div>
            <Link href={"/profile"}>
              <div className=" bg-matchita-300 p-2 flex items-center justify-center  text-matchita-900 rounded-xl cursor-pointer font-semibold text-xs md:text-base lg:text-lg">
                {initials}
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
