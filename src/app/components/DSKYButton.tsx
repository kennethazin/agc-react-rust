"use client";
import React from "react";

type ButtonVariant = "default" | "text";

interface DSKYButtonProps {
  children: string;
  className?: string;
  variant?: ButtonVariant;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const DSKYButton: React.FC<DSKYButtonProps> = ({
  children,
  className,
  variant = "default",
  onClick,
  ...props
}) => {
  const variantClasses = {
    default: "",
    text: "text-[0.7rem]",
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = new Audio("/button-sound.mp3");
    audio.play();

    if (onClick) onClick(e);
  };

  return (
    <div
      className={`bg-black hover:bg-black/80 m-0 p-0 text-white w-11 h-11 flex items-center justify-center border border-neutral-600 rounded-sm ${
        variantClasses[variant] || ""
      } ${className || ""}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default DSKYButton;
