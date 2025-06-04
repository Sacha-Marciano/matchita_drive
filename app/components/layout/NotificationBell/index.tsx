"use client";

import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { INotification } from "@/app/types";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/app/utils/cn";
import InviteNotif from "@/app/components/shared/ui/notifications/InviteNotif";

interface NotificationBellProps {
  notifications: INotification[];
}

export default function NotificationBell({
  notifications,
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [notificationList, setNotificationList] =
    useState<INotification[]>(notifications);

  const unread = notificationList.filter((n) => !n.read).length;

  // 👇 Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100 hover:text-matchita-text-alt transition cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96  bg-bg-alt text-matchita-text-alt border-2 rounded-xl shadow-lg z-50 border-white">
          <div className="p-3 font-semibold border-b">Notifications</div>

          <div
            className="overflow-y-auto max-h-80 rounded-xl mt-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {notificationList.length === 0 ? (
              <div className="p-4 text-sm text-matchita-500">
                No notifications yet.
              </div>
            ) : (
              notificationList
                .map((notif, idx) => {
                  if (notif.type === "invitation") {
                    return (
                      <InviteNotif
                        key={notif._id.toString()}
                        notif={notif}
                        notifList={notificationList}
                        setNotifList={setNotificationList}
                        onClose={() => setOpen(false)}
                      />
                    );
                  } else {
                    return (
                      <div
                        key={notif._id.toString() + idx}
                        className={cn(
                          "px-4 py-3 text-sm border-b last:border-0",
                          notif.read ? "bg-bg-alt" : "bg-matchita-300"
                        )}
                      >
                        <div className="font-medium">{notif.message}</div>
                        <div>Create component for this notif</div>

                        <div className="text-xs text-matchita-400 mt-1">
                          {formatDistanceToNow(new Date(notif.createdAt), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                    );
                  }
                })
                .reverse()
            )}
          </div>
        </div>
      )}
    </div>
  );
}
