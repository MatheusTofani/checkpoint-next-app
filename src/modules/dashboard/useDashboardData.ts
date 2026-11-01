import { useQuery } from "@tanstack/react-query";
import type { PaginationResponse } from "@/src/api/routes/common/commonModels";
import { useLeadApi } from "@/src/api/routes/lead/useLeadApi";
import { ProductApi } from "@/src/api/routes/product/productApi";
import { productQueryKey } from "@/src/api/routes/product/useProductApi";
import { PurchaseApi } from "@/src/api/routes/purchase/purchaseApi";
import { purchaseQueryKey } from "@/src/api/routes/purchase/usePurchaseApi";
import { SaleApi } from "@/src/api/routes/sale/saleApi";
import { saleQueryKey } from "@/src/api/routes/sale/useSaleApi";
import { dateInputToIso } from "@/src/lib/format";

const PAGE_SIZE = 200;

// A API não tem endpoint de relatório: busca todas as páginas e agrega no cliente
async function fetchAllPages<T>(
  fetchPage: (page: number) => Promise<{ data: PaginationResponse<T> }>
) {
  const items: T[] = [];
  for (let page = 1; ; page++) {
    const { data } = await fetchPage(page);
    items.push(...data.items);
    if (!data.pageInfo.hasNext) return items;
  }
}

export interface DashboardFiltersValue {
  from: string;
  to: string;
  leadId: string;
  productId: string;
  category: string;
}

const saleApi = new SaleApi();
const purchaseApi = new PurchaseApi();
const productApi = new ProductApi();

export function useDashboardData(filters: DashboardFiltersValue) {
  const from = filters.from ? dateInputToIso(filters.from, "start") : undefined;
  const to = filters.to ? dateInputToIso(filters.to, "end") : undefined;
  const productId = filters.productId || undefined;

  const salesParams = { SoldFrom: from, SoldTo: to, LeadId: filters.leadId || undefined, ProductId: productId };
  const purchasesParams = { PurchasedFrom: from, PurchasedTo: to, ProductId: productId };

  // Ficam sob as mesmas chaves dos módulos para atualizar quando algo é criado/excluído
  const sales = useQuery({
    queryKey: [...saleQueryKey, "all", salesParams],
    queryFn: () =>
      fetchAllPages((page) => saleApi.getSales({ ...salesParams, PageNumber: page, PageSize: PAGE_SIZE })),
  });

  const purchases = useQuery({
    queryKey: [...purchaseQueryKey, "all", purchasesParams],
    queryFn: () =>
      fetchAllPages((page) =>
        purchaseApi.getPurchases({ ...purchasesParams, PageNumber: page, PageSize: PAGE_SIZE })
      ),
  });

  const products = useQuery({
    queryKey: [...productQueryKey, "all"],
    queryFn: () =>
      fetchAllPages((page) => productApi.getProducts({ PageNumber: page, PageSize: PAGE_SIZE })),
  });

  const { GetLeads } = useLeadApi();
  const leads = GetLeads({ PageSize: 100 });

  return { sales, purchases, products, leads };
}
