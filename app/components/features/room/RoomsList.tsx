"use client";

// ─── Framework & Core Imports ─────────────────────────────────
import { IRoom } from "@/app/types";

// ─── Components ──────────────────────────────────────────────
import RoomCard from "./RoomCard";

// ─── Prop Types ──────────────────────────────────────────────
type Props = {
  rooms: IRoom[];
  userId: string;
};

// ─── Component ───────────────────────────────────────────────
export default function RoomsList({ rooms, userId }: Props) {
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
          key={room._id.toString()}
          id={room._id.toString()}
          title={room.title}
          avatar={room.avatar}
          documentCount={room.documentIds.length}
          folders={room.folders}
          tags={room.tags}
          viewerCount={room.viewerIds.length}
          createdAt={room.createdAt}
          isOwner={room.ownerId.toString() === userId}
        />
      ))}
    </div>
  );
}
