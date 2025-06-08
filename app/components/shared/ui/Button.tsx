import { cn } from "@/app/utils/cn";
import React from "react";

type ButtonProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "disabled" | "delete" | "delete-disable";
  onClick?: () => void;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  className,
  size = "md",
  variant = "primary",
  onClick,
  children,
  ...props
}: ButtonProps) => {
  const classSM = " text-xs  ";
  const classMD = " text-base ";
  const classLG = " text-xl ";

  const classPRI = " bg-bg text-paul-text border-border ";
  const classSEC = " bg-bg-alt text-paul-text-alt border-border-alt ";
  const classDIS =
    " bg-bg-disabled text-paul-text-disabled border-border-disabled ";
  const classDEL = " bg-red-500 text-paul-text border-white ";
  const classDELDIS = " bg-red-200 text-paul-text border-white ";
  const classGeneral = "px-4 py-2 border rounded-full cursor-pointer";

  return (
    <button
      {...props}
      onClick={onClick}
      className={cn(
        size === "sm" ? classSM : size === "lg" ? classLG : classMD,
        variant === "secondary"
          ? classSEC
          : variant === "disabled"
          ? classDIS
          : variant === "delete"
          ? classDEL
          : variant === "delete-disable"
          ? classDELDIS
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
