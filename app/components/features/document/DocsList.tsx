"use client";

// ─── Custom Hooks ─────────────────────────────────
import { useDocuments } from "@/app/contexts/DocumentsContext";

// ─── Components ──────────────────────────────────────────────
import DocCard from "./DocCard";

// ─── Types ───────────────────────────────────────────────────
import type { IDocument } from "@/app/types";

// ─── Prop Types ──────────────────────────────────────────────
type Props = {
  folders: Record<string, IDocument[]>;
};

// ─── Component ───────────────────────────────────────────────
export default function DocsList({ folders }: Props) {
  // ─── Hooks  ───────────────────────────────────────────────
  const { documents } = useDocuments();
  // ─── Render ───────────────────────────────────────────────
  return (
    <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 h-[70vh] overflow-y-auto">
      {documents.map((doc, index) => (
        <DocCard key={index} document={doc} folders={folders} />
      ))}
    </div>
  );
}
