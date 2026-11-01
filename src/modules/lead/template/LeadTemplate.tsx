"use client";

import { useState } from "react";
import { UsersIcon } from "lucide-react";
import { getApiErrorMessage } from "@/src/api/api";
import { useLeadApi } from "@/src/api/routes/lead/useLeadApi";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { useDebounce } from "@/src/hooks/use-debounce";
import { CardGrid } from "@/src/modules/common/components/CardGrid";
import { ListEmpty } from "@/src/modules/common/components/ListEmpty";
import { ListPagination } from "@/src/modules/common/components/ListPagination";
import { PageHeader } from "@/src/modules/common/components/PageHeader";
import { SearchInput } from "@/src/modules/common/components/SearchInput";
import { LeadCard, LeadCardSkeleton } from "../components/LeadCard";
import { LeadFormDialog } from "../components/LeadFormDialog";

const PAGE_SIZE = 12;

export default function LeadTemplate() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search.trim());

  const { GetLeads } = useLeadApi();
  const { data, isPending, isError, error, isPlaceholderData } = GetLeads({
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
        title="Leads"
        description="Clientes e contatos"
        action={<LeadFormDialog />}
      />

      <SearchInput
        value={search}
        onChange={handleSearchChange}
        placeholder="Buscar por nome"
      />

      {isError ? (
        <Alert variant="destructive">
          <AlertDescription>
            {getApiErrorMessage(error, "Não foi possível carregar os leads")}
          </AlertDescription>
        </Alert>
      ) : isPending ? (
        <CardGrid>
          {Array.from({ length: 8 }, (_, index) => (
            <LeadCardSkeleton key={index} />
          ))}
        </CardGrid>
      ) : data.items.length === 0 ? (
        <ListEmpty
          icon={UsersIcon}
          title="Nenhum lead encontrado"
          description={
            debouncedSearch
              ? `Nenhum resultado para "${debouncedSearch}". Tente outro nome.`
              : "Cadastre o primeiro lead pelo botão \"Novo lead\"."
          }
        />
      ) : (
        <>
          <CardGrid stale={isPlaceholderData}>
            {data.items.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </CardGrid>
          <ListPagination
            pageInfo={data.pageInfo}
            onPageChange={setPage}
            itemLabel={["lead", "leads"]}
          />
        </>
      )}
    </div>
  );
}
