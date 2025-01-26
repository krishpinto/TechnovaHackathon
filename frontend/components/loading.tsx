import { cn } from "@/lib/utils";

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
}

export function Loading({
  text = "Loading...",
  className,
  ...props
}: LoadingProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div
        className={cn(
          "relative p-20 rounded-lg text-center",
          "before:absolute before:inset-0 before:rounded-lg before:border-2 before:border-dashed before:border-muted-foreground/50",
          "after:absolute after:inset-0 after:rounded-lg after:border-2 after:border-dashed after:border-muted-foreground/50",
          "before:animate-[spin_10s_linear_infinite] after:animate-[spin_5s_linear_infinite]",
          className
        )}
        {...props}
      >
        <span className="text-lg text-foreground">{text}</span>
      </div>
    </div>
  );
}
