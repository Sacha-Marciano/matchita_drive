"use client";
import { Pencil, Check } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Spinner from "../Animations/Spinner";
import { cn } from "@/app/utils/cn";

type EditableDisplayProps = {
  text: string;
  handleEdit: (newValue: string) => Promise<void>;
  size?: "sm" | "md" | "lg" | "full";
  variant?: "primary" | "secondary" | "disabled";
};

const EditableDisplay = ({
  text,
  handleEdit,
  size = "md",
  variant = "primary",
}: EditableDisplayProps) => {
  const [isEditModeOn, setIsEditModeOn] = useState(false);
  const [value, setValue] = useState(text);
  const [isLoading, setIsLoading] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await handleEdit(value);
      setIsEditModeOn(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Exit edit mode on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isEditModeOn &&
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsEditModeOn(false);
        setValue(text); // optional: reset value to original text
      }
    };

    setValue(text);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditModeOn, text]);

  const sizeClass =
    size === "sm"
      ? "text-xs"
      : size === "lg"
      ? "text-xl font-bold"
      : size === "full"
      ? "text-xl font-bold"
      : "text-base";

  const inputClass =
    size === "sm"
      ? "w-[120px]"
      : size === "lg"
      ? "w-[220px]"
      : size === "full"
      ? "w-full"
      : "w-[180px]";

  const paragraphClass =
    size === "sm"
      ? "max-w-[120px]"
      : size === "lg"
      ? "max-w-[220px]"
      : size === "full"
      ? "w-full"
      : "max-w-[180px]";

  const variantText =
    variant === "secondary"
      ? "text-matchita-text-alt"
      : variant === "disabled"
      ? "text-matchita-text-disabled"
      : "text-matchita-text";

  const inputStyle =
    variant === "secondary"
      ? "bg-bg-alt text-matchita-text-alt"
      : variant === "disabled"
      ? "bg-bg-disabled text-matchita-text-disabled"
      : "bg-bg text-matchita-text";

  return (
    <div className="mr-4" ref={wrapperRef}>
      {!isEditModeOn && (
        <div
          className={cn(
            "flex items-center gap-2 cursor-pointer group",
            sizeClass,
            variantText
          )}
          onClick={() => variant !== "disabled" && setIsEditModeOn(true)}
        >
          <p
            className={cn(
              "overflow-hidden overflow-ellipsis text-nowrap",
              paragraphClass
            )}
          >
            {value}
          </p>
          {variant !== "disabled" && (
            <Pencil
              size={16}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
          )}
        </div>
      )}

      {isEditModeOn && (
        <div className="flex items-center gap-2">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={variant === "disabled"}
            className={cn(
              "overflow-hidden overflow-ellipsis px-1 rounded-lg border border-matchita-800",
              sizeClass,
              inputClass,
              inputStyle
            )}
          />
          {isLoading ? (
            <Spinner
              variant={variant === "primary" ? "primary" : "secondary"}
            />
          ) : (
            <Check
              size={16}
              className={cn(
                "hover:scale-110 cursor-pointer",
                variant === "disabled" && "cursor-not-allowed opacity-50"
              )}
              onClick={variant === "disabled" ? undefined : handleSubmit}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default EditableDisplay;
