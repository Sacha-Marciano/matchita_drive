import React, { useState } from "react";
import { Search } from "lucide-react";
import { IUser } from "@/app/types";
import Button from "../../shared/ui/Button";
import { useSession } from "next-auth/react";
import { IRoom } from "@/app/types";
import BaseModal from "../../shared/modals/BaseModal";

const InviteUserModal = ({
  isOpen,
  onClose,
  room,
}: {
  isOpen: boolean;
  onClose: () => void;
  room: IRoom;
}) => {
  const { data: session } = useSession();
  const [userEmail, setUserEmail] = useState<string>("");
  const [foundUser, setFoundUser] = useState<IUser | null | "not-found">(null);
  const [invited, setInvited] = useState<boolean>(false);

  const handleUserSearch = async () => {
    setInvited(false);
    const userRes = await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail }),
    });

    const userData = await userRes.json();

    if (userData.data == null) {
      setFoundUser("not-found");
      return;
    }

    setFoundUser(userData.data);
  };
  const handleUserInvite = async () => {
    if (foundUser == null || foundUser === "not-found") return;

    setInvited(false);
    // First send the invite to the invite
    const inviteRes = await fetch("/api/notif", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: foundUser._id,
        payload: {
          type: "invitation",
          message: `You have been invited by ${session?.user?.email} to view room "${room.title}"`,
          metadata: { type: "roomId", payload: room._id },
        },
      }),
    });
    const inviteData = await inviteRes.json();

    if (inviteRes.status === 201) {
      setInvited(true);
    }

    console.log(inviteData);
    // Second send confirmation to the user
  };
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div>
        <h2 className="text-2xl font-bold mb-10">Invite a user</h2>
        {/* Input */}
        <div className="flex items-center gap-2 w-full">
          <label htmlFor="invite-email" className="text-nowrap">
            User email
          </label>
          <input
            id="invite-email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="ml-2 border border-matchita-500 rounded-lg focus:outline-matchita-700 px-2 py-1 w-full "
          />
          <Search
            size={36}
            onClick={() => handleUserSearch()}
            className="cursor-pointer"
          />
        </div>
      </div>
      {/* Search Result */}
      {foundUser === "not-found" && (
        <div className="flex flex-col items-center justify-center h-full flex-1">
          <h2>No user was found</h2>
          <p>Please check the user email</p>
        </div>
      )}
      {foundUser !== "not-found" && foundUser != null && (
        <div className="flex flex-col items-center justify-center h-full flex-1 gap-4">
          <h2 className="text-xl font-semibold justify-self-start">
            1 user was found
          </h2>
          <div className="w-full p-2 border border-matchita-600 rounded-lg flex justify-between items-center">
            <p>{foundUser.name}</p>
            <Button
              size="sm"
              variant={invited ? "disabled" : "primary"}
              disabled={invited}
              onClick={() => {
                handleUserInvite();
              }}
            >
              {invited ? "Invited !" : "Invite"}
            </Button>
          </div>
        </div>
      )}
    </BaseModal>
  );
};

export default InviteUserModal;
