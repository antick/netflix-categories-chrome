// shadcn/ui Input.
import type * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-lg border border-input bg-background px-3.5 text-[15px] text-foreground placeholder:text-muted-foreground transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
