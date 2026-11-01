"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { PageInfoResponse } from "@/src/api/routes/common/commonModels";
import { Button } from "@/src/components/ui/button";

interface ListPaginationProps {
  pageInfo: PageInfoResponse;
  onPageChange: (page: number) => void;
  /** Nome do item no singular e no plural, ex.: ["produto", "produtos"]. */
  itemLabel: [singular: string, plural: string];
}

export function ListPagination({ pageInfo, onPageChange, itemLabel }: ListPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(pageInfo.total / pageInfo.pageSize));

  return (
    <nav aria-label="Paginação" className="flex items-center justify-between gap-2">
      <p className="text-sm text-muted-foreground">
        {pageInfo.total} {pageInfo.total === 1 ? itemLabel[0] : itemLabel[1]}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!pageInfo.hasPrevious}
          onClick={() => onPageChange(pageInfo.currentPage - 1)}
        >
          <ChevronLeftIcon data-icon="inline-start" />
          Anterior
        </Button>
        <span className="text-sm tabular-nums">
          {pageInfo.currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={!pageInfo.hasNext}
          onClick={() => onPageChange(pageInfo.currentPage + 1)}
        >
          Próxima
          <ChevronRightIcon data-icon="inline-end" />
        </Button>
      </div>
    </nav>
  );
}
