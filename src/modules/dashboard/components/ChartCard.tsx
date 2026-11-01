import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { cn } from "@/src/lib/utils";

interface ChartCardProps {
  title: string;
  description: string;
  loading?: boolean;
  empty?: boolean;
  className?: string;
  children: ReactNode;
}

export function ChartCard({ title, description, loading, empty, className, children }: ChartCardProps) {
  return (
    <Card className={cn("min-w-0", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : empty ? (
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
            Sem dados no período
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
