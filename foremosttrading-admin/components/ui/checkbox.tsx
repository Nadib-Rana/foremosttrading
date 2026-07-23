"use client";

import React from "react";
import { Check } from "lucide-react";

interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  id?: string;
}

export function Checkbox({
  checked = false,
  onCheckedChange,
  onClick,
  className = "",
  id,
}: CheckboxProps) {
  return (
    <div
      id={id}
      onClick={(e) => {
        if (onClick) onClick(e);
        if (onCheckedChange) onCheckedChange(!checked);
      }}
      className={`h-4 w-4 rounded border flex items-center justify-center cursor-pointer transition-colors select-none ${
        checked
          ? "bg-primary border-primary text-primary-foreground"
          : "bg-white border-gray-300 hover:border-gray-400"
      } ${className}`}
    >
      {checked && <Check className="h-3 w-3 text-white stroke-[3]" />}
    </div>
  );
}
