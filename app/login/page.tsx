"use client";

// ─── Framework Imports ───────────────────────────────────────
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ─── Auth ────────────────────────────────────────────────────
import { useSession, signIn } from "next-auth/react";

// ─── Components ──────────────────────────────────────────────
import Loading from "@/app/components/layout/Loading";
import Button from "@/app/components/shared/ui/Button";
import CircleBg from "@/app/components/shared/ui/CircleBg";

// ─── Page Component ──────────────────────────────────────────
export default function LoginPage() {
  // ─── Hooks ────────────────────────────────────────────────
  const router = useRouter();
  const { data: session, status } = useSession();

  // ─── Effects ──────────────────────────────────────────────
  useEffect(() => {
    if (status === "loading") return;
    if (session) router.push("/");
  }, [session, status]);

  // ─── Early Return (Loading) ───────────────────────────────
  if (status === "loading") {
    return (
      <div className="h-[90vh] w-[100vw] flex items-center justify-center">
        <Loading message="Loading" />
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────
  return (
    <div className="h-[90vh] w-[100vw] flex flex-col items-center justify-center overflow-hidden relative">
      <CircleBg />

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Unlock the power of Paul!
      </h1>

      {/* Subtitle */}
      <p className="text-lg md:text-xl text-gray-200 max-w-xl mb-8 text-center">
        Your intelligent workspace for documents. Paul helps you organize,
        search, and understand your files with AI, instantly.
      </p>

      {/* Sign in Button */}
      <Button
        variant="secondary"
        size="lg"
        onClick={() => signIn("google")}
        className="mb-8"
      >
        <div className="flex items-center gap-2">
          Sign in with
          <Image
            src="/icons/google.png"
            alt="Google Logo"
            width={16}
            height={16}
            className="h-4 w-4"
          />
        </div>
      </Button>
    </div>
  );
}
