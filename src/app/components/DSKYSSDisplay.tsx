import React from "react";
import { cn } from "@/utils/cn";

interface DSKYSSDisplayProps {
  children?: React.ReactNode;
  className?: string;
  isActive?: boolean;
  label?: string;
  digits?: number;
}

const DSKYSSDisplay: React.FC<DSKYSSDisplayProps> = ({
  children,
  className = "",
  isActive = false,
  label = "",
  digits = 2,
  ...props
}) => {
  // Generate default content with zeros if no children are provided
  const defaultContent = children || "0".repeat(digits);

  return (
    <div className="relative flex items-center justify-center">
      {isActive && <div className="absolute  bg-orange-200 opacity-80 " />}
      <div
        className={cn(
          "relative whitespace-pre-line z-10 h-full w-full font-semibold tracking-tight text-green-700/20  uppercase flex flex-col items-center justify-center rounded-sm  ds-digital",
          isActive && "text-green-900 ",
          className
        )}
        {...props}
      >
        {label && (
          <div className="text-3xl leading-[1.5rem]  px-0.5 ds-digital ">
            {label.replace(" ", "\n")}
          </div>
        )}
        <div className="text-xl">{defaultContent}</div>
      </div>
    </div>
  );
};

export default DSKYSSDisplay;
