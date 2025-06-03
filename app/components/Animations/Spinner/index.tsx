import { motion } from "framer-motion";
import clsx from "clsx";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
};

const sizeMap = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-4",
};

const variantMap = {
  primary: "border-matchita-200 border-t-transparent",
  secondary: "border-matchita-800 border-t-transparent",
};

export default function Spinner({
  size = "md",
  variant = "primary",
}: SpinnerProps) {
  const spinnerClass = clsx(
    "rounded-full animate-spin",
    sizeMap[size],
    variantMap[variant]
  );

  return (
    <div className="flex items-center justify-center mr-2">
      <motion.div
        className={spinnerClass}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
        }}
      />
    </div>
  );
}
