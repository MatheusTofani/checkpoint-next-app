"use client";

import { useState, type ReactNode } from "react";
import { getApiErrorMessage } from "@/src/api/api";
import { useProductApi } from "@/src/api/routes/product/useProductApi";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { useDebounce } from "@/src/hooks/use-debounce";
import { cn } from "@/src/lib/utils";
import { CreateProductDialog } from "../components/CreateProductDialog";
import { ProductCard, ProductCardSkeleton } from "../components/ProductCard";
import { ProductEmpty } from "../components/ProductEmpty";
import { ProductFilters } from "../components/ProductFilters";
import { ProductPagination } from "../components/ProductPagination";

const PAGE_SIZE = 12;

export default function ProductTemplate() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search.trim());

  const { GetProducts } = useProductApi();
  const { data, isPending, isError, error, isPlaceholderData } = GetProducts({
    Name: debouncedSearch || undefined,
    PageNumber: page,
    PageSize: PAGE_SIZE,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Produtos</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie o catálogo de produtos
          </p>
        </div>
        <CreateProductDialog />
      </div>

      <ProductFilters search={search} onSearchChange={handleSearchChange} />

      {isError ? (
        <Alert variant="destructive">
          <AlertDescription>
            {getApiErrorMessage(error, "Não foi possível carregar os produtos")}
          </AlertDescription>
        </Alert>
      ) : isPending ? (
        <ProductGrid>
          {Array.from({ length: 8 }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </ProductGrid>
      ) : data.items.length === 0 ? (
        <ProductEmpty search={debouncedSearch} />
      ) : (
        <>
          <ProductGrid className={isPlaceholderData ? "opacity-60" : undefined}>
            {data.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
          <ProductPagination pageInfo={data.pageInfo} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

function ProductGrid({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
}
