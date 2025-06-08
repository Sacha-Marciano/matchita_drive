"use client";

// ─── Framework & Core Imports ─────────────────────────────────────────────
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

// ─── Types ────────────────────────────────────────────────────
import type { IDocument } from "@/app/types";

// ─── UI & Layout ──────────────────────────────────────────────
import Button from "../../shared/ui/Button";
import { ChevronDown, ChevronUp } from "lucide-react";

// ─── Props ────────────────────────────────────────────────────
type Props = {
  folderName: string;
  documents: IDocument[];
};

// ─── Component ────────────────────────────────────────────────
export default function FolderCard({ folderName, documents }: Props) {
  // ─── State ─────────────────────────────────────────────────
  const [isOpen, setIsOpen] = useState(false);

  // ─── Derived Data ──────────────────────────────────────────
  const allTags = documents.flatMap((doc) => doc.title);
  const docTitles = [...new Set(allTags)].slice(0, 4);
  const extraTags = allTags.length - docTitles.length;

  const newestDoc = documents.reduce((latest, doc) =>
    new Date(doc.createdAt) > new Date(latest.createdAt) ? doc : latest
  );

  // ─── Render ────────────────────────────────────────────────
  return (
    <div className="w-full border p-5 rounded-2xl shadow-md hover:shadow-lg transition bg-bg-alt text-paul-text-alt space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{folderName}</h2>
        <span className="text-sm text-paul-400">
          {documents.length} document{documents.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {docTitles.length > 0 ? (
          docTitles.map((tag) => (
            <span
              key={tag}
              className="bg-paul-100 text-paul-600 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))
        ) : (
          <span className="bg-paul-100 text-paul-600 px-2 py-0.5 rounded-full">
            No tags
          </span>
        )}
        {extraTags > 0 && (
          <span className="text-paul-400">+{extraTags} more</span>
        )}
      </div>

      {/* Footer */}
      <div className="w-full flex items-center justify-between">
        <div className="text-sm text-paul-500">
          🕒 Last added: {formatDistanceToNow(new Date(newestDoc.createdAt))} ago
        </div>
        <Button size="md" onClick={() => setIsOpen(!isOpen)}>
          <div className="flex items-center gap-1">
            <p>{isOpen ? "Close" : "Open"}</p>
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </Button>
      </div>

      {/* Expandable Document List */}
      {isOpen && (
        <div className="bg-bg w-full p-4 flex flex-col gap-2 rounded-2xl">
          {documents.map((doc, index) => (
            <div
              key={index}
              className="bg-bg-alt rounded-2xl p-2 w-full flex items-center justify-between"
            >
              <h2 className="font-semibold">{doc.title}</h2>
              <Button
                size="sm"
                onClick={() => window.open(doc.googleDocsUrl, "_blank")}
              >
                Open
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
