"use client";

// ─── Framework & Core Imports ─────────────────────────────────
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

// ─── Prop Types ──────────────────────────────────────────────
type RoomCardProps = {
  id: string;
  title: string;
  avatar: string;
  documentCount: number;
  folders: string[];
  tags: string[];
  viewerCount: number;
  createdAt: Date;
  isOwner: boolean;
};
// ─── Component ───────────────────────────────────────────────
export default function RoomCard({
  id,
  title,
  avatar,
  documentCount,
  folders,
  tags,
  viewerCount,
  createdAt,
  isOwner,
}: RoomCardProps) {
  // ─── Render ───────────────────────────────────────────────
  const displayTags = tags.slice(0, 2);
  const extraTagCount = tags.length - displayTags.length;

  const displayFolders = folders.slice(0, 2);
  const extraFolderCount = folders.length - displayFolders.length;

  return (
    <Link href={`/room/${id}`} className="hover:scale-105">
      <div className="border flex flex-col justify-between gap-4 p-5 rounded-2xl shadow-md hover:shadow-lg transition bg-bg-alt cursor-pointer space-y-4 text-matchita-text-alt">
        {/* ── Header: Avatar + Title + Owner Badge ───────────────────── */}
        <div className="flex items-center gap-4">
          <Image
            src={avatar}
            alt="Room Avatar"
            width={56}
            height={56}
            className="w-14 h-14 rounded-xl border-2 border-matchita-300"
          />
          <div className="flex flex-col w-[78%]">
            <p className="text-2xl font-semibold text-matchita-text-alt text-nowrap overflow-hidden overflow-ellipsis">
              {title}
            </p>
            {isOwner && (
              <span className="text-xs text-matchita-200 bg-border-alt px-2 pb-0.5 rounded-md w-fit">
                Owner
              </span>
            )}
          </div>
        </div>

        {/* ── Stats: Document, Folder, Tag, Viewer, Date ───────────── */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-matchita-500">
          <span>🗂️ {documentCount} document(s)</span>
          <span>📁 {folders.length} folder(s)</span>
          <span>🏷️ {tags.length} tag(s)</span>
          <span>👥 {viewerCount + 1} participant(s)</span>
          <span>🕒 Created {formatDistanceToNow(new Date(createdAt))} ago</span>
        </div>

        {/* ── Previews: Tags & Folders ───────────────────────────── */}
        <div className="space-y-4">
          {/* Tag Preview */}
          {tags.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {displayTags.map((tag) => (
                <span
                  key={tag}
                  className="bg-matchita-100 text-matchita-600 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {extraTagCount > 0 && (
                <span className="text-matchita-400">+{extraTagCount} more</span>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-matchita-100 text-matchita-600 px-2 py-0.5 rounded-full">
                No tags
              </span>
            </div>
          )}

          {/* Folder Preview */}
          {folders.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {displayFolders.map((folder) => (
                <span
                  key={folder}
                  className="bg-matchita-200 text-matchita-700 px-2 py-0.5 rounded-lg"
                >
                  {folder}
                </span>
              ))}
              {extraFolderCount > 0 && (
                <span className="text-matchita-400">
                  +{extraFolderCount} more
                </span>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-matchita-200 text-matchita-700 px-2 py-0.5 rounded-lg">
                No folders
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
