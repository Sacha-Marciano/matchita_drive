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

// ─── Types ───────────────────────────────────────────────────
import { IRoom } from "@/app/database/models/rooms";
import { IUser } from "@/app/database/models/users";
import { IDocument } from "@/app/database/models/documents";
import FoldersList from "@/app/components/features/folder/FoldersList";
import DocsList from "@/app/components/features/document/DocsList";

// ─── Utils / Constants ───────────────────────────────────────
// import { YOUR_UTILITY_FN } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────

export default function RoomPage() {
  // ─── Hooks ────────────────────────────────────────────────
  const router = useRouter();
  const { id } = useParams();
  const { data: session, status } = useSession();

  // ─── State ────────────────────────────────────────────────
  const [room, setRoom] = useState<IRoom>();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<IUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docs, setDocs] = useState<IDocument[]>([]);
  const [folders, setFolders] = useState<Record<string, IDocument[]> | null>(
    null
  );
  const [accessToken, setAccessToken] = useState("");
  const [showSignoutMessage, setShowSignoutMessage] = useState(false);

  // ─── Effects ──────────────────────────────────────────────
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (session.accessToken) setAccessToken(session.accessToken);

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
        setDocs(docData.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, status]);

  useEffect(() => {
    const docsByFolders = docs.reduce(
      (acc: Record<string, IDocument[]>, doc) => {
        if (!acc[doc.folder]) acc[doc.folder] = [];
        acc[doc.folder].push(doc);
        return acc;
      },
      {}
    );
    setFolders(docsByFolders);
  }, [docs]);

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
      content: <DocsList docs={docs} setDocList={setDocs} room={room} />,
    },
    {
      label: "Chat",
      content: <ChatWindow roomId={id} accessToken={accessToken} />,
    },
    {
      label: "Settings",
      content: <RoomSettings room={room} />,
    },
  ];

  // ─── Render ───────────────────────────────────────────────
  return (
    <div className="p-4">
      {/* Header / Dashboard */}
      <RoomDashboard
        room={room}
        documents={docs}
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
        session={session}
        room={room}
        documents={docs}
        setDocuments={setDocs}
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
