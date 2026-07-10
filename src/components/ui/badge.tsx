import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default:
      "bg-violet-500/20 text-violet-300 border-violet-500/30",
    secondary:
      "bg-white/10 text-gray-300 border-white/10",
    outline:
      "border-white/20 text-gray-300",
    success:
      "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    warning:
      "bg-amber-500/20 text-amber-300 border-amber-500/30",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
