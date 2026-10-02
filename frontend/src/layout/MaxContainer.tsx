import React from "react";
import { cn } from "@/lib/utils";

type MaxContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function MaxContainer({
  children,
  className,
}: MaxContainerProps) {
  return (
    <div className={cn("mx-auto mb-10 max-w-[1800px]", className)}>{children}</div>
  );
}
