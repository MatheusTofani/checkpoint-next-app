import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { leadQueryKey } from "../lead/useLeadApi";
import { SaleApi } from "./saleApi";
import { CreateSaleRequest, GetSalesParams, UpdateSaleRequest } from "./saleModels";

export const saleQueryKey = ["sale"] as const;

export function useSaleApi() {
    const saleApi = new SaleApi();
    const queryClient = useQueryClient();

    // Os detalhes do lead trazem o resumo das vendas, então mudam junto
    const invalidateSales = async () => {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: saleQueryKey }),
            queryClient.invalidateQueries({ queryKey: leadQueryKey }),
        ]);
    }

    const GetSales = (params?: GetSalesParams, options?: { enabled?: boolean }) => {
        return useQuery({
            queryKey: [...saleQueryKey, "list", params],
            enabled: options?.enabled ?? true,
            placeholderData: keepPreviousData,
            queryFn: async () => (await saleApi.getSales(params)).data,
        });
    }

    const GetSaleById = (id: string) => {
        return useQuery({
            queryKey: [...saleQueryKey, "byId", id],
            enabled: !!id,
            queryFn: async () => (await saleApi.getSaleById(id)).data,
        });
    }

    const CreateSale = () => {
        return useMutation({
            mutationFn: async (request: CreateSaleRequest) => (await saleApi.createSale(request)).data,
            onSuccess: invalidateSales,
        });
    }

    const UpdateSale = () => {
        return useMutation({
            mutationFn: async ({ id, ...request }: UpdateSaleRequest & { id: string }) =>
                (await saleApi.updateSale(id, request)).data,
            onSuccess: invalidateSales,
        });
    }

    const DeleteSale = () => {
        return useMutation({
            mutationFn: (id: string) => saleApi.deleteSale(id),
            onSuccess: invalidateSales,
        });
    }

    return { GetSales, GetSaleById, CreateSale, UpdateSale, DeleteSale };
}
