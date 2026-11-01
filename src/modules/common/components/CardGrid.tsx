import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

interface CardGridProps {
  /** Enquanto a próxima página carrega, mantém os cards atuais esmaecidos. */
  stale?: boolean;
  children: ReactNode;
}

export function CardGrid({ stale, children }: CardGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        stale && "opacity-60"
      )}
    >
      {children}
    </div>
  );
}
