"use client";

import { useState } from "react";
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
import { formatCurrency } from "@/src/lib/format";
import { DeleteProductDialog } from "./DeleteProductDialog";
import { ProductImage } from "./ProductImage";
import { UploadProductImageDialog } from "./UploadProductImageDialog";

interface ProductCardProps {
  product: ProductResponse;
}

export function ProductCard({ product }: ProductCardProps) {
  // A API grava a imagem sempre no mesmo caminho; muda a URL após o upload
  const [imageVersion, setImageVersion] = useState<number>();

  return (
    <Card className="pt-0">
      <div className="relative aspect-video border-b">
        <ProductImage product={product} version={imageVersion} />
        <div className="absolute top-2 right-2">
          <UploadProductImageDialog
            product={product}
            onUploaded={() => setImageVersion(Date.now())}
          />
        </div>
      </div>

      <CardHeader>
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
          {formatCurrency(product.price)}
        </span>
      </CardFooter>
    </Card>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className="pt-0">
      <Skeleton className="aspect-video rounded-none" />
      <CardHeader>
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
