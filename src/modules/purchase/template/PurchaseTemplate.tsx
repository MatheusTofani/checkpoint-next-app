"use client";

import { useState } from "react";
import { ShoppingBagIcon } from "lucide-react";
import { getApiErrorMessage } from "@/src/api/api";
import { usePurchaseApi } from "@/src/api/routes/purchase/usePurchaseApi";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { dateInputToIso } from "@/src/lib/format";
import { CardGrid } from "@/src/modules/common/components/CardGrid";
import { DateRangeFilter } from "@/src/modules/common/components/DateRangeFilter";
import { ListEmpty } from "@/src/modules/common/components/ListEmpty";
import { ListPagination } from "@/src/modules/common/components/ListPagination";
import { PageHeader } from "@/src/modules/common/components/PageHeader";
import { CreatePurchaseDialog } from "../components/CreatePurchaseDialog";
import { PurchaseCard, PurchaseCardSkeleton } from "../components/PurchaseCard";

const PAGE_SIZE = 12;

export default function PurchaseTemplate() {
  const [range, setRange] = useState({ from: "", to: "" });
  const [page, setPage] = useState(1);
  const hasFilters = !!(range.from || range.to);

  const { GetPurchases } = usePurchaseApi();
  const { data, isPending, isError, error, isPlaceholderData } = GetPurchases({
    PurchasedFrom: range.from ? dateInputToIso(range.from, "start") : undefined,
    PurchasedTo: range.to ? dateInputToIso(range.to, "end") : undefined,
    PageNumber: page,
    PageSize: PAGE_SIZE,
    Sort: "desc",
  });

  const handleRangeChange = (value: { from: string; to: string }) => {
    setRange(value);
    setPage(1);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Compras"
        description="Reposição de estoque"
        action={<CreatePurchaseDialog />}
      />

      <DateRangeFilter from={range.from} to={range.to} onChange={handleRangeChange} />

      {isError ? (
        <Alert variant="destructive">
          <AlertDescription>
            {getApiErrorMessage(error, "Não foi possível carregar as compras")}
          </AlertDescription>
        </Alert>
      ) : isPending ? (
        <CardGrid>
          {Array.from({ length: 8 }, (_, index) => (
            <PurchaseCardSkeleton key={index} />
          ))}
        </CardGrid>
      ) : data.items.length === 0 ? (
        <ListEmpty
          icon={ShoppingBagIcon}
          title="Nenhuma compra encontrada"
          description={
            hasFilters
              ? "Nenhuma compra nesse período. Tente ampliar as datas."
              : "Registre a primeira compra pelo botão \"Nova compra\"."
          }
        />
      ) : (
        <>
          <CardGrid stale={isPlaceholderData}>
            {data.items.map((purchase) => (
              <PurchaseCard key={purchase.id} purchase={purchase} />
            ))}
          </CardGrid>
          <ListPagination
            pageInfo={data.pageInfo}
            onPageChange={setPage}
            itemLabel={["compra", "compras"]}
          />
        </>
      )}
    </div>
  );
}
