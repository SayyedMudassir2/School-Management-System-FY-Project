
import { cn } from "@/lib/utils";

const SparkleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        {...props}
    >
        <path d="M12 2.6923L13.1305 6.86955L13.4696 7.86955H14.5098H18.899L15.3451 10.3696L14.5304 10.9565L14.8695 11.9565L16.0 16.1337L12.4461 13.6337L11.6314 13.0468L12 12.8023L12 2.6923Z" fill="url(#paint0_linear_1_2)"/>
        <path d="M8 7.6923L9.1305 11.8695L9.4696 12.8695H10.5098H14.899L11.3451 15.3696L10.5304 15.9565L10.8695 16.9565L12.0 21.1337L8.4461 18.6337L7.6314 18.0468L8 17.8023L8 7.6923Z" fill="url(#paint1_linear_1_2)"/>
        <defs>
            <linearGradient id="paint0_linear_1_2" x1="14" y1="3" x2="14" y2="16" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FDE047"/>
                <stop offset="1" stopColor="#F97316"/>
            </linearGradient>
            <linearGradient id="paint1_linear_1_2" x1="10" y1="8" x2="10" y2="21" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FDE047"/>
                <stop offset="1" stopColor="#F97316"/>
            </linearGradient>
        </defs>
    </svg>
)

export function SmallTitle({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn(
            "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium",
            "bg-secondary/70 border border-border/20 shadow-sm text-foreground/80",
            className
        )}>
            <SparkleIcon className="h-5 w-5 -ml-1" />
            <span>{children}</span>
        </div>
    )
}
