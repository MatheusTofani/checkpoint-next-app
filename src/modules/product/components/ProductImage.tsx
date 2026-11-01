"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOffIcon, PackageIcon } from "lucide-react";
import { ProductApi } from "@/src/api/routes/product/productApi";
import type { ProductResponse } from "@/src/api/routes/product/productModels";

const productApi = new ProductApi();

interface ProductImageProps {
  product: ProductResponse;
  version?: number;
}

export function ProductImage({ product, version }: ProductImageProps) {
  const src = productApi.getProductImageUrl(product.id, version);
  // Guarda a URL que falhou: ao trocar a imagem (nova URL) tenta de novo
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!product.hasImage || failedSrc === src) {
    const Icon = product.hasImage ? ImageOffIcon : PackageIcon;
    return (
      <div className="flex size-full items-center justify-center bg-muted text-muted-foreground">
        <Icon className="size-10" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={product.name}
      fill
      // Rota autenticada pelo cookie de sessão, o otimizador do Next não teria acesso
      unoptimized
      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      className="object-cover"
      onError={() => setFailedSrc(src)}
    />
  );
}
