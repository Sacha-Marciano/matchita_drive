"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  const { data: session } = useSession();

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
      <Link href={"/profile"}>
        {initials && (
          <div className="absolute bg-matchita-300 p-2 flex items-center justify-center  right-4 md:right-8 lg:right-10 top-6 text-matchita-900 rounded-xl cursor-pointer font-semibold text-xs md:text-base lg:text-lg">
            {initials}
          </div>
        )}
      </Link>
    </div>
  );
};

export default Header;
