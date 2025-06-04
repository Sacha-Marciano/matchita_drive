import { INotification } from "@/app/database/models/users";
import { cn } from "@/app/utils/cn";
import { formatDistanceToNow } from "date-fns";
import React, { Dispatch, SetStateAction } from "react";
import Button from "../ui/Button";
import { useRouter } from "next/navigation";

const InviteNotif = ({
  notif,
  notifList,
  setNotifList,
  onClose
}: {
  notif: INotification;
  notifList: INotification[];
  setNotifList: Dispatch<SetStateAction<INotification[]>>;
  onClose: () => void;
}) => {
  const router = useRouter();
  const handleAccept = async () => {
    const acceptRes = await fetch(`/api/notif/${notif._id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "accept", notif: notif }),
    });

    if (acceptRes.status === 200) {
      router.push(`/room/${notif.metadata?.payload}`);
      const filteredNotifList = notifList.filter((item) => item._id != notif._id);
      const newNotif = { ...notif, read: true } as INotification;
      setNotifList([...filteredNotifList, newNotif]);
onClose()  ;
    }
    // const acceptData = await acceptRes.json();
  };

  const handleRefuse = async () => {};
  return (
    <div
      key={notif._id.toString()}
      className={cn("p-2 border-b last:border-0")}
    >
      <div
        className={cn(
          "px-4 py-3 text-sm rounded-xl",
          notif.read ? "bg-bg-alt" : "bg-matchita-300"
        )}
      >
        <div className="font-medium">{notif.message}</div>
        {!notif.read && (
          <div className="w-full flex items-center justify-between mt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleRefuse()}
            >
              Refuse
            </Button>
            <Button size="sm" onClick={() => handleAccept()}>
              Accept
            </Button>
          </div>
        )}
        <div className="text-xs text-matchita-400 mt-1">
          {formatDistanceToNow(new Date(notif.createdAt), {
            addSuffix: true,
          })}
        </div>
      </div>
    </div>
  );
};

export default InviteNotif;
