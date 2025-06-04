"use client";

import React from "react";
import { cn } from "@/app/utils/cn";

interface TagProps {
  label: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "disabled";
  className?: string;
}

const sizeStyles = {
  sm: " text-xs px-2 py-0.5 ",
  md: " text-sm px-3 py-1 ",
  lg: " text-base px-4 py-1.5 ",
};

const variantStyles = {
  primary: " bg-bg text-matchita-text border-border ",
  secondary: " bg-bg-alt text-matchita-text-alt border-border-alt ",
  disabled:
    " bg-bg-disabled text-matchita-text-disabled border-border-disabled ",
};

export default function Tag({
  label,
  size = "md",
  variant = "primary",
  className,
}: TagProps) {
  return (
    <div
      className={cn(
        "inline-block max-w-[160px] truncate rounded-full font-medium border",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      title={label}
    >
      {label}
    </div>
  );
}
