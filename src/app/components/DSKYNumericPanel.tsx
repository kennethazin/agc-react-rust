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
    <div className="relative flex items-center justify-center ">
      {isActive && (
        <div className="absolute w-10 h-10 bg-green-500 p-5  rounded-sm" />
      )}
      <div
        className={cn(
          "relative whitespace-pre-line z-10 h-full w-full font-semibold tracking-tight text-black uppercase flex flex-col items-center justify-center rounded-sm ",

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
