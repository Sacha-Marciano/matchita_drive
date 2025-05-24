"use client";

import React, { useEffect } from "react";
import Loading from "../components/Loading";
import { useSession, signOut } from "next-auth/react";
import Button from "../components/ui/Button";
import { useRouter } from "next/navigation";

const Profile = () => {
  const { data: session,status } = useSession();
  const router = useRouter();

  const user = session?.user;

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Redirect to login page if no session
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
    }
  }, [session, status]);

  if (status === "loading")
    return (
      <div className="h-[90vh] w-[100vw] flex items-center justify-center font-bold text-4xl ">
        <Loading message="Loading Profile" />
      </div>
    );

  return (
    <div className="h-[85vh] flex flex-col lg:items-center relative mb-14">
      <div className="px-6 py-2 lg:px-0 lg:w-[488px] lg:mt-14">
        <div className="flex gap-4 items-center mb-8 lg:flex-col">
          <div className="w-16 h-16 lg:h-20 lg:w-20 p-3 rounded-3xl bg-[#DAE2E980] text-surf-blue flex items-center justify-center font-bold text-[26px] lg:text-[32.5px]">
            {initials}
            {/* Uncomment to show user google image */}
            {/* {user && <img src={user.image || "/default-profile.png"} className="rounded-xl" />} */}
          </div>
          <p className="text-2xl lg:text-[28px] font-bold">{user?.name}</p>
        </div>

        <div className="flex flex-col gap-6 border border-white bg-bg-alt text-matchita-900 rounded-xl p-2 lg:p-4">
          <div className="flex justify-between">
            <label
              htmlFor="email"
              className=" text-surf-blues500 text-sm font-semibold"
            >
              Email
            </label>
            <p id="email" className="font-normal">
              {user?.email}
            </p>
          </div>
          <div className="flex justify-between">
            <label
              htmlFor="rooms"
              className=" text-surf-blues500 text-sm font-semibold"
            >
              Rooms
            </label>
            <p id="rooms" className="font-normal">
              6
            </p>
          </div>
          <div className="flex justify-between">
            <label
              htmlFor="docs"
              className=" text-surf-blues500 text-sm font-semibold"
            >
              Docs handled
            </label>
            <p id="docs" className="font-normal">
              125
            </p>
          </div>
          <div className="flex justify-between">
            <label
              htmlFor="plan"
              className=" text-surf-blues500 text-sm font-semibold"
            >
              Plan
            </label>
            <p id="plan" className="font-normal">
              Pro
            </p>
          </div>

          {/* Template for profile infos */}
          {/* <div className="flex justify-between">
            <label
              htmlFor=""
              className=" text-surf-blues500 text-sm font-semibold"
            >
              
            </label>
            <p id="" className="font-normal">
              
            </p>
          </div> */}
        </div>

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
};

export default Profile;
