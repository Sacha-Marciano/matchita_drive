import React, { useState } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronDown, ChevronUp, X as Cross } from "lucide-react";
import { cn } from "@/app/utils/cn"; // Ensure this helper works

type SelectProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "disabled";

  label: string;
  value: string | null;
  options: { name: string; value: string }[];
  onChange: (value: string) => void;
  handleDeselect: () => void;
};

const Select = ({
  className,
  size = "md",
  variant = "primary",
  label,
  value,
  options,
  onChange,
  handleDeselect,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const classSM = "text-xs";
  const classMD = "text-base";
  const classLG = "text-xl";

  const classPRI = "bg-bg text-matchita-text border-border";
  const classSEC = "bg-bg-alt text-matchita-text-alt border-border-alt";
  const classDIS =
    "bg-bg-disabled text-matchita-text-disabled border-border-disabled";

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
      <label className="text-sm font-medium">{label}</label>

      <Listbox
        value={value}
        onChange={(val) => {
          onChange(val || "");
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
              "w-full flex justify-between items-center",
              variant === "disabled" ? "cursor-not-allowed opacity-70" : "cursor-pointer",
              className
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>{value || "Select an option"}</span>
            <div className="flex items-center gap-2">
              {value && variant !== "disabled" && (
                <Cross
                  className="w-4 h-4 text-red-500 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeselect();
                    setIsOpen(false);
                  }}
                />
              )}
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
              {options.map((option, index) => (
                <ListboxOption
                  key={index}
                  value={option.value}
                  className={({ active, selected }) =>
                    cn(
                      "cursor-pointer px-4 py-2",
                      active && "bg-gray-100",
                      selected && "font-semibold"
                    )
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
