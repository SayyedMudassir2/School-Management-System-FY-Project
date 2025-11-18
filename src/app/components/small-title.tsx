
import { cn } from "@/lib/utils";

export function SmallTitle({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn(
            "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium",
            "bg-secondary/70 border border-border/20 shadow-sm text-foreground/80",
            className
        )}>
            <span>✨</span>
            <span>{children}</span>
        </div>
    )
}
