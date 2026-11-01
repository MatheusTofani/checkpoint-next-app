"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { PageInfoResponse } from "@/src/api/routes/common/commonModels";
import { Button } from "@/src/components/ui/button";

interface ProductPaginationProps {
  pageInfo: PageInfoResponse;
  onPageChange: (page: number) => void;
}

export function ProductPagination({ pageInfo, onPageChange }: ProductPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(pageInfo.total / pageInfo.pageSize));

  return (
    <nav
      aria-label="Paginação de produtos"
      className="flex items-center justify-between gap-2"
    >
      <p className="text-sm text-muted-foreground">
        {pageInfo.total} {pageInfo.total === 1 ? "produto" : "produtos"}
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
