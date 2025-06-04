"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../shared/ui/Button";
import { IRoom } from "@/app/types";
import BaseModal from "../../shared/modals/BaseModal";

export default function AddRoomModal({
  isOpen,
  onClose,
  setRooms,
  rooms,
}: {
  isOpen: boolean;
  onClose: () => void;
  setRooms: Dispatch<SetStateAction<IRoom[]>>;
  rooms: IRoom[];
}) {
  const [title, setTitle] = useState("");
  const [avatar, setAvatar] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    let newAvatar = avatar;
    if (newAvatar === "") {
      const randIndex = Math.floor(Math.random() * 5 + 1); // 0 to 5
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
      router.refresh(); // Refresh room list
    }
  };

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
          <Button onClick={() => handleSubmit()}>Create</Button>
        </div>
      </div>
    </BaseModal>
  );
}
