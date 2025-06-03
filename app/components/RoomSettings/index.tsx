"use client";
import React, { useState } from "react";
import Button from "../ui/Button";
import { useRouter } from "next/navigation";
import { IRoom } from "@/app/database/models/rooms";
import { Dialog } from "@headlessui/react";

const RoomSettings = ({ room }: { room: IRoom }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  const handleDeleteRoom = async () => {
    try {
      const deleteRes = await fetch(`/api/rooms/${room._id}`, {
        method: "DELETE",
      });

      if (deleteRes.status === 200) {
        router.push("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full h-full min-h-[70vh] flex flex-col justify-between items-start">
      <div className="bg-bg-alt w-full rounded-xl p-4">
        <div className="flex items-center justify-between">
            <p className="font-bold text-matchita-text-alt">Room&apos;s Name</p>
            <p className="font-semibold text-matchita-text-alt">{room.title}</p>
        </div>
      </div>
      <Button variant="delete" onClick={() => setIsModalOpen(true)}>
        Delete Room
      </Button>

      {/* Delete Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center gap-6 p-4 text-center">
          <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-xl text-matchita-text-alt space-y-2">
            <h2 className="text-2xl font-bold">
              Deleting a room is irreversible !
            </h2>
            <p className="font-semibold text-lg">
              Are you sure you want to delete this room and all its documents ?
            </p>
            <div className="flex flex-col gap-2 w-full">
              <p>
                Type the room&apos;s name &quot;<strong>{room.title}</strong>&quot; to delete
                it
              </p>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="border-2 rounded-lg border-border-alt px-2 py-1"
              />
            </div>
            <div className="flex items-center justify-between mt-6">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant={input !== room.title ? "delete-disable" : "delete"}
                onClick={handleDeleteRoom}
                disabled={input !== room.title}
              >
                Delete room
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default RoomSettings;
