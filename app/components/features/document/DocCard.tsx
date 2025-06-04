import { formatDistanceToNow } from "date-fns";
import Button from "../../shared/ui/Button";
import EditableDisplay from "../../shared/ui/EditableDisplay";
import { IDocument } from "@/app/types";
import { Dispatch, SetStateAction, useState } from "react";
import OptionsMenu from "../../shared/ui/OptionMenu";
import { IRoom } from "@/app/types";

interface DocCardProps {
  document: IDocument;
  docList?: IDocument[];
  setDocList?: Dispatch<SetStateAction<IDocument[]>>;
  room?: IRoom;
}

export default function DocCard({
  document,
  docList,
  setDocList,
  room,
}: DocCardProps) {
  const [mode, setMode] = useState<"normal" | "delete" | "teaser">("normal");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleDocEdit = async (newValue: string) => {
    if (!docList || !setDocList) return;
    const editRes = await fetch(`/api/doch/${document._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newValue }),
    });
    const editData = await editRes.json();

    const filteredList = docList.filter((doc) => doc._id != editData.data._id);
    // setDoc(editData.data);
    setDocList([editData.data, ...filteredList]);
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

      const deleteData = await res.json();
      const deletedDoc = deleteData.data;

      // Step 1: Remove the deleted doc from UI
      const filteredList = docList.filter((doc) => doc._id !== deletedDoc._id);
      setDocList(filteredList);
      setMode("normal");

      // Step 2: Check if deleted folders or tags are now unused
      const remainingFolders = new Set(filteredList.map((doc) => doc.folder));
      const remainingTags = new Set(
        filteredList.flatMap((doc) => doc.tags || [])
      );

      // const deletedFolders = deletedDoc.folders || [];
      // const deletedTags = deletedDoc.tags || [];

      const cleanedFolders = room.folders.filter((folder) =>
        remainingFolders.has(folder)
      );
      const cleanedTags = room.tags.filter((tag) => remainingTags.has(tag));

      // Step 3: If any cleanup is needed, update the room
      const foldersChanged = cleanedFolders.length !== room.folders.length;
      const tagsChanged = cleanedTags.length !== room.tags.length;

      if (foldersChanged || tagsChanged) {
        await fetch(`/api/rooms/${room._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: room.title,
            folders: cleanedFolders,
            tags: cleanedTags,
          }),
        });
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(document.teaser);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 5000); // Reset after 2s
  };

  return (
    <div className="relative border h-[251px]  p-4 rounded-2xl shadow-md hover:shadow-lg transition bg-bg-alt text-matchita-text-alt">
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
                    <Button
                      variant="delete"
                      size="sm"
                      onClick={() => {
                        setMode("delete");
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </OptionsMenu>
              </div>
            )}
            <span className="text-sm text-matchita-500">
              🗂️ Folder:{" "}
              <span className="font-medium">
                {document.folder || "Unsorted"}
              </span>
            </span>
            <span className="text-sm text-matchita-500">
              🕒 Created {formatDistanceToNow(new Date(document.createdAt))} ago
            </span>
          </div>

          {/* Tags */}
          {document.tags.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              {document.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-matchita-100 text-matchita-600 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-xs text-matchita-400">No tags</div>
          )}

          {/* Action Button */}
          <Button
            size="lg"
            onClick={() => window.open(document.googleDocsUrl, "_blank")}
          >
            Open Document
          </Button>
        </div>
      )}
      {mode === "delete" && (
        <div className=" flex flex-col justify-between items-center gap-4 md:gap-6 lg:gap-8">
          <p className="text-matchita-text-alt text-xl font-bold">
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
            <Button variant="delete" onClick={() => handleDocDelete()}>
              Delete
            </Button>
          </div>
        </div>
      )}
      {mode === "teaser" && (
        <div className="h-full flex flex-col justify-between items-center z-50">
          <div className="border p-2 bg-bg text-matchita-text w-full rounded-lg overflow-y-auto">
            <p className="font-semibold"> {document.teaser} </p>
          </div>
          <div className="flex items-center justify-between w-full">
            <Button variant="secondary" onClick={() => setMode("normal")}>
              Back
            </Button>
            <Button
              onClick={() => {
                handleCopy();
              }}
            >
              {isCopied ? "Copied !" : "Copy Teaser"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
