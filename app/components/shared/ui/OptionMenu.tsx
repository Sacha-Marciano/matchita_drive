// components/OptionsMenu.tsx
import { useState, useRef, useEffect } from "react";

interface OptionsMenuProps {
  children: React.ReactNode;
}

export default function OptionsMenu({ children }: OptionsMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className=" p-2 rounded-full hover:bg-muted transition cursor-pointer"
      >
        <span className="text-xl text-matchita-text-alt ">⋮</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 rounded-lg border border-border bg-bg-alt shadow-lg z-50">
          <div className="p-2">{children}</div>
        </div>
      )}
    </div>
  );
}
