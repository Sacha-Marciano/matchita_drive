"use client";

// ─── Custom Hooks ─────────────────────────────────
import { useUser } from "@/app/contexts/UserContext";
import { useRooms } from "@/app/contexts/RoomsContext";

// ─── Components ──────────────────────────────────────────────
import RoomCard from "./RoomCard";

// ─── Component ───────────────────────────────────────────────
export default function RoomsList() {
  // ─── Hooks ───────────────────────────────────────────────
  const { user } = useUser();
  const { rooms } = useRooms();

  // ─── Render ───────────────────────────────────────────────
  return (
    <div
      className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 h-[70vh] rounded-2xl overflow-y-auto border border-white p-4"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {/* Hide scrollbar in all browsers */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Render a RoomCard for each room */}
      {rooms.map((room) => (
        <RoomCard
          key={room.title}
          room={room}
          isOwner={room.ownerId.toString() === user?._id.toString()}
        />
      ))}
    </div>
  );
}
