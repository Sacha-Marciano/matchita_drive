// components/cards/FolderCard.tsx
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { IDocument } from "@/app/database/models/documents";
import Button from "../ui/Button";

interface FolderCardProps {
  folderName: string;
  documents: IDocument[];
}

export default function FolderCard({ folderName, documents }: FolderCardProps) {
  const allTags = documents.flatMap((doc) => doc.tags);
  const uniqueTags = [...new Set(allTags)].slice(0, 4);

  const newestDoc = documents.reduce((latest, doc) =>
    new Date(doc.createdAt) > new Date(latest.createdAt) ? doc : latest
  );

  return (
    <div className="w-full border p-5 rounded-2xl shadow-md hover:shadow-lg transition bg-bg-alt text-matchita-text-alt space-y-4">
      {/* Folder Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{folderName}</h2>
        <span className="text-sm text-matchita-400">
          {documents.length} document{documents.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {uniqueTags.length > 0 ? (
          uniqueTags.map((tag) => (
            <span
              key={tag}
              className="bg-matchita-100 text-matchita-600 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))
        ) : (
          <span className="bg-matchita-100 text-matchita-600 px-2 py-0.5 rounded-full">
            No tags
          </span>
        )}
      </div>

      {/* Info */}
      <div className="text-sm text-matchita-500">
        🕒 Last added: {formatDistanceToNow(new Date(newestDoc.createdAt))} ago
      </div>

      {/* CTA */}
      <Button size="lg" onClick={() => console.log("redirect to drive")}>
        <Link href={`/folder/${encodeURIComponent(folderName)}`}>
          Open Folder
        </Link>
      </Button>
    </div>
  );
}
