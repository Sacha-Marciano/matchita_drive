"use client";

// ─── Framework & Core Imports ─────────────────────────────────
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

// ─── UI & Layout ─────────────────────────────────────────────
import Button from "@/app/components/shared/ui/Button";
import EditableDisplay from "@/app/components/shared/ui/EditableDisplay";
import OptionsMenu from "@/app/components/shared/ui/OptionMenu";

// ─── Types ───────────────────────────────────────────────────
import { IDocument, IRoom } from "@/app/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// ─── Prop Types ──────────────────────────────────────────────
interface DocCardProps {
  document: IDocument;
  docList?: IDocument[];
  setDocList?: Dispatch<SetStateAction<IDocument[]>>;
  room?: IRoom;
}

// ─── Component ───────────────────────────────────────────────
export default function DocCard({
  document,
  docList,
  setDocList,
  room,
}: DocCardProps) {
  // ─── Hooks ────────────────────────────────────────────────
  const { data: session, status } = useSession();
  const router = useRouter();

  // ─── State ────────────────────────────────────────────────
  const [mode, setMode] = useState<"normal" | "delete" | "teaser">("normal");
  const [isCopied, setIsCopied] = useState(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  // ─── Effects ──────────────────────────────────────────────
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const userRes = await fetch("/api/users");
        const userData = await userRes.json();

        setIsOwner(userData.data._id === document.addedBy);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [session, status]);

  // ─── Handlers ─────────────────────────────────────────────
  const handleDocEdit = async (newValue: string) => {
    if (!docList || !setDocList) return;

    const res = await fetch(`/api/doch/${document._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newValue }),
    });

    const editData = await res.json();
    const updatedList = docList.filter((doc) => doc._id !== editData.data._id);
    setDocList([editData.data, ...updatedList]);
  };

  const handleDocDelete = async () => {
    if (!room || !docList || !setDocList) return;

    try {
      const res = await fetch(`/api/doch/${document._id}?roomId=${room._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to delete document:", err.error);
        return;
      }

      const deletedDoc = (await res.json()).data;
      const filteredList = docList.filter((doc) => doc._id !== deletedDoc._id);
      setDocList(filteredList);
      setMode("normal");

      const remainingFolders = new Set(filteredList.map((doc) => doc.folder));
      const remainingTags = new Set(
        filteredList.flatMap((doc) => doc.tags || [])
      );

      const cleanedFolders = room.folders.filter((folder) =>
        remainingFolders.has(folder)
      );
      const cleanedTags = room.tags.filter((tag) => remainingTags.has(tag));

      if (
        cleanedFolders.length !== room.folders.length ||
        cleanedTags.length !== room.tags.length
      ) {
        await fetch(`/api/rooms/${room._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: room.title,
            folders: cleanedFolders,
            tags: cleanedTags,
          }),
        });
      }
    } catch (err) {
      console.error("Error deleting document:", err);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(document.teaser);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 5000);
  };

  // ─── Render ───────────────────────────────────────────────
  return (
    <div className="relative border h-[251px] p-4 rounded-2xl shadow-md hover:shadow-lg transition bg-bg-alt text-paul-text-alt">
      {mode === "normal" && (
        <div className="h-full flex flex-col justify-between gap-4">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <EditableDisplay
              text={document.title}
              handleEdit={handleDocEdit}
              variant="secondary"
              size="full"
            />
            {docList && (
              <div className="absolute right-1 top-1">
                <OptionsMenu>
                  <div className="flex flex-col items-center justify-center">
                    <Button size="sm" onClick={() => setMode("teaser")}>
                      Teaser
                    </Button>
                    {isOwner && (
                      <Button
                        variant="delete"
                        size="sm"
                        onClick={() => setMode("delete")}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </OptionsMenu>
              </div>
            )}
            <span className="text-sm text-paul-500">
              🗂️ Folder:{" "}
              <span className="font-medium">
                {document.folder || "Unsorted"}
              </span>
            </span>
            <span className="text-sm text-paul-500">
              🕒 Created {formatDistanceToNow(new Date(document.createdAt))} ago
            </span>
          </div>

          {/* Tags */}
          {document.tags.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              {document.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-paul-100 text-paul-600 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-xs text-paul-400">No tags</div>
          )}

          {/* Actions */}
          <Button
            size="lg"
            onClick={() => window.open(document.googleDocsUrl, "_blank")}
          >
            Open Document
          </Button>
        </div>
      )}

      {mode === "delete" && (
        <div className="flex flex-col justify-between items-center gap-4 md:gap-6 lg:gap-8">
          <p className="text-paul-text-alt text-xl font-bold">
            Are you sure ?
          </p>
          <p>
            Deleting document <strong>&quot;{document.title}&quot;</strong> is
            irreversible
          </p>
          <div className="w-full flex items-center justify-around">
            <Button variant="secondary" onClick={() => setMode("normal")}>
              Cancel
            </Button>
            <Button variant="delete" onClick={handleDocDelete}>
              Delete
            </Button>
          </div>
        </div>
      )}

      {mode === "teaser" && (
        <div className="h-full flex flex-col justify-between items-center z-50">
          <div className="border p-2 bg-bg text-paul-text w-full rounded-lg overflow-y-auto">
            <p className="font-semibold"> {document.teaser} </p>
          </div>
          <div className="flex items-center justify-between w-full">
            <Button variant="secondary" onClick={() => setMode("normal")}>
              Back
            </Button>
            <Button onClick={handleCopy}>
              {isCopied ? "Copied!" : "Copy Teaser"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
