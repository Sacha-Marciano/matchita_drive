"use client";

import React, { useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import Button from "../components/ui/Button";

const LoginPage = () => {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session]);

  return (
    <div className="h-[90vh] w-[100vw] flex flex-col items-center justify-center overflow-hidden ">
      {/* Circles Bg */}
      <div className="w-full h-full absolute top-0 bottom-0 left-0 right-0 overflow-hidden -z-10">
        {/* Original Circles */}
        <div className="h-[235px] w-[235px] rounded-full bg-matchita-300 absolute top-10 right-20"></div>
        <div className="h-[135px] w-[135px] rounded-full bg-matchita-700 absolute bottom-60 left-20"></div>
        <div className="h-[400px] w-[400px] rounded-full bg-matchita-900 absolute -bottom-10 left-20 -z-10"></div>

        {/* New Decorative Circles */}
        <div className="h-[100px] w-[100px] rounded-full bg-matchita-500  absolute top-32 left-1/2 -translate-x-1/2"></div>
        <div className="h-[300px] w-[300px] rounded-full bg-matchita-300 absolute -top-20 left-1/4 -z-20"></div>
        <div className="h-[150px] w-[150px] rounded-full bg-matchita-600  absolute bottom-20 right-32 z-0 "></div>
        <div className="h-[90px] w-[90px] rounded-full bg-matchita-400  absolute top-[60%] left-[60%] "></div>
        <div className="h-[220px] w-[220px] rounded-full bg-matchita-400 absolute bottom-5 left-[45%] -translate-x-1/2 z-[-1] "></div>
      </div>

      {/* Title */}
      {/* Subtitle */}
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Unlock the power of Matchita!
      </h1>
      <p className="text-lg md:text-xl text-gray-200 max-w-xl mb-8">
        Your intelligent workspace for documents. Matchita helps you organize,
        search, and understand your files with AI, instantly.
      </p>

      {/* Sign in Button */}
      <Button
        variant="secondary"
        size="lg"
        onClick={() => signIn("google")}
        className="mb-8 "
      >
        <div className="flex items-center gap-2">
          Sign in with Google <LogIn />
        </div>
      </Button>
    </div>
  );
};

export default LoginPage;
