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

// ─── Context Subscribe ───────────────────────────────────────────────────
import { useUser } from "./contexts/UserContext";
import { useRooms } from "./contexts/RoomsContext";

// ─────────────────────────────────────────────────────────────

export default function HomePage() {
  // ─── Hooks ────────────────────────────────────────────────
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, setUser } = useUser();
  const { rooms, setRooms } = useRooms();

  // ─── State ────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  if (status === "loading" || loading || !user || !rooms) {
    return (
      <div className="h-[90vh] w-[100vw] flex items-center justify-center font-bold text-4xl">
        <Loading message="Loading Rooms" />
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────
  return (
    <div className="p-4">
      <HomeDashboard />

      <div className="mb-6 flex justify-end">
        <Button onClick={() => setIsModalOpen(true)} variant="secondary">
          + Add Room
        </Button>
      </div>

      <RoomsList  />

      <AddRoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
