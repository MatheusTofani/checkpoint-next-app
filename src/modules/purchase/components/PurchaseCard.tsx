import type { PurchaseResponse } from "@/src/api/routes/purchase/purchaseModels";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/src/lib/format";
import { ItemsList } from "@/src/modules/common/components/ItemsList";
import { DeletePurchaseDialog } from "./DeletePurchaseDialog";

interface PurchaseCardProps {
  purchase: PurchaseResponse;
}

export function PurchaseCard({ purchase }: PurchaseCardProps) {
  const units = purchase.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formatDate(purchase.purchasedAt)}</CardTitle>
        <CardDescription>
          {purchase.items.length} {purchase.items.length === 1 ? "produto" : "produtos"}
        </CardDescription>
        <CardAction>
          <DeletePurchaseDialog purchase={purchase} />
        </CardAction>
      </CardHeader>

      <CardContent className="flex-1">
        <ItemsList
          items={purchase.items.map((item) => ({
            key: item.productId,
            name: item.name,
            quantity: item.quantity,
            total: item.price,
            href: item.link,
          }))}
        />
      </CardContent>

      <CardFooter className="justify-between gap-2 border-t bg-muted/50 py-3">
        <span className="text-xs text-muted-foreground">
          {units} {units === 1 ? "unidade" : "unidades"}
        </span>
        <span className="text-base font-semibold tabular-nums">
          {formatCurrency(purchase.total)}
        </span>
      </CardFooter>
    </Card>
  );
}

export function PurchaseCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3.5 w-1/3" />
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-4/5" />
      </CardContent>
      <CardFooter className="justify-between border-t bg-muted/50 py-3">
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-5 w-24" />
      </CardFooter>
    </Card>
  );
}
