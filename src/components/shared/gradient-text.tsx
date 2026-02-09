import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4";
  variant?: "menheera" | "cyber" | "blood";
}

export function GradientText({
  children,
  className,
  as: Tag = "span",
  variant = "menheera",
}: GradientTextProps) {
  const gradientClass =
    variant === "cyber"
      ? "gradient-cyber"
      : variant === "blood"
      ? "gradient-blood"
      : "gradient-menheera";

  return <Tag className={cn(gradientClass, className)}>{children}</Tag>;
}
