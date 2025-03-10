import React from "react";
import { cn } from "@/utils/cn";

interface DSKYStatusPanelProps {
  children?: React.ReactNode;
  className?: string;
  isActive?: boolean;
  label?: string;
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
      {isActive && (
        <div className="absolute w-full h-full bg-orange-200 opacity-80 " />
      )}
      <div
        className={cn(
          "relative z-10 h-full w-full shadow-[inset_2px_1px_1.5px_rgba(0,0,0,0.2)] bg-green-100/20 font-semibold tracking-tight text-black uppercase flex flex-col items-center justify-center rounded-sm ",
          isActive && "animate-blink bg-orange-300-500/60",
          className
        )}
        {...props}
      >
        {label && (
          <div className="text-[0.7rem] leading-[0.7rem] px-0.5">{label}</div>
        )}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
};

export default DSKYStatusPanel;
