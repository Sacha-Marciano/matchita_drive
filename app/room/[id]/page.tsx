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

export default function RoomPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: session, status } = useSession();
  const [room, setRoom] = useState<IRoom>();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<IUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [docs, setDocs] = useState<IDocument[]>([]);
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
        setDocs(docData.data);
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

  return (
    <div className="p-4">
      <div className="flex flex-col lg:flex-row gap-2 justify-between items-center mb-6 p-4 bg-bg-alt rounded-2xl text-matchita-text-alt">
        <h1 className="text-2xl font-bold"> {room.title}</h1>
        <Button onClick={() => setIsModalOpen(true)} className="self-end">
          Upload doc
        </Button>
      </div>

      <div
        className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3  gap-4 h-[70vh] rounded-2xl overflow-y-auto border border-white p-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>{" "}
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

      {/* Modal */}
      <AddDocModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        session={session}
        room={room}
        documents={docs}
        setDocuments={setDocs}
      />
    </div>
  );
}
