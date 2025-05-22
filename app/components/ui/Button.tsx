import { cn } from "@/app/utils/cn";
import React from "react";

type ButtonProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "disabled";
  onClick: () => void;
  children: React.ReactNode;
};

const Button = ({
  className,
  size = "md",
  variant = "primary",
  onClick,
  children,
}: ButtonProps) => {
  const classSM = " text-xs  ";
  const classMD = " text-base ";
  const classLG = " text-xl ";

  const classPRI = " bg-bg text-matchita-text border-border ";
  const classSEC = " bg-bg-alt text-matchita-text-alt border-border-alt ";
  const classDIS =
    " bg-bg-disabled text-matchita-text-disabled border-border-disabled ";

  const classGeneral = "px-4 py-2 border rounded-xl";

  return (
    <button
      onClick={onClick}
      className={cn(
        size === "sm" ? classSM : size === "lg" ? classLG : classMD,
        variant === "secondary"
          ? classSEC
          : variant === "disabled"
          ? classDIS
          : classPRI,
        classGeneral,
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
