import { cn } from "@/lib/utils";

interface SectionDividerProps {
  className?: string;
}

export function SectionDivider({ className }: SectionDividerProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center py-12",
        className
      )}
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-chloe-pink/20 to-transparent" />
      <span className="mx-4 font-mono text-[10px] uppercase tracking-[0.5em] text-chloe-ash">
        ✝✝✝
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-chloe-pink/20 to-transparent" />
    </div>
  );
}
