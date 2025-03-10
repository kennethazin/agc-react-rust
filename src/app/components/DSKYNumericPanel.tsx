import React from "react";
import { cn } from "@/utils/cn";

interface DSKYStatusPanelProps {
  children?: React.ReactNode;
  className?: string;
  isActive?: boolean;
  label?: string; // Keep as string
}

const DSKYStatusPanel: React.FC<DSKYStatusPanelProps> = ({
  children,
  className = "",
  isActive = false,
  label,
  ...props
}) => {
  return (
    <div className="relative flex items-center justify-center">
      {isActive && <div className="absolute  bg-orange-200 opacity-80 " />}
      <div
        className={cn(
          "relative whitespace-pre-line z-10 h-full w-full font-semibold tracking-tight text-black uppercase flex flex-col items-center justify-center rounded-sm ",
          isActive && "bg-green-700",
          className
        )}
        {...props}
      >
        {label && (
          <div className="text-[0.7rem] leading-[0.7rem] px-0.5">
            {label.replace(" ", "\n")}
          </div>
        )}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
};

export default DSKYStatusPanel;
