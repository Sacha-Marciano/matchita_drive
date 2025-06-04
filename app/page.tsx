"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddRoomModal from "./components/modals/AddRoomModal";
import Loading from "./components/Loading";
import RoomCard from "./components/RoomCard";
import Button from "./components/ui/Button";
import { IRoom } from "./database/models/rooms";
import { IUser } from "./database/models/users";
import HomeDashboard from "./components/HomeDashboard";

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);

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

  if (status === "loading" || loading || !user)
    return (
      <div className="h-[90vh] w-[100vw] flex items-center justify-center font-bold text-4xl ">
        <Loading message="Loading Rooms" />
      </div>
    );

  return (
    <div className="p-4">
      <HomeDashboard userName={session?.user?.name || "User"} rooms={rooms} />
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setIsModalOpen(true)} variant="secondary" className="self-end">
          + Add Room
        </Button>
      </div>
      {/* <div className="flex flex-col lg:flex-row gap-2 justify-between items-center mb-6 p-4 bg-bg-alt rounded-2xl text-matchita-text-alt">
        <h1 className="text-2xl font-bold">Welcome, {session?.user?.name}</h1>
        <Button onClick={() => setIsModalOpen(true)} className="self-end">
          + Add Room
        </Button>
      </div> */}

      <div
        className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3  gap-4 h-[70vh] rounded-2xl overflow-y-auto border border-white p-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {rooms.map((room) => (
          <RoomCard
            key={room._id as string}
            id={room._id as string}
            title={room.title}
            avatar={room.avatar}
            documentCount={room.documentIds.length}
            folders={room.folders}
            tags={room.tags}
            viewerCount={room.viewerIds.length}
            createdAt={room.createdAt}
            isOwner={room.ownerId === user._id}
          />
        ))}
      </div>

      <AddRoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setRooms={setRooms}
        rooms={rooms}
      />
    </div>
  );
}
