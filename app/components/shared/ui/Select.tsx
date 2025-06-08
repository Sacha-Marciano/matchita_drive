import React, { useState } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/app/utils/cn";

type Option = { name: string; value: string };

type SelectProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "disabled";
  label?: string;
  defaultText?: string;

  value: string | null;
  options: Option[] | null;
  onChange: (val: string | null) => void;
};

const Select = ({
  className,
  size = "md",
  variant = "primary",
  label,
  defaultText = "Select A Doc",

  value,
  options,
  onChange,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const classSM = "text-xs";
  const classMD = "text-base";
  const classLG = "text-xl";

  const classPRI = "bg-bg text-paul-text border-border";
  const classSEC = "bg-bg-alt text-paul-text-alt border-border-alt";
  const classDIS =
    "bg-bg-disabled text-paul-text-disabled border-border-disabled";

  const classGeneral = "px-4 py-2 border rounded-xl";

  const sizeClass = size === "sm" ? classSM : size === "lg" ? classLG : classMD;
  const variantClass =
    variant === "secondary"
      ? classSEC
      : variant === "disabled"
      ? classDIS
      : classPRI;

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium">{label}</label>}

      <Listbox
        value={value}
        onChange={(val) => {
          onChange(val);
          setIsOpen(false);
        }}
        disabled={variant === "disabled"}
      >
        <div className="relative">
          <ListboxButton
            className={cn(
              classGeneral,
              sizeClass,
              variantClass,
              "w-full flex justify-between items-center text-nowrap text-ellipsis",
              variant === "disabled"
                ? "cursor-not-allowed opacity-70"
                : "cursor-pointer",
              className
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="overflow-hidden text-ellipsis mr-1">
              {options?.find((opt) => opt.value === value)?.name ||
                defaultText}
            </span>
            <div className="flex items-center gap-2">
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </ListboxButton>

          {isOpen && (
            <ListboxOptions
              className={cn(
                "absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl border shadow-md",
                variantClass
              )}
            >
              {options?.map((option, index) => (
                <ListboxOption
                  key={index}
                  value={option.value}
                  className={({ selected }) =>
                    cn("cursor-pointer px-4 py-2", selected && "font-semibold")
                  }
                >
                  {option.name}
                </ListboxOption>
              ))}
            </ListboxOptions>
          )}
        </div>
      </Listbox>
    </div>
  );
};

export default Select;
