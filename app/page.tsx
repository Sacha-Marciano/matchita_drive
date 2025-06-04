"use client";

// ─── Framework Imports ───────────────────────────────────────
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// ─── Auth ────────────────────────────────────────────────────
import { useSession } from "next-auth/react";

// ─── Components ──────────────────────────────────────────────
import AddRoomModal from "./components/features/room/AddRoomModal";
import RoomsList from "./components/features/room/RoomsList";
import HomeDashboard from "./components/features/home/HomeDashboard";
import Loading from "./components/layout/Loading";
import Button from "./components/shared/ui/Button";

// ─── Types ───────────────────────────────────────────────────
import { IRoom } from "./database/models/rooms";
import { IUser } from "./database/models/users";

// ─────────────────────────────────────────────────────────────

export default function HomePage() {
  // ─── Hooks ────────────────────────────────────────────────
  const router = useRouter();
  const { data: session, status } = useSession();

  // ─── State ────────────────────────────────────────────────
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);

  // ─── Effects ──────────────────────────────────────────────
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [userRes, roomsRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/rooms"),
        ]);

        const userData = await userRes.json();
        const roomsData = await roomsRes.json();

        setUser(userData.data);
        setRooms(roomsData.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, status, router]);

  // ─── Loading State ────────────────────────────────────────
  if (status === "loading" || loading || !user) {
    return (
      <div className="h-[90vh] w-[100vw] flex items-center justify-center font-bold text-4xl">
        <Loading message="Loading Rooms" />
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────
  return (
    <div className="p-4">
      <HomeDashboard userName={session?.user?.name || "User"} rooms={rooms} />

      <div className="mb-6 flex justify-end">
        <Button onClick={() => setIsModalOpen(true)} variant="secondary">
          + Add Room
        </Button>
      </div>

      <RoomsList rooms={rooms} userId={user._id as string} />

      <AddRoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setRooms={setRooms}
        rooms={rooms}
      />
    </div>
  );
}