"use client";

// ─── Types ────────────────────────────────────────────────────
import type { IDocument } from "@/app/types";

// ─── Components ──────────────────────────────────────────────
import FolderCard from "./FolderCard";

// ─── Props ────────────────────────────────────────────────────
type Props = {
  folders: Record<string, IDocument[]> | null;
};

// ─── Component ────────────────────────────────────────────────
export default function FoldersList({ folders }: Props) {
  return (
    <div className="h-[70vh] overflow-y-auto flex flex-col gap-4">
      {folders &&
        Object.entries(folders).map(([folderName, documents]) => (
          <FolderCard
            key={folderName}
            folderName={folderName}
            folderDocs={documents}
          />
        ))}
    </div>
  );
}
