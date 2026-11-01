import { PackageIcon } from "lucide-react";
import type { ProductResponse } from "@/src/api/routes/product/productModels";
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
import { DeleteProductDialog } from "./DeleteProductDialog";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

interface ProductCardProps {
  product: ProductResponse;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <PackageIcon className="size-5" />
        </div>
        <CardTitle className="line-clamp-1">{product.name}</CardTitle>
        <CardDescription>{product.brand}</CardDescription>
        <CardAction>
          <DeleteProductDialog product={product} />
        </CardAction>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="line-clamp-3 text-muted-foreground">
          {product.description || "Sem descrição"}
        </p>
      </CardContent>

      <CardFooter className="justify-between gap-2 border-t bg-muted/50 py-3">
        <Badge variant="secondary" className="max-w-1/2">
          <span className="truncate">{product.category}</span>
        </Badge>
        <span className="text-base font-semibold tabular-nums">
          {currencyFormatter.format(product.price)}
        </span>
      </CardFooter>
    </Card>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="mb-2 size-10 rounded-lg" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3.5 w-1/3" />
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-4/5" />
      </CardContent>
      <CardFooter className="justify-between border-t bg-muted/50 py-3">
        <Skeleton className="h-5 w-20 rounded-4xl" />
        <Skeleton className="h-5 w-24" />
      </CardFooter>
    </Card>
  );
}
