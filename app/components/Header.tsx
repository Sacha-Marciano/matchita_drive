import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="w-full flex items-center justify-center h-[10vh]">
      <Link href={"/"}>
      <Image
        src={"/brand/logo-transparent.png"}
        alt="Matchita Logo"
        height={125}
        width={150}
        className=""
      />
      </Link>
    </div>
  );
};

export default Header;
