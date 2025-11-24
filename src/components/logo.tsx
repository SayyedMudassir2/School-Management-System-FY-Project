import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, hideText = false }: { className?: string, hideText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3 whitespace-nowrap", className)}>
      <GraduationCap className="h-8 w-8 text-primary shrink-0" />
      {!hideText && (
        <span className="text-2xl font-bold text-foreground">Aedura</span>
      )}
    </div>
  );
}
