"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, FolderKanban, CalendarDays, User } from "lucide-react";
import EditableDisplay from "@/app/components/shared/ui/EditableDisplay";
import { IRoom } from "@/app/database/models/rooms";
import { IDocument } from "@/app/types";
import { format } from "date-fns";
import { IUser } from "@/app/database/models/users";
import InviteUserModal from "../user/InviteUserModal";

type Props = {
  room: IRoom;
  documents: IDocument[];
  onEditTitle: (newTitle: string) => Promise<void>;
};

type ViewerInfo = {
  _id: string;
  name?: string;
  email?: string;
  role?: string;
};

export default function RoomDashboard({ room, documents, onEditTitle }: Props) {
  const [owner, setOwner] = useState<ViewerInfo | null>(null);
  const [viewers, setViewers] = useState<ViewerInfo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const folderCount = new Set(documents.map((doc) => doc.folder)).size;
  const createdAt = format(new Date(room.createdAt), "MMM dd, yyyy");

  const stats = [
    {
      icon: <FileText size={20} className="text-primary" />,
      label: "Documents",
      value: documents.length,
    },
    {
      icon: <FolderKanban size={20} className="text-primary" />,
      label: "Folders",
      value: folderCount,
    },
    {
      icon: <User size={20} className="text-primary" />,
      label: "Viewers",
      value: room.viewerIds.length + 1,
    },
    {
      icon: <CalendarDays size={20} className="text-primary" />,
      label: "Created",
      value: createdAt,
    },
  ];

  useEffect(() => {
    const fetchViewerInfo = async () => {
      try {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: [room.ownerId, ...room.viewerIds] }),
        });

        const data = await res.json();

        if (res.ok && Array.isArray(data.data)) {
          const allUsers = data.data;
          setOwner(
            allUsers.find((user: IUser) => user._id === room.ownerId) || null
          );
          setViewers(
            allUsers.filter((user: IUser) => user._id !== room.ownerId)
          );
        } else {
          console.error("Failed to load viewer info:", data?.error);
        }
      } catch (error) {
        console.error("Error fetching viewer info:", error);
      }
    };

    fetchViewerInfo();
  }, [room.ownerId, room.viewerIds]);

  return (
    <motion.div
      className="w-full bg-bg-alt text-matchita-text-alt rounded-2xl shadow p-6 mb-6 flex flex-col gap-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <EditableDisplay
          text={room.title}
          handleEdit={onEditTitle}
          variant="secondary"
          size="full"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-2 bg-muted p-3 rounded-xl"
          >
            {stat.icon}
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-lg font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Viewer Info Table */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between px-2 text-sm">
            <p className="font-semibold">Collaborators</p>
            <div
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer border-b px-0.5"
            >
              Invite
            </div>
          </div>
          <div className="w-full h-[100px] overflow-x-auto rounded-2xl border border-matchita-600 bg-background shadow-sm">
            <table className="min-w-full table-auto text-sm text-left ">
              <thead className="bg-muted text-muted-foreground border-b-2 divide-matchita-800">
                <tr>
                  <th className="px-2 py-1.5 font-medium">Name</th>
                  <th className="px-2 py-1.5 font-medium">Email</th>
                  <th className="px-2 py-1.5 font-medium">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-matchita-800 ">
                {owner && (
                  <tr className="hover:bg-muted/50 transition">
                    <td className="px-2 py-1.5 font-semibold">
                      {owner.name || "Owner"}
                    </td>
                    <td className="px-2 py-1.5">{owner.email}</td>
                    <td className="px-2 py-1.5 font-semibold">
                      {owner.role || "Owner"}
                    </td>
                  </tr>
                )}
                {viewers.map((viewer) => (
                  <tr key={viewer._id} className="hover:bg-muted/50 transition">
                    <td className="px-2 py-1.5">{viewer.name || "Viewer"}</td>
                    <td className="px-2 py-1.5">{viewer.email}</td>
                    <td className="px-2 py-1.5">{viewer.role || "Viewer"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-matchita-800 flex items-center justify-center text-muted-foreground">
          Coming soon: User activity / Invite system
        </div>
      </div>

      <InviteUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        room={room}
      />
    </motion.div>
  );
}
