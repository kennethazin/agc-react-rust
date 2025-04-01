import React from "react";
import { cn } from "@/utils/cn";

interface DSKYLedIndicatorProps {
  label: string;
  isActive?: boolean;
  className?: string;
  width?: string;
}

const DSKYLedIndicator: React.FC<DSKYLedIndicatorProps> = ({
  label,
  isActive = false,
  className = "",
  width = "w-2/5",
}) => {
  return (
    <div
      className={cn(
        `${width} text-xs h-fit rounded-sm uppercase`,
        isActive ? "bg-green-600" : "bg-green-700/60",
        className
      )}
    >
      {label}
    </div>
  );
};

export default DSKYLedIndicator;
