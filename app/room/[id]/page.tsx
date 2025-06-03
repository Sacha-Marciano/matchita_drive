"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loading from "../../components/Loading";
import Button from "../../components/ui/Button";
import { IRoom } from "../../database/models/rooms";
import { IUser } from "../../database/models/users";
import AddDocModal from "@/app/components/modals/AddDocumentModal";
import { IDocument } from "@/app/database/models/documents";
import DocCard from "@/app/components/DocCard";
import Tabs from "@/app/components/ui/Tabs";
import FolderCard from "@/app/components/FolderCard";
import ChatWindow from "@/app/components/ChatWindow";
import SignoutMessage from "@/app/components/modals/SignoutMessage";
import RoomSettings from "@/app/components/RoomSettings";
import EditableDisplay from "@/app/components/ui/EditableDisplay";

export default function RoomPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: session, status } = useSession();
  const [room, setRoom] = useState<IRoom>();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<IUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [docs, setDocs] = useState<IDocument[]>([]);
  const [folders, setFolders] = useState<Record<string, IDocument[]> | null>(
    null
  );
  const [accessToken, setAccessToken] = useState<string>("");
  const [showSignoutMessage, setShowSignoutMessage] = useState<boolean>(false);

  const handleEditRoom = async (newValue: string) => {
    const editRes = await fetch(`/api/rooms/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newValue }),
    });

    const editData = await editRes.json();
    setRoom(editData.data)
  };

  useEffect(() => {
    if (status === "loading") return;

    if (session == null) {
      router.push("/login");
      return;
    }

    if (session.accessToken) {
      setAccessToken(session.accessToken);
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
        setDocs(docData.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, status, router]);

  useEffect(() => {
    const docsByFolders = docs.reduce(
      (acc: Record<string, IDocument[]>, doc: IDocument) => {
        if (!acc[doc.folder]) {
          acc[doc.folder] = [];
        }
        acc[doc.folder].push(doc);
        return acc;
      },
      {}
    );
    setFolders(docsByFolders);
  }, [docs]);

  if (status === "loading" || loading || !user || !room)
    return (
      <div className="h-[90vh] w-[100vw] flex items-center justify-center font-bold text-4xl ">
        <Loading message="Loading Rooms" />
      </div>
    );

  if (!user.roomIds.map(String).includes(String(room._id))) {
    return (
      <div className="h-[90vh] w-[100vw] flex items-center justify-center font-bold  text-white ">
        <div className="text-center">
          <h1>You are not allowed in this room</h1>
          <p>Please contact the room admin to get access</p>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      label: "Folders",
      content: (
        <div
          className="h-[70vh] overflow-y-auto flex flex-col gap-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {folders &&
            Object.entries(folders).map(([folderName, documents]) => (
              <FolderCard
                key={folderName}
                folderName={folderName}
                documents={documents}
              />
            ))}
        </div>
      ),
    },
    {
      label: "Docs",
      content: (
        <div
          className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3  gap-4 h-[70vh] overflow-y-auto "
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {docs.map((doc, index) => {
            return (
              <DocCard
                key={index}
                title={doc.title}
                googleDocsUrl={doc.googleDocsUrl}
                folder={doc.folder}
                tags={doc.tags}
                createdAt={doc.createdAt}
              />
            );
          })}
        </div>
      ),
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

  return (
    <div className="p-4">
      <div className="flex flex-col lg:flex-row gap-2 justify-between items-center mb-6 p-4 bg-bg-alt rounded-2xl text-matchita-text-alt">
        {/* <h1 className="text-2xl font-bold"> {room.title}</h1> */}
        <EditableDisplay
          text={room.title}
          handleEdit={handleEditRoom}
          variant="secondary"
          size="lg"
        />
        <Button onClick={() => setIsModalOpen(true)} className="self-end">
          Upload doc
        </Button>
      </div>

      <Tabs tabs={tabs} size="md" variant="secondary" />

      {/* Modal */}
      <AddDocModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        session={session}
        room={room}
        documents={docs}
        setDocuments={setDocs}
        setShowSignoutMessage={setShowSignoutMessage}
      />

      <SignoutMessage
        isOpen={showSignoutMessage}
        onClose={() => setShowSignoutMessage(false)}
      />
    </div>
  );
}
