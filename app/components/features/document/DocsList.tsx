"use client";

// ─── Framework & Core Imports ─────────────────────────────────
import { Dispatch, SetStateAction } from "react";

// ─── Components ──────────────────────────────────────────────
import DocCard from "./DocCard";

// ─── Types ───────────────────────────────────────────────────
import type { IDocument, IRoom } from "@/app/types";

// ─── Prop Types ──────────────────────────────────────────────
type Props = {
  docs: IDocument[];
  setDocList: Dispatch<SetStateAction<IDocument[]>>;
  room: IRoom;
  folders : Record<string, IDocument[]>
};

// ─── Component ───────────────────────────────────────────────
export default function DocsList({ docs, setDocList, room, folders }: Props) {
  // ─── Render ───────────────────────────────────────────────
  return (
    <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 h-[70vh] overflow-y-auto">
      {docs.map((doc, index) => (
        <DocCard
          key={index}
          document={doc}
          docList={docs}
          setDocList={setDocList}
          room={room}
          folders={folders}
        />
      ))}
    </div>
  );
}
