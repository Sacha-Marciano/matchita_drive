"use client";

// ─── Framework Imports ───────────────────────────────────────
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// ─── Auth ────────────────────────────────────────────────────
import { useSession } from "next-auth/react";

// ─── Components ──────────────────────────────────────────────
import Loading from "@/app/components/layout/Loading";
import Button from "@/app/components/shared/ui/Button";
import AddDocModal from "@/app/components/features/document/AddDocumentModal";
import ChatWindow from "@/app/components/features/room/ChatWindow";
import SignoutMessage from "@/app/components/shared/modals/ForcedSignoutModal";
import RoomSettings from "@/app/components/features/room/RoomSettings";
import RoomDashboard from "@/app/components/features/room/RoomDashboard";
import Tabs from "@/app/components/shared/ui/Tabs";
import FoldersList from "@/app/components/features/folder/FoldersList";
import DocsList from "@/app/components/features/document/DocsList";

// ─── Types ───────────────────────────────────────────────────
import { IMessage } from "@/app/types";
import { IDocument } from "@/app/types";

// ─── Context Suscribe ───────────────────────────────────────
import { useUser } from "@/app/contexts/UserContext";
import { useDocuments } from "@/app/contexts/DocumentsContext";
import { useRoom } from "@/app/contexts/RoomContext";

// ─────────────────────────────────────────────────────────────

export default function RoomPage() {
  // ─── Hooks ────────────────────────────────────────────────
  const router = useRouter();
  const { id } = useParams();
  const { data: session, status } = useSession();
  const { user, setUser } = useUser();
  const { documents, setDocuments } = useDocuments();
  const { room, setRoom } = useRoom();

  // ─── State ────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folders, setFolders] = useState<Record<string, IDocument[]>>({});
  const [showSignoutMessage, setShowSignoutMessage] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);

  // ─── Effects ──────────────────────────────────────────────
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [userRes, roomsRes, docRes] = await Promise.all([
          fetch("/api/users"),
          fetch(`/api/rooms/${id}`),
          fetch(`/api/doch/${id}`),
        ]);

        const userData = await userRes.json();
        const roomData = await roomsRes.json();
        const docData = await docRes.json();

        setUser(userData.data);
        setRoom(roomData.data);
        setDocuments(docData.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, status]);

  useEffect(() => {
    const docsByFolders = documents.reduce(
      (acc: Record<string, IDocument[]>, doc) => {
        if (!acc[doc.folder]) acc[doc.folder] = [];
        acc[doc.folder].push(doc);
        return acc;
      },
      {}
    );
    setFolders(docsByFolders);
  }, [documents]);

  // ─── Early Return (Auth or Loading) ───────────────────────
  if (status === "loading" || loading || !user || !room) {
    return (
      <div className="h-[90vh] w-[100vw] flex items-center justify-center">
        <Loading message="Loading Rooms" />
      </div>
    );
  }

  if (!user.roomIds.map(String).includes(String(room._id))) {
    return (
      <div className="h-[90vh] w-[100vw] flex items-center justify-center text-white text-center">
        <div>
          <h1 className="text-2xl font-bold">
            You are not allowed in this room
          </h1>
          <p>Please contact the room admin to get access</p>
        </div>
      </div>
    );
  }

  // ─── Handlers ─────────────────────────────────────────────
  const handleEditRoom = async (newValue: string) => {
    if (!room) return;

    const res = await fetch(`/api/rooms/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newValue,
        folders: room.folders,
        tags: room.tags,
      }),
    });

    const updated = await res.json();
    setRoom(updated.data);
  };

  const handleUploadClick = () => setIsModalOpen(true);

  // ─── Tabs Config ──────────────────────────────────────────
  const tabs = [
    {
      label: "Folders",
      content: <FoldersList folders={folders} />,
    },
    {
      label: "Docs",
      content: <DocsList folders={folders} />,
    },
    {
      label: "Chat",
      content: <ChatWindow messages={messages} setMessages={setMessages} />,
    },
    {
      label: "Settings",
      content: <RoomSettings />,
    },
  ];

  // ─── Render ───────────────────────────────────────────────
  return (
    <div className="p-4">
      {/* Header / Dashboard */}
      <RoomDashboard
        room={room}
        documents={documents}
        onEditTitle={handleEditRoom}
      />

      {/* Tabs + Upload Action */}
      <div className="relative">
        <Tabs tabs={tabs} size="md" variant="secondary" />
        <Button
          variant="secondary"
          onClick={handleUploadClick}
          className="absolute top-0 right-2"
        >
          Upload doc <strong>+</strong>
        </Button>
      </div>

      {/* Modals */}
      <AddDocModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setShowSignoutMessage={setShowSignoutMessage}
      />

      {/* Forced Signout message */}
      <SignoutMessage
        isOpen={showSignoutMessage}
        onClose={() => setShowSignoutMessage(false)}
      />
    </div>
  );
}
