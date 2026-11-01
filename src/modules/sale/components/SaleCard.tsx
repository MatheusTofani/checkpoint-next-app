import { StoreIcon, GlobeIcon, UserIcon } from "lucide-react";
import type { SaleResponse } from "@/src/api/routes/sale/saleModels";
import { Badge } from "@/src/components/ui/badge";
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
import { DeleteSaleDialog } from "./DeleteSaleDialog";

interface SaleCardProps {
  sale: SaleResponse;
}

export function SaleCard({ sale }: SaleCardProps) {
  const LocationIcon = sale.location === "Loja" ? StoreIcon : GlobeIcon;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formatDate(sale.soldAt)}</CardTitle>
        <CardDescription className="flex items-center gap-1.5">
          <UserIcon className="size-3.5 shrink-0" />
          <span className="truncate">{sale.lead?.name ?? "Sem lead"}</span>
        </CardDescription>
        <CardAction>
          <DeleteSaleDialog sale={sale} />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary">{sale.paymentMethod}</Badge>
          <Badge variant="outline">
            <LocationIcon />
            {sale.location}
          </Badge>
        </div>
        <ItemsList
          items={sale.items.map((item) => ({
            key: item.productId,
            name: item.name,
            quantity: item.quantity,
            total: item.total,
          }))}
        />
      </CardContent>

      <CardFooter className="justify-between gap-2 border-t bg-muted/50 py-3">
        <span className="text-xs text-muted-foreground">
          {sale.appliedDiscount > 0 && (
            <>
              <s className="tabular-nums">{formatCurrency(sale.subtotal)}</s>
              <br />-{formatCurrency(sale.appliedDiscount)} desconto
            </>
          )}
        </span>
        <span className="text-base font-semibold tabular-nums">
          {formatCurrency(sale.total)}
        </span>
      </CardFooter>
    </Card>
  );
}

export function SaleCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3.5 w-1/3" />
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-16 rounded-4xl" />
          <Skeleton className="h-5 w-14 rounded-4xl" />
        </div>
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-4/5" />
      </CardContent>
      <CardFooter className="justify-end border-t bg-muted/50 py-3">
        <Skeleton className="h-5 w-24" />
      </CardFooter>
    </Card>
  );
}
