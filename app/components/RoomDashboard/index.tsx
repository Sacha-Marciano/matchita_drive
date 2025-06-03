"use client";

import { motion } from "framer-motion";
import { FileText, FolderKanban, CalendarDays, User } from "lucide-react";
import EditableDisplay from "@/app/components/ui/EditableDisplay";
import { IRoom } from "@/app/database/models/rooms";
import { IDocument } from "@/app/database/models/documents";
import { format } from "date-fns";

type Props = {
    room: IRoom;
    documents: IDocument[];
    onEditTitle: (newTitle: string) => Promise<void>;
};

export default function RoomDashboard({ room, documents, onEditTitle }: Props) {
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
        {/* Future: Room avatar, invite users, etc. */}
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

      {/* Future features area */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-dashed border-border h-32 flex items-center justify-center text-muted-foreground">
          Coming soon: AI Summary / Chat Highlights
        </div>
        <div className="p-4 rounded-xl border border-dashed border-border h-32 flex items-center justify-center text-muted-foreground">
          Coming soon: User activity / Invite system
        </div>
      </div>
    </motion.div>
  );
}
