import { ExternalLinkIcon } from "lucide-react";
import { formatCurrency } from "@/src/lib/format";

interface ItemsListProps {
  items: { key: string; name: string; quantity: number; total: number; href?: string | null }[];
  /** Quantos itens mostrar antes do "+N itens". */
  max?: number;
}

export function ItemsList({ items, max = 3 }: ItemsListProps) {
  const hidden = items.length - max;

  return (
    <ul className="grid gap-1 text-sm">
      {items.slice(0, max).map((item) => (
        <li key={item.key} className="flex items-baseline justify-between gap-2">
          <span className="flex min-w-0 items-baseline gap-1">
            <span className="shrink-0 text-muted-foreground tabular-nums">{item.quantity}×</span>
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                title={item.href}
                className="inline-flex min-w-0 items-center gap-1 hover:underline"
              >
                <span className="truncate">{item.name}</span>
                <ExternalLinkIcon className="size-3 shrink-0 text-muted-foreground" />
              </a>
            ) : (
              <span className="truncate">{item.name}</span>
            )}
          </span>
          <span className="shrink-0 text-muted-foreground tabular-nums">
            {formatCurrency(item.total)}
          </span>
        </li>
      ))}
      {hidden > 0 && (
        <li className="text-xs text-muted-foreground">
          +{hidden} {hidden === 1 ? "item" : "itens"}
        </li>
      )}
    </ul>
  );
}
