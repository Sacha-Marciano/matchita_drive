"use client"

import React, { useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session]);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <button onClick={() => signIn("google")} className="border p-2 rounded-full cursor-pointer ">Sign in with Google</button>
    </div>
  );
};

export default LoginPage;
