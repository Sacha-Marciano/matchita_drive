"use client";

import { IRoom } from "@/app/database/models/rooms";

interface Props {
  userName: string;
  rooms: IRoom[];
}

export default function HomeDashboard({ userName, rooms }: Props) {
  const totalDocuments = rooms.reduce((acc, room) => acc + room.documentIds.length, 0);
  const totalViewers = new Set(
    rooms.flatMap((room) => room.viewerIds.map((id) => id.toString()))
  ).size;

  return (
    <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 mb-6">
      <div className="col-span-full bg-bg-alt p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center text-matchita-text-alt">
        <h1 className="text-2xl font-bold">Welcome, {userName}</h1>
        <span className="text-sm text-gray-400">Dashboard Overview</span>
      </div>

      <div className="bg-bg-alt p-4 rounded-2xl text-center text-matchita-text-alt">
        <p className="text-lg font-semibold">Total Rooms</p>
        <p className="text-3xl font-bold mt-1">{rooms.length}</p>
      </div>

      <div className="bg-bg-alt p-4 rounded-2xl text-center text-matchita-text-alt">
        <p className="text-lg font-semibold">Total Documents</p>
        <p className="text-3xl font-bold mt-1">{totalDocuments}</p>
      </div>

      <div className="bg-bg-alt p-4 rounded-2xl text-center text-matchita-text-alt">
        <p className="text-lg font-semibold">Collaborators</p>
        <p className="text-3xl font-bold mt-1">{totalViewers}</p>
      </div>
    </div>
  );
}
