"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AddRoomModal from "../../components/modals/AddRoomModal";
import Loading from "../../components/Loading";
import RoomCard from "../../components/RoomCard";
import Button from "../../components/ui/Button";
import { IRoom } from "../../database/models/rooms";
import { IUser } from "../../database/models/users";

export default function RoomPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: session, status } = useSession();
  const [room, setRoom] = useState<IRoom>();
  const [loading, setLoading] = useState(true);
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
          fetch(`/api/rooms/${id}`),
        ]);

        const userData = await userRes.json();
        const roomData = await roomsRes.json();

        setUser(userData.data);
        setRoom(roomData.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, status, router]);

  if (status === "loading" || loading || !user || !room)
    return (
      <div className="h-[90vh] w-[100vw] flex items-center justify-center font-bold text-4xl ">
        <Loading message="Loading Rooms" />
      </div>
    );

  return (
    <div className="p-4">
      <div className="flex flex-col lg:flex-row gap-2 justify-between items-center mb-6 p-4 bg-bg-alt rounded-2xl text-matchita-text-alt">
        <h1 className="text-2xl font-bold">Welcome, {session?.user?.name}</h1>
        <Button variant="disabled" onClick={() => console.log("sacha")} className="self-end">
          Upload doc
        </Button>
      </div>

      <div className="h-[70vh] rounded-2xl overflow-y-auto  bg-bg-alt p-4"></div>

      
    </div>
  );
}
