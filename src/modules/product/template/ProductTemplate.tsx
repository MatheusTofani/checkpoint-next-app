"use client";

import { useState } from "react";
import { PackageOpenIcon } from "lucide-react";
import { getApiErrorMessage } from "@/src/api/api";
import { useProductApi } from "@/src/api/routes/product/useProductApi";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { useDebounce } from "@/src/hooks/use-debounce";
import { CardGrid } from "@/src/modules/common/components/CardGrid";
import { ListEmpty } from "@/src/modules/common/components/ListEmpty";
import { ListPagination } from "@/src/modules/common/components/ListPagination";
import { PageHeader } from "@/src/modules/common/components/PageHeader";
import { SearchInput } from "@/src/modules/common/components/SearchInput";
import { CreateProductDialog } from "../components/CreateProductDialog";
import { ProductCard, ProductCardSkeleton } from "../components/ProductCard";

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
      <PageHeader
        title="Produtos"
        description="Gerencie o catálogo de produtos"
        action={<CreateProductDialog />}
      />

      <SearchInput
        value={search}
        onChange={handleSearchChange}
        placeholder="Buscar por nome"
      />

      {isError ? (
        <Alert variant="destructive">
          <AlertDescription>
            {getApiErrorMessage(error, "Não foi possível carregar os produtos")}
          </AlertDescription>
        </Alert>
      ) : isPending ? (
        <CardGrid>
          {Array.from({ length: 8 }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </CardGrid>
      ) : data.items.length === 0 ? (
        <ListEmpty
          icon={PackageOpenIcon}
          title="Nenhum produto encontrado"
          description={
            debouncedSearch
              ? `Nenhum resultado para "${debouncedSearch}". Tente outro nome.`
              : "Cadastre o primeiro produto pelo botão \"Novo produto\"."
          }
        />
      ) : (
        <>
          <CardGrid stale={isPlaceholderData}>
            {data.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </CardGrid>
          <ListPagination
            pageInfo={data.pageInfo}
            onPageChange={setPage}
            itemLabel={["produto", "produtos"]}
          />
        </>
      )}
    </div>
  );
}
