"use client";

import { Input } from "@/src/components/ui/input";

interface DateRangeFilterProps {
  from: string;
  to: string;
  onChange: (range: { from: string; to: string }) => void;
}

/** Período no formato do <input type="date"> (yyyy-mm-dd). */
export function DateRangeFilter({ from, to, onChange }: DateRangeFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="date"
        aria-label="Data inicial"
        className="w-auto"
        value={from}
        max={to || undefined}
        onChange={(event) => onChange({ from: event.target.value, to })}
      />
      <span className="text-sm text-muted-foreground">até</span>
      <Input
        type="date"
        aria-label="Data final"
        className="w-auto"
        value={to}
        min={from || undefined}
        onChange={(event) => onChange({ from, to: event.target.value })}
      />
    </div>
  );
}
