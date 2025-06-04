// components/ui/Tabs.tsx
import React, { useState } from "react";
import { cn } from "@/app/utils/cn";

type Tab = {
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "disabled";
  tabs: Tab[];
};

const Tabs = ({ className, size = "md", variant = "primary", tabs }: TabsProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const classSM = " text-xs ";
  const classMD = " text-base ";
  const classLG = " text-xl ";

  const classPRI = " bg-bg text-matchita-text border-border ";
  const classSEC = " bg-bg-alt text-matchita-text-alt border-border-alt ";
  const classDIS = " bg-bg-disabled text-matchita-text-disabled border-border-disabled ";

  const classGeneral = "px-4 py-2 border rounded-xl";

  const tabClass = (index: number) =>
    cn(
      classGeneral,
      size === "sm" ? classSM : size === "lg" ? classLG : classMD,
      variant === "secondary"
        ? classSEC
        : variant === "disabled"
        ? classDIS
        : classPRI,
      index === activeIndex ? "font-bold" : "opacity-70"
    );

  return (
    <div className={className}>
      <div className="flex gap-2 mb-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={tabClass(index) + " cursor-pointer "}
            onClick={() => setActiveIndex(index)}
            disabled={variant === "disabled"}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4 border rounded-xl">
        {tabs[activeIndex].content}
      </div>
    </div>
  );
};

export default Tabs;
