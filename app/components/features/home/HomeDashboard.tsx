"use client";

// ─── Types ────────────────────────────────────────────────────
import type { IRoom } from "@/app/types";

// ─── Components ───────────────────────────────────────────────
import StatsCard from "../../shared/ui/StatsCard";

// ─── Props ────────────────────────────────────────────────────
type Props = {
  userName: string;
  rooms: IRoom[];
};

// ─── Component ────────────────────────────────────────────────
export default function HomeDashboard({ userName, rooms }: Props) {
  // ─── Derived Data ──────────────────────────────────────────
  const totalDocuments = rooms.reduce(
    (acc, room) => acc + room.documentIds.length,
    0
  );
  const totalViewers = new Set(
    rooms.flatMap((room) => room.viewerIds.map((id) => id.toString()))
  ).size;

  // ─── Render ────────────────────────────────────────────────
  return (
    <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 mb-6">
      {/* Welcome Header */}
      <div className="col-span-full bg-bg-alt p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center text-paul-text-alt">
        <h1 className="text-2xl font-bold">Welcome, {userName}</h1>
        <span className="text-sm text-gray-400">Dashboard Overview</span>
      </div>

      {/* Stats Cards */}
      <StatsCard label="Total Rooms" value={rooms.length} />
      <StatsCard label="Total Documents" value={totalDocuments} />
      <StatsCard label="Collaborators" value={totalViewers} />
    </div>
  );
}
