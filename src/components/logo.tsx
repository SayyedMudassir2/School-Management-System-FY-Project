import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 whitespace-nowrap", className)}>
      <GraduationCap className="h-8 w-8 text-primary" />
      <span className="text-2xl font-bold text-white">Aedura</span>
    </div>
  );
}
