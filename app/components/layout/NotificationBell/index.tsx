"use client";

// ─── Framework & Core Imports ─────────────────────────────────
import { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";

// ─── UI & Layout ─────────────────────────────────────────────
import { Bell } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────
import { INotification } from "@/app/types";

// ─── Utils / Services / Constants ────────────────────────────
import { cn } from "@/app/utils/cn";

// ─── Components ──────────────────────────────────────────────
import InviteNotif from "@/app/components/shared/ui/notifications/InviteNotif";

// ─── Prop Types ──────────────────────────────────────────────
interface NotificationBellProps {
  notifications: INotification[];
}

// ─── Component ───────────────────────────────────────────────
export default function NotificationBell({
  notifications,
}: NotificationBellProps) {
  // ─── State ────────────────────────────────────────────────
  const [open, setOpen] = useState(false);
  const [notificationList, setNotificationList] =
    useState<INotification[]>(notifications);

  // ─── Refs ─────────────────────────────────────────────────
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ─── Derived Values ───────────────────────────────────────
  const unread = notificationList.filter((n) => !n.read).length;

  // ─── Effects ──────────────────────────────────────────────
  // Close dropdown when clicking outside
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

  // ─── Render ───────────────────────────────────────────────
  return (
    <div className="relative" ref={dropdownRef}>
      {/* ── Notification Icon ── */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100 hover:text-paul-text-alt transition cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      {/* ── Dropdown Panel ── */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 bg-bg-alt text-paul-text-alt border-2 rounded-xl shadow-lg z-50 border-white">
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

            {/* ── Notification Content ── */}
            {notificationList.length === 0 ? (
              <div className="p-4 text-sm text-paul-500">
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
                          notif.read ? "bg-bg-alt" : "bg-paul-300"
                        )}
                      >
                        <div className="font-medium">{notif.message}</div>
                        <div>Create component for this notif</div>
                        <div className="text-xs text-paul-400 mt-1">
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
