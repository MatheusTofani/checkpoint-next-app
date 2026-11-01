"use client";

import { useState } from "react";
import { ShoppingCartIcon } from "lucide-react";
import { getApiErrorMessage } from "@/src/api/api";
import { useSaleApi } from "@/src/api/routes/sale/useSaleApi";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { dateInputToIso } from "@/src/lib/format";
import { CardGrid } from "@/src/modules/common/components/CardGrid";
import { ListEmpty } from "@/src/modules/common/components/ListEmpty";
import { ListPagination } from "@/src/modules/common/components/ListPagination";
import { PageHeader } from "@/src/modules/common/components/PageHeader";
import { CreateSaleDialog } from "../components/CreateSaleDialog";
import { SaleCard, SaleCardSkeleton } from "../components/SaleCard";
import { SaleFilters, type SaleFiltersValue } from "../components/SaleFilters";

const PAGE_SIZE = 12;

const emptyFilters: SaleFiltersValue = { from: "", to: "", paymentMethod: "", location: "" };

export default function SaleTemplate() {
  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);
  const hasFilters = Object.values(filters).some(Boolean);

  const { GetSales } = useSaleApi();
  const { data, isPending, isError, error, isPlaceholderData } = GetSales({
    SoldFrom: filters.from ? dateInputToIso(filters.from, "start") : undefined,
    SoldTo: filters.to ? dateInputToIso(filters.to, "end") : undefined,
    PaymentMethod: filters.paymentMethod || undefined,
    Location: filters.location || undefined,
    PageNumber: page,
    PageSize: PAGE_SIZE,
    Sort: "desc",
  });

  const handleFiltersChange = (value: SaleFiltersValue) => {
    setFilters(value);
    setPage(1);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Vendas"
        description="Vendas registradas na loja e online"
        action={<CreateSaleDialog />}
      />

      <SaleFilters value={filters} onChange={handleFiltersChange} />

      {isError ? (
        <Alert variant="destructive">
          <AlertDescription>
            {getApiErrorMessage(error, "Não foi possível carregar as vendas")}
          </AlertDescription>
        </Alert>
      ) : isPending ? (
        <CardGrid>
          {Array.from({ length: 8 }, (_, index) => (
            <SaleCardSkeleton key={index} />
          ))}
        </CardGrid>
      ) : data.items.length === 0 ? (
        <ListEmpty
          icon={ShoppingCartIcon}
          title="Nenhuma venda encontrada"
          description={
            hasFilters
              ? "Nenhuma venda com esses filtros. Tente ampliar o período."
              : "Registre a primeira venda pelo botão \"Nova venda\"."
          }
        />
      ) : (
        <>
          <CardGrid stale={isPlaceholderData}>
            {data.items.map((sale) => (
              <SaleCard key={sale.id} sale={sale} />
            ))}
          </CardGrid>
          <ListPagination
            pageInfo={data.pageInfo}
            onPageChange={setPage}
            itemLabel={["venda", "vendas"]}
          />
        </>
      )}
    </div>
  );
}
