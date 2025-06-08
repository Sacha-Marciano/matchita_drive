"use client";

// ─── Framework & Core Imports ─────────────────────────────────
import { useState } from "react";
import { useRouter } from "next/navigation";

// ─── Custom Hooks ───────────────────────────────────────────────────
import { useRooms } from "@/app/contexts/RoomsContext";

// ─── Components ──────────────────────────────────────────────
import BaseModal from "../../shared/modals/BaseModal";

// ─── UI & Layout ─────────────────────────────────────────────
import Button from "../../shared/ui/Button";

// ─── Prop Types ──────────────────────────────────────────────
type Props = {
  isOpen: boolean;
  onClose: () => void;
};

// ─── Component ───────────────────────────────────────────────
export default function AddRoomModal({ isOpen, onClose }: Props) {
  // ─── Hooks ────────────────────────────────────────────────
  const router = useRouter();
  const { rooms, setRooms } = useRooms();

  // ─── State ────────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [avatar, setAvatar] = useState("");

  // ─── Handlers ─────────────────────────────────────────────
  const handleSubmit = async () => {
    let newAvatar = avatar;
    if (newAvatar === "") {
      const randIndex = Math.floor(Math.random() * 5 + 1); // 1 to 5
      newAvatar = `/avatars/rooms/${randIndex}.png`;
    }

    const res = await fetch("/api/rooms", {
      method: "POST",
      body: JSON.stringify({ title, avatar: newAvatar }),
    });

    const room = await res.json();

    if (res.ok) {
      onClose();
      setTitle("");
      setAvatar("");
      setRooms([...rooms, room.data]);
      router.refresh();
    }
  };

  // ─── Render ───────────────────────────────────────────────
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">Create a Room</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Room Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Custom Avatar (optional)
          </label>
          <input
            type="text"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>
        <div className="flex justify-end space-x-2 pt-2">
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create</Button>
        </div>
      </div>
    </BaseModal>
  );
}
